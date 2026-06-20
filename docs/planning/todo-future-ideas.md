# TODO / Future / Ideas

This file is the parking lot for product ideas and follow-up work that should
not bloat the current implementation slice.

## Active TODO

- use [Product Backlog](./product-backlog.md) as the source of truth for phased product planning and implementation order
- finish Swift parity for the client journal and chart-entry workflow
- port client editing and deletion flows from the Swift app
- expand client detail beyond the current summary: richer notes, tags, and the rest of the legacy client metadata
- add invite-based organization joining instead of the current placeholder
- harden auth after parity work: web SSR auth, mobile secure token storage, and owner/admin MFA

## Future

- restore image capture, upload, and consent workflows with Supabase Storage
- add richer provider/admin management once the provider workflow is stable
- improve chart forms to cover more of the legacy Swift treatment detail model
- explore a shared bottom navigation bar for the most common sections once the information architecture settles
- add cleaner audit and activity history once the core product surface is stable

## Ideas

- drag-and-drop scheduling or client ordering once the list and journal surfaces settle
- start session timer so an active treatment session can stay open, visible, and easy to chart against in real time
- smarter chart templates based on treatment area or modality
- investor/demo mode with curated sample organizations and resettable seed data
- workflow automations for follow-up reminders, consent renewals, and care-plan nudges

## Rules For Using This Doc

- ideas go here first unless they are part of the current branch's committed scope
- schema changes should not be added just because an idea exists here
- when an idea becomes active work, move it into the parity playbook or roadmap
