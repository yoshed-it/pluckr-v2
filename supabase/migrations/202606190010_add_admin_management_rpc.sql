create or replace function public.create_org_invite_link(
  target_organization_id uuid,
  recipient_email_input text,
  invite_role_input text default 'provider'
)
returns public.invite_links
language plpgsql
security definer
set search_path = public
as $$
declare
  created_invite public.invite_links%rowtype;
  normalized_role text;
begin
  if auth.uid() is null then
    raise exception 'Authenticated user required';
  end if;

  if not public.can_manage_org(target_organization_id) then
    raise exception 'Only organization admins can create invites';
  end if;

  if coalesce(trim(recipient_email_input), '') = '' then
    raise exception 'Recipient email is required';
  end if;

  normalized_role := lower(trim(invite_role_input));

  if normalized_role not in ('owner', 'admin', 'provider', 'viewer') then
    raise exception 'Invalid invite role';
  end if;

  insert into public.invite_links (
    organization_id,
    email,
    role,
    token,
    expires_at
  )
  values (
    target_organization_id,
    lower(trim(recipient_email_input)),
    normalized_role,
    encode(gen_random_bytes(16), 'hex'),
    timezone('utc', now()) + interval '7 days'
  )
  returning *
  into created_invite;

  return created_invite;
end;
$$;

create or replace function public.revoke_org_invite_link(invite_link_id_input uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_record public.invite_links%rowtype;
begin
  select *
  into invite_record
  from public.invite_links
  where id = invite_link_id_input;

  if invite_record.id is null then
    raise exception 'Invite link not found';
  end if;

  if not public.can_manage_org(invite_record.organization_id) then
    raise exception 'Only organization admins can revoke invites';
  end if;

  delete from public.invite_links where id = invite_link_id_input;
end;
$$;

create or replace function public.update_org_membership_role(
  membership_id_input uuid,
  new_role_input text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  membership_record public.organization_memberships%rowtype;
  normalized_role text;
begin
  select *
  into membership_record
  from public.organization_memberships
  where id = membership_id_input;

  if membership_record.id is null then
    raise exception 'Membership not found';
  end if;

  if not public.can_manage_org(membership_record.organization_id) then
    raise exception 'Only organization admins can update roles';
  end if;

  normalized_role := lower(trim(new_role_input));

  if normalized_role not in ('owner', 'admin', 'provider', 'viewer') then
    raise exception 'Invalid role';
  end if;

  if membership_record.role = 'owner' then
    raise exception 'Owner role cannot be changed';
  end if;

  update public.organization_memberships
  set role = normalized_role
  where id = membership_id_input;
end;
$$;

create or replace function public.update_org_provider_status(
  provider_id_input uuid,
  is_active_input boolean
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  provider_record public.providers%rowtype;
begin
  select *
  into provider_record
  from public.providers
  where id = provider_id_input;

  if provider_record.id is null then
    raise exception 'Provider not found';
  end if;

  if not public.can_manage_org(provider_record.organization_id) then
    raise exception 'Only organization admins can update provider status';
  end if;

  update public.providers
  set is_active = is_active_input
  where id = provider_id_input;
end;
$$;

revoke all on function public.create_org_invite_link(uuid, text, text) from public;
revoke all on function public.revoke_org_invite_link(uuid) from public;
revoke all on function public.update_org_membership_role(uuid, text) from public;
revoke all on function public.update_org_provider_status(uuid, boolean) from public;

grant execute on function public.create_org_invite_link(uuid, text, text) to authenticated;
grant execute on function public.revoke_org_invite_link(uuid) to authenticated;
grant execute on function public.update_org_membership_role(uuid, text) to authenticated;
grant execute on function public.update_org_provider_status(uuid, boolean) to authenticated;
