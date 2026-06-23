create table if not exists public.chart_entry_treatment_areas (
  id uuid primary key default gen_random_uuid(),
  chart_entry_id uuid not null references public.chart_entries(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  client_id uuid not null references public.clients(id) on delete cascade,
  sort_order integer not null default 0,
  treatment_area text not null,
  modality text,
  rf_level double precision,
  dc_level double precision,
  treatment_seconds integer,
  probe text,
  probe_is_one_piece boolean not null default true,
  notes text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index if not exists chart_entry_treatment_areas_chart_idx
on public.chart_entry_treatment_areas (chart_entry_id, sort_order);

create index if not exists chart_entry_treatment_areas_client_idx
on public.chart_entry_treatment_areas (client_id, created_at desc);

drop trigger if exists chart_entry_treatment_areas_set_updated_at
on public.chart_entry_treatment_areas;

create trigger chart_entry_treatment_areas_set_updated_at
before update on public.chart_entry_treatment_areas
for each row execute procedure public.set_updated_at();

alter table public.chart_entry_treatment_areas enable row level security;

drop policy if exists "org members can read chart treatment areas"
on public.chart_entry_treatment_areas;
drop policy if exists "org editors can insert chart treatment areas"
on public.chart_entry_treatment_areas;
drop policy if exists "org editors can update chart treatment areas"
on public.chart_entry_treatment_areas;
drop policy if exists "org managers can delete chart treatment areas"
on public.chart_entry_treatment_areas;

create policy "org members can read chart treatment areas"
on public.chart_entry_treatment_areas
for select
to authenticated
using (public.is_org_member(organization_id));

create policy "org editors can insert chart treatment areas"
on public.chart_entry_treatment_areas
for insert
to authenticated
with check (public.can_edit_org_data(organization_id));

create policy "org editors can update chart treatment areas"
on public.chart_entry_treatment_areas
for update
to authenticated
using (public.can_edit_org_data(organization_id))
with check (public.can_edit_org_data(organization_id));

create policy "org managers can delete chart treatment areas"
on public.chart_entry_treatment_areas
for delete
to authenticated
using (public.can_manage_org(organization_id));

insert into public.chart_entry_treatment_areas (
  chart_entry_id,
  organization_id,
  client_id,
  sort_order,
  treatment_area,
  modality,
  rf_level,
  dc_level,
  treatment_seconds,
  probe,
  probe_is_one_piece,
  notes,
  created_at,
  updated_at
)
select
  chart_entries.id,
  chart_entries.organization_id,
  chart_entries.client_id,
  0,
  coalesce(nullif(chart_entries.treatment_area, ''), 'Area not recorded'),
  chart_entries.modality,
  chart_entries.rf_level,
  chart_entries.dc_level,
  chart_entries.treatment_seconds,
  chart_entries.probe,
  chart_entries.probe_is_one_piece,
  chart_entries.notes,
  chart_entries.created_at,
  chart_entries.updated_at
from public.chart_entries
where not exists (
  select 1
  from public.chart_entry_treatment_areas existing_area
  where existing_area.chart_entry_id = chart_entries.id
)
and (
  chart_entries.treatment_area is not null
  or chart_entries.modality is not null
  or chart_entries.rf_level is not null
  or chart_entries.dc_level is not null
  or chart_entries.treatment_seconds is not null
  or chart_entries.probe is not null
  or chart_entries.notes is not null
);
