alter table public.clients
add column if not exists address_line1 text,
add column if not exists address_line2 text,
add column if not exists address_city text,
add column if not exists address_region text,
add column if not exists address_postal_code text,
add column if not exists emergency_contact_name text,
add column if not exists emergency_contact_relationship text,
add column if not exists emergency_contact_phone text;
