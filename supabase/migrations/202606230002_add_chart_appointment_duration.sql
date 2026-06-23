alter table public.chart_entries
add column if not exists appointment_duration_minutes integer;

alter table public.chart_entries
drop constraint if exists chart_entries_appointment_duration_minutes_check;

alter table public.chart_entries
add constraint chart_entries_appointment_duration_minutes_check
check (
  appointment_duration_minutes is null
  or (
    appointment_duration_minutes >= 0
    and appointment_duration_minutes <= 1440
  )
);
