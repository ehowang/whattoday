import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { generateShortCode } from "@/lib/shortcode";

const MAX_RETRIES = 3;

export async function POST() {
  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    const shortCode = generateShortCode();

    const { data, error } = await supabase
      .from("food_lists")
      .insert({ short_code: shortCode })
      .select()
      .single();

    if (!error) {
      return NextResponse.json({ shortCode: data.short_code });
    }

    // Retry on unique constraint violation
    if (error.code === "23505") continue;

    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(
    { error: "Failed to generate unique code, please try again" },
    { status: 500 }
  );
}
