import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const marketKey = body.marketKey as string | undefined;

    if (!marketKey) {
      return NextResponse.json(
        { status: "error", message: "marketKey is required" },
        { status: 400 }
      );
    }

    const supabase = createServerSupabase();

    // 1. Check if snapshot is still fresh
    const { data: snapshot, error: snapshotError } = await supabase
      .from("market_snapshots")
      .select("market_key, expires_at, last_refreshed_at")
      .eq("market_key", marketKey)
      .maybeSingle();

    if (snapshotError) {
      return NextResponse.json(
        { status: "error", message: snapshotError.message },
        { status: 500 }
      );
    }

    if (snapshot?.expires_at && new Date(snapshot.expires_at) > new Date()) {
      return NextResponse.json({
        status: "fresh",
        message: "Market data is already fresh",
        snapshot,
      });
    }

    // 2. Check if a refresh is already pending/running
    const { data: activeRequest, error: activeError } = await supabase
      .from("refresh_requests")
      .select("id, market_key, status, created_at")
      .eq("market_key", marketKey)
      .in("status", ["pending", "running"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (activeError) {
      return NextResponse.json(
        { status: "error", message: activeError.message },
        { status: 500 }
      );
    }

    if (activeRequest) {
      return NextResponse.json({
        status: "queued",
        message: "A refresh is already in progress",
        request: activeRequest,
      });
    }

    // 3. Insert a new refresh request
    const { data: newRequest, error: insertError } = await supabase
      .from("refresh_requests")
      .insert({
        market_key: marketKey,
        status: "pending",
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json(
        { status: "error", message: insertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      status: "created",
      message: "Refresh request created",
      request: newRequest,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unknown server error";

    return NextResponse.json(
      { status: "error", message },
      { status: 500 }
    );
  }
}