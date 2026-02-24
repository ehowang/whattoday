import { supabase } from "@/lib/supabase";
import { notFound } from "next/navigation";
import type { FoodItem, FoodList } from "@/lib/types";
import SlotMachineClient from "./SlotMachineClient";

interface Props {
  params: Promise<{ shortCode: string }>;
}

export default async function SlotMachinePage({ params }: Props) {
  const { shortCode } = await params;

  const { data: list } = await supabase
    .from("food_lists")
    .select("*")
    .eq("short_code", shortCode)
    .single();

  if (!list) notFound();

  const { data: items } = await supabase
    .from("food_items")
    .select("*")
    .eq("list_id", list.id)
    .order("sort_order", { ascending: true });

  return (
    <SlotMachineClient
      list={list as FoodList}
      initialItems={(items as FoodItem[]) || []}
    />
  );
}
