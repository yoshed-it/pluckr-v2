alter table public.clients
add column if not exists preferred_name text;

update public.clients
set preferred_name = nullif(trim(concat_ws(' ', first_name, last_name)), '')
where preferred_name is null;
