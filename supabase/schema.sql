-- Food Lists
create table food_lists (
  id uuid primary key default gen_random_uuid(),
  short_code varchar(10) unique not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index idx_food_lists_short_code on food_lists(short_code);

-- Food Items
create table food_items (
  id uuid primary key default gen_random_uuid(),
  list_id uuid references food_lists(id) on delete cascade not null,
  name varchar(100) not null,
  image_url text,
  sort_order int default 0,
  created_at timestamptz default now()
);

create index idx_food_items_list_id on food_items(list_id);

-- Storage bucket (run in Supabase dashboard > Storage)
-- Create bucket: food-images (public)

-- RLS policies: allow all operations (no auth)
alter table food_lists enable row level security;
alter table food_items enable row level security;

create policy "Allow all on food_lists" on food_lists for all using (true) with check (true);
create policy "Allow all on food_items" on food_items for all using (true) with check (true);
