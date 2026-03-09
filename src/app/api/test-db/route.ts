import { createServerSupabase } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("market_snapshots")
    .insert({
      market_key: "phoenix-az",
      payload: { test: true },
      listing_count: 1,
      expires_at: new Date(Date.now() + 86400000),
    })
    .select();

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ success: true, data });
}