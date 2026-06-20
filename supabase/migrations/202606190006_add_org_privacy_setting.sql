alter table public.organizations
add column if not exists protect_sensitive_screens boolean not null default true;
