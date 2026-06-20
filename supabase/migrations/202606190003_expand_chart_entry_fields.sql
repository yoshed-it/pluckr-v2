alter table public.chart_entries
add column if not exists rf_level double precision,
add column if not exists dc_level double precision,
add column if not exists probe text,
add column if not exists probe_is_one_piece boolean not null default true,
add column if not exists image_urls jsonb not null default '[]'::jsonb;
