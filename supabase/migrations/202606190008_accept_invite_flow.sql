create or replace function public.accept_invite_link(invite_token_input text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid;
  current_user_email text;
  current_display_name text;
  invite_record public.invite_links%rowtype;
  membership_record public.organization_memberships%rowtype;
  provider_record public.providers%rowtype;
begin
  current_user_id := auth.uid();

  if current_user_id is null then
    raise exception 'Authenticated user required';
  end if;

  if coalesce(trim(invite_token_input), '') = '' then
    raise exception 'Invite token is required';
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

  select *
  into invite_record
  from public.invite_links
  where token = trim(invite_token_input)
  limit 1;

  if invite_record.id is null then
    raise exception 'Invite token not found';
  end if;

  if invite_record.accepted_at is not null then
    raise exception 'Invite token has already been used';
  end if;

  if invite_record.expires_at is not null
     and invite_record.expires_at < timezone('utc', now()) then
    raise exception 'Invite token has expired';
  end if;

  if current_user_email is null then
    raise exception 'Current user email is required';
  end if;

  if lower(invite_record.email) <> lower(current_user_email) then
    raise exception 'This invite was issued for a different email address';
  end if;

  insert into public.organization_memberships (
    organization_id,
    user_id,
    email,
    display_name,
    role
  )
  values (
    invite_record.organization_id,
    current_user_id,
    current_user_email,
    current_display_name,
    invite_record.role
  )
  on conflict (organization_id, user_id) do update
  set
    email = excluded.email,
    display_name = excluded.display_name,
    role = excluded.role,
    updated_at = timezone('utc', now())
  returning *
  into membership_record;

  insert into public.providers (
    organization_id,
    membership_id,
    full_name,
    title,
    handle,
    is_active
  )
  values (
    invite_record.organization_id,
    membership_record.id,
    coalesce(nullif(trim(current_display_name), ''), 'Provider'),
    initcap(invite_record.role),
    lower(regexp_replace(coalesce(current_display_name, split_part(current_user_email, '@', 1), 'provider'), '[^a-zA-Z0-9]+', '-', 'g')),
    true
  )
  on conflict do nothing;

  select *
  into provider_record
  from public.providers
  where organization_id = invite_record.organization_id
    and membership_id = membership_record.id
  limit 1;

  update public.invite_links
  set accepted_at = timezone('utc', now())
  where id = invite_record.id;

  return jsonb_build_object(
    'organization_id', invite_record.organization_id,
    'organization_name', (select name from public.organizations where id = invite_record.organization_id),
    'membership_id', membership_record.id,
    'role', membership_record.role,
    'provider_id', provider_record.id
  );
end;
$$;

revoke all on function public.accept_invite_link(text) from public;
grant execute on function public.accept_invite_link(text) to authenticated;
