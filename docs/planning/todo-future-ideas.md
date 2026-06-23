# TODO / Future / Ideas

This file is the parking lot for product ideas and follow-up work that should
not bloat the current implementation slice.

## Active TODO

- use [Product Backlog](./product-backlog.md) as the source of truth for phased product planning and implementation order
- tighten auth and setup routing so sign-in resolves directly into the user's attached organization instead of treating org selection as a daily screen
- simplify the current organization -> workspace model so most users belong to one org and enter the provider workspace without a picker
- improve the add-client flow with better validation, clearer intake fields, and a more intentional mobile/web presentation
- refine the client workspace around a care-first header strip plus charting history, not a profile-heavy EMR page
- move deeper client identity and admin details into a future info drawer attached to edit/details actions
- define the photo assignment model before finalizing Take Photo: client library photos, chart/session photos, consent-linked images, and unassigned captures need clear ownership
- harden auth after the core flow settles: web SSR auth, mobile secure token storage, and owner/admin MFA

## Future

- scheduling architecture brief before implementation: shared domain logic, platform-specific interaction layers, and drag/drop only where it truly helps
- restore image capture, upload, and consent workflows with Supabase Storage
- decide whether the bottom nav `Reports` slot should stay reports or become a higher-frequency clinical destination after capture/scheduling settle
- add richer provider/admin management once the provider workflow is stable
- improve chart forms to cover more of the legacy Swift treatment detail model
- explore a shared bottom navigation bar for the most common sections once the information architecture settles
- add cleaner audit and activity history once the core product surface is stable

## Ideas

- drag-and-drop scheduling or client ordering once the list and journal surfaces settle
- start session timer so an active treatment session can stay open, visible, and easy to chart against in real time
- web scheduling surface should support a modern drag-and-drop calendar while mobile uses touch-first reschedule patterns instead of forcing desktop behavior onto phones
- smarter chart templates based on treatment area or modality
- investor/demo mode with curated sample organizations and resettable seed data
- workflow automations for follow-up reminders, consent renewals, and care-plan nudges
- media assignment inbox: captured photos start as pending media, then attach to a chart entry, client photo library, body area, document, or consent record before becoming part of permanent clinical history

## Rules For Using This Doc

- ideas go here first unless they are part of the current branch's committed scope
- schema changes should not be added just because an idea exists here
- when an idea becomes active work, move it into the parity playbook or roadmap
