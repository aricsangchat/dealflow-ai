import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { getSaleListingsByCity } from "@/lib/providers/rentcast";
import { normalizeListing } from "@/lib/normalize";

function parseMarketKey(marketKey: string) {
  const [citySlug, state] = marketKey.split("-");
  const city =
    citySlug.charAt(0).toUpperCase() + citySlug.slice(1).toLowerCase();

  return { city, state: state?.toUpperCase() || "" };
}

export async function POST() {
  const supabase = createServerSupabase();

  // 1. find oldest pending request
  const { data: request, error: requestError } = await supabase
    .from("refresh_requests")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (requestError) {
    return NextResponse.json(
      { status: "error", message: requestError.message },
      { status: 500 }
    );
  }

  if (!request) {
    return NextResponse.json({
      status: "idle",
      message: "No pending refresh requests",
    });
  }

  // 2. mark request running
  const { error: runningError } = await supabase
    .from("refresh_requests")
    .update({
      status: "running",
      started_at: new Date().toISOString(),
    })
    .eq("id", request.id);

  if (runningError) {
    return NextResponse.json(
      { status: "error", message: runningError.message },
      { status: 500 }
    );
  }

  try {
    const { city, state } = parseMarketKey(request.market_key);

    // 3. fetch real listings
    const rawListings = await getSaleListingsByCity(city, state);

    // 4. normalize listings
    const listings = rawListings.map(normalizeListing);

    // 5. upsert market snapshot
    const now = new Date();
    const expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const { error: snapshotError } = await supabase
      .from("market_snapshots")
      .upsert(
        {
          market_key: request.market_key,
          payload: listings,
          listing_count: listings.length,
          last_refreshed_at: now.toISOString(),
          expires_at: expiresAt.toISOString(),
        },
        { onConflict: "market_key" }
      );

    if (snapshotError) {
      throw new Error(snapshotError.message);
    }

    // 6. mark request done
    const { error: doneError } = await supabase
      .from("refresh_requests")
      .update({
        status: "done",
        finished_at: new Date().toISOString(),
      })
      .eq("id", request.id);

    if (doneError) {
      throw new Error(doneError.message);
    }

    return NextResponse.json({
      status: "done",
      marketKey: request.market_key,
      listingsStored: listings.length,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown refresh error";

    await supabase
      .from("refresh_requests")
      .update({
        status: "failed",
        finished_at: new Date().toISOString(),
        error_message: message,
      })
      .eq("id", request.id);

    return NextResponse.json(
      { status: "failed", message },
      { status: 500 }
    );
  }
}