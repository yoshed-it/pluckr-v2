# TODO / Future / Ideas

This file is the parking lot for product ideas and follow-up work that should
not bloat the current implementation slice.

## Active TODO

- finish Swift parity for the client journal and chart-entry workflow
- port client editing and deletion flows from the Swift app
- add invite-based organization joining instead of the current placeholder
- harden auth after parity work: web SSR auth, mobile secure token storage, and owner/admin MFA

## Future

- restore image capture, upload, and consent workflows with Supabase Storage
- add richer provider/admin management once the provider workflow is stable
- improve chart forms to cover more of the legacy Swift treatment detail model
- add cleaner audit and activity history once the core product surface is stable

## Ideas

- drag-and-drop scheduling or client ordering once the list and journal surfaces settle
- smarter chart templates based on treatment area or modality
- investor/demo mode with curated sample organizations and resettable seed data
- workflow automations for follow-up reminders, consent renewals, and care-plan nudges

## Rules For Using This Doc

- ideas go here first unless they are part of the current branch's committed scope
- schema changes should not be added just because an idea exists here
- when an idea becomes active work, move it into the parity playbook or roadmap
