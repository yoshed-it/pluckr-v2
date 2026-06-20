alter table public.providers
add column if not exists phone text;

drop policy if exists "providers can update own profile" on public.providers;

create policy "providers can update own profile"
on public.providers
for update
to authenticated
using (
  exists (
    select 1
    from public.organization_memberships membership
    where membership.id = providers.membership_id
      and membership.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.organization_memberships membership
    where membership.id = providers.membership_id
      and membership.user_id = auth.uid()
  )
);
