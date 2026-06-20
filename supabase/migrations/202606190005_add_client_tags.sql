alter table public.clients
add column if not exists client_tags jsonb not null default '[]'::jsonb;
