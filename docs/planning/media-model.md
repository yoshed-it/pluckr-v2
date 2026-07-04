# Media Model

Pluckr photos should be client-owned clinical media first, then assigned to the
specific workflow context where they were captured or reviewed.

## Product Rule

A photo belongs to the client's gallery and may also be attached to one or more
clinical records.

For the current beta, the primary assignment is:

- client gallery photo
- attached chart/session photo

This means a treatment photo should appear in the client's Photos tab and also
on the chart entry it was captured with. The app should not duplicate the
underlying file to make that happen.

## Current Implementation

The current v2 storage path is:

1. Capture or select image in the platform wrapper.
2. Upload to the private Supabase `client-media` bucket.
3. Store the private storage path.
4. Attach the storage path to a chart entry through `chart_images`.
5. Resolve signed URLs only for display.

The `chart_images.chart_entry_id` column is nullable, which gives us room for
client-gallery media that is not yet assigned to a chart. Assigned chart photos
should use the same file path and a relationship row, not a copied file.

## Intended Direction

Near-term:

- Keep photos private in `client-media`.
- Require image consent before treatment photos are attached.
- Show chart-assigned photos in chart entries.
- Add a client Photos tab that reads all client media, grouped by assignment.

Future:

- Add explicit media records if `chart_images` becomes too narrow.
- Support unassigned captures that must be reviewed before becoming permanent.
- Support consent/document/media categories without duplicating storage.
- Support body-area/photo comparison metadata.
- Support non-destructive markup/drawing layers for annotations, treatment
  mapping, and progress comparison. Markup should be stored as overlay data or
  derived assets, not by overwriting the original clinical photo.
- Add audit logs for capture, view, assignment, removal, and export events.

## Non-Negotiables

- Do not save clinical photos to camera roll.
- Do not use public buckets for client media.
- Do not duplicate files just to display them in multiple places.
- Do not make photos chart-only; the client gallery is the long-term source of
  truth for browsing media.
- Do not add computer vision or AI processing until the deterministic media
  ownership model is clear.
