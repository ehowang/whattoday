export interface FoodList {
  id: string;
  short_code: string;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string;
  list_id: string;
  name: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}
