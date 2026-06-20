/*
  Pluckr v2 migration 0002

  Purpose:
  - add organization metadata used by the Swift flow
  - bootstrap owner membership and provider records automatically
  - expose a demo seed RPC so web and mobile can create believable investor data
*/

alter table public.organizations
add column if not exists description text;

alter table public.organizations
add column if not exists created_by_user_id uuid references auth.users(id) on delete set null;

create or replace function public.set_organization_creator()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.created_by_user_id is null then
    new.created_by_user_id := auth.uid();
  end if;

  return new;
end;
$$;

drop trigger if exists organizations_set_creator on public.organizations;
create trigger organizations_set_creator
before insert on public.organizations
for each row execute procedure public.set_organization_creator();

create or replace function public.bootstrap_organization_owner()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  current_user_email text;
  current_display_name text;
begin
  current_user_id := coalesce(new.created_by_user_id, auth.uid());

  if current_user_id is null then
    raise exception 'Authenticated user required to create organization';
  end if;

  select
    user_record.email,
    coalesce(
      user_record.raw_user_meta_data ->> 'display_name',
      user_record.raw_user_meta_data ->> 'full_name',
      split_part(user_record.email, '@', 1)
    )
  into current_user_email, current_display_name
  from auth.users as user_record
  where user_record.id = current_user_id;

  insert into public.organization_memberships (
    organization_id,
    user_id,
    email,
    display_name,
    role
  )
  values (
    new.id,
    current_user_id,
    current_user_email,
    current_display_name,
    'owner'
  )
  on conflict (organization_id, user_id) do update
  set
    email = excluded.email,
    display_name = excluded.display_name,
    role = 'owner',
    updated_at = timezone('utc', now());

  insert into public.providers (
    organization_id,
    membership_id,
    full_name,
    title,
    handle,
    is_active
  )
  select
    new.id,
    membership.id,
    coalesce(current_display_name, 'Organization Owner'),
    'Owner',
    lower(regexp_replace(coalesce(current_display_name, split_part(current_user_email, '@', 1), 'owner'), '[^a-zA-Z0-9]+', '-', 'g')),
    true
  from public.organization_memberships as membership
  where membership.organization_id = new.id
    and membership.user_id = current_user_id
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists organizations_bootstrap_owner on public.organizations;
create trigger organizations_bootstrap_owner
after insert on public.organizations
for each row execute procedure public.bootstrap_organization_owner();

create or replace function public.seed_demo_organization(target_organization_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_clients integer;
  acting_provider_id uuid;
  first_client_id uuid;
  second_client_id uuid;
  third_client_id uuid;
begin
  if auth.uid() is null then
    raise exception 'Authenticated user required';
  end if;

  if not public.can_manage_org(target_organization_id) then
    raise exception 'Only organization owners or admins can seed demo data';
  end if;

  select count(*)
  into existing_clients
  from public.clients
  where organization_id = target_organization_id;

  if existing_clients > 0 then
    return jsonb_build_object(
      'status', 'skipped',
      'reason', 'organization already has client records'
    );
  end if;

  select provider.id
  into acting_provider_id
  from public.providers as provider
  join public.organization_memberships as membership
    on membership.id = provider.membership_id
  where provider.organization_id = target_organization_id
    and membership.user_id = auth.uid()
  limit 1;

  if acting_provider_id is null then
    select provider.id
    into acting_provider_id
    from public.providers as provider
    where provider.organization_id = target_organization_id
    order by provider.created_at asc
    limit 1;
  end if;

  insert into public.clients (
    organization_id,
    first_name,
    last_name,
    pronouns,
    phone,
    email,
    notes,
    last_seen_at
  ) values (
    target_organization_id,
    'Avery',
    'Cruz',
    'she/her',
    '(503) 555-0141',
    'avery.cruz@example.com',
    'Consistent client with excellent aftercare follow-through.',
    timezone('utc', now()) - interval '1 day'
  ) returning id into first_client_id;

  insert into public.clients (
    organization_id,
    first_name,
    last_name,
    pronouns,
    phone,
    email,
    notes,
    last_seen_at
  ) values (
    target_organization_id,
    'Jordan',
    'Lee',
    'they/them',
    '(503) 555-0167',
    'jordan.lee@example.com',
    'Prefers shorter sessions and clear treatment summaries.',
    timezone('utc', now()) - interval '3 days'
  ) returning id into second_client_id;

  insert into public.clients (
    organization_id,
    first_name,
    last_name,
    pronouns,
    phone,
    email,
    notes,
    last_seen_at
  ) values (
    target_organization_id,
    'Maya',
    'Thompson',
    'she/her',
    '(503) 555-0183',
    'maya.thompson@example.com',
    'New client onboarding completed and consent captured.',
    timezone('utc', now()) - interval '6 days'
  ) returning id into third_client_id;

  insert into public.chart_entries (
    organization_id,
    client_id,
    provider_id,
    treatment_area,
    modality,
    notes,
    treatment_summary,
    tags,
    created_at,
    updated_at
  ) values
  (
    target_organization_id,
    first_client_id,
    acting_provider_id,
    'Upper lip',
    'Blend',
    'Tolerated treatment well. Mild erythema resolved before departure.',
    'Follow-up in 2 weeks recommended.',
    '["follow-up", "photo-ready"]'::jsonb,
    timezone('utc', now()) - interval '1 day',
    timezone('utc', now()) - interval '1 day'
  ),
  (
    target_organization_id,
    second_client_id,
    acting_provider_id,
    'Chin',
    'Thermolysis',
    'Adjusted intensity down slightly after first pass for comfort.',
    'Client reported improved comfort and wants same settings next session.',
    '["sensitivity", "settings-adjusted"]'::jsonb,
    timezone('utc', now()) - interval '3 days',
    timezone('utc', now()) - interval '3 days'
  ),
  (
    target_organization_id,
    third_client_id,
    acting_provider_id,
    'Neck',
    'Blend',
    'Initial intake chart completed with baseline photo notes.',
    'Schedule second session after skin response review.',
    '["new-client", "intake"]'::jsonb,
    timezone('utc', now()) - interval '6 days',
    timezone('utc', now()) - interval '6 days'
  );

  return jsonb_build_object(
    'status', 'seeded',
    'clients_created', 3,
    'charts_created', 3
  );
end;
$$;

grant execute on function public.seed_demo_organization(uuid) to authenticated;
