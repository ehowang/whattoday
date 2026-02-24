import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateShortCode } from "@/lib/shortcode";

export async function POST() {
  const shortCode = generateShortCode();

  const { data, error } = await supabase
    .from("food_lists")
    .insert({ short_code: shortCode })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ shortCode: data.short_code });
}
