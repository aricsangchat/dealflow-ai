import { createServerSupabase } from "@/lib/supabase/server";
import type { Property } from "@/lib/types";

export async function getCachedDeals(marketKey: string): Promise<Property[]> {
  const supabase = createServerSupabase();

  const { data, error } = await supabase
    .from("market_snapshots")
    .select("payload")
    .eq("market_key", marketKey)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return (data?.payload as Property[]) || [];
}