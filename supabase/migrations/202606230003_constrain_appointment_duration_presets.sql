alter table public.chart_entries
drop constraint if exists chart_entries_appointment_duration_minutes_check;

alter table public.chart_entries
add constraint chart_entries_appointment_duration_minutes_check
check (
  appointment_duration_minutes is null
  or appointment_duration_minutes in (15, 30, 45, 60, 75, 90, 120)
);
