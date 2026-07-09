# Clinical Memory

Clinical Memory is Pluckr's long-term differentiator.

It should help providers remember what worked, compare outcomes, and plan the
next treatment without copying stale documentation or encouraging lazy charting.

This is not an AI feature first. It is a structured clinical recall system that
can become smarter over time.

## Product Principle

Pluckr should reduce repetitive thinking, not replace clinical judgment.

Clinical Memory should answer:

- What did we do last time?
- What worked for this client?
- What worked for similar treatments in this practice?
- What should the provider review before treating today?
- What patterns are emerging across charts, areas, modalities, settings, photos,
  and outcomes?

It should never silently copy prior documentation into a new chart.

## Memory Scopes

Clinical Memory needs multiple scopes. These must not be collapsed into one
generic recommendation engine.

### 1. Client Memory

Client Memory is the first implementation target.

It uses only the current client's historical data:

- prior chart entries
- treatment areas
- modality
- probe
- RF/DC/treatment seconds
- appointment duration
- notes
- tags
- photos
- skin reaction/pain/release quality once modeled
- provider comments

Example:

> Last upper lip session used Blend, F4 Gold, 0.3 DC, 0.8 RF, 3 seconds. Mild
> redness. 2 photos attached.

### 2. Area Memory

Area Memory is client-specific but grouped by treatment area.

It answers:

- What settings were used on this body area before?
- Did settings change over time?
- Which probe/modality is most common for this area?
- Are photos available for comparison?

This belongs near chart creation, especially after the provider selects a
treatment area.

### 3. Practice Memory

Practice Memory aggregates across all clients inside the same Organization /
Practice.

It should help a provider see patterns in their own clinical work:

- common settings by treatment area
- common probe choices
- typical appointment durations
- common notes/tags
- treatment-area trends
- photo comparison availability
- provider-specific patterns

This is what the user means by "pull from all clients" for the near-term product:
all clients the practice is allowed to access.

Practice Memory must respect role permissions and sensitive-media rules.

### 4. Provider Memory

Provider Memory aggregates across charts created by a specific provider.

It is useful when a practice has multiple providers:

- "Yosh usually uses..."
- "This provider's prior settings for this client..."
- "Practice average vs this provider's usual pattern..."

This should be available later, after roles and provider assignment are more
complete.

### 5. Pluckr Network Memory

Network Memory is future-only and must be privacy-preserving.

It may aggregate de-identified patterns across many practices, but only with
explicit product/legal design.

Network Memory must not expose:

- client identity
- provider identity
- practice identity
- raw notes
- raw photos
- unique rare cases
- genital/surgical prep details without strong aggregation thresholds

If implemented, it should use aggregated statistics and thresholding, not raw
cross-practice record lookup.

## Privacy Boundary

Clinical Memory can be powerful, but it is also high-risk.

Rules:

- Client-specific memory may use identifiable client data for that client's care.
- Practice Memory may aggregate within one Organization/Practice.
- Cross-practice learning must be de-identified, opt-in, and legally reviewed.
- Photos should never be used for network/global intelligence without explicit
  consent and a dedicated privacy model.
- Genital/surgical prep media should be treated as highest sensitivity.
- Raw chart notes should not be globally indexed across practices.
- Any future AI should cite source scope: client, practice, provider, or network.

## First Product Surface

The first Clinical Memory surface should be small and useful.

Recommended location:

- top of the chart editor
- compact-visible by default
- near treatment area selection
- later also on provider dashboard and client workspace

Initial card:

```text
Clinical Memory
Last upper lip treatment
Blend · F4 Gold · 0.8 RF · 0.3 DC · 3 sec
Mild redness · 2 photos
View prior chart
```

This should be read-only at first.

Do not implement:

- copy previous chart
- duplicate last session
- AI recommendation
- automatic setting application

## Future Product Surfaces

### Provider Dashboard

Dashboard memory should summarize what needs attention today:

- recent treatment patterns
- clients with photo comparisons available
- clients with incomplete charts
- clients due for follow-up
- last successful settings for today's folio clients

### Client Workspace

Client workspace memory should surface:

- last treatment per area
- treatment trend over time
- photo comparison affordance
- known sensitivities
- provider notes that matter during care

### Chart Editor

Chart editor memory should surface:

- previous relevant treatment for selected area
- fallback to most recent chart if area has no match
- practice-level common settings later
- photos from prior relevant sessions

### Reports

Reports can eventually use memory for:

- treatment totals
- area progress
- photo timelines
- insurance documentation support
- provider/practice analytics

## Data Model Direction

Clinical Memory should not be a separate truth source.

It should be derived from normalized clinical records:

- `clients`
- `chart_entries`
- `chart_entry_treatment_areas`
- `chart_images`
- future outcome fields
- future consent/media/document records

Possible future derived tables or views:

- `client_treatment_memory`
- `client_area_memory`
- `practice_treatment_patterns`
- `provider_treatment_patterns`
- `memory_snapshots`

These should be derived/cache tables, not primary clinical truth.

## Minimum Useful Data

Before Clinical Memory becomes powerful, chart entries need better outcome data.

Likely fields:

- release quality
- skin reaction
- pain/tolerance
- healing notes
- appointment duration
- treatment area
- modality
- probe
- RF
- DC
- treatment seconds
- notes
- tags
- photos

Do not overbuild this before providers test charting.

## Query Strategy

Start deterministic.

Client Memory:

- selected client
- selected treatment area if available
- most recent matching area
- fallback to most recent chart

Practice Memory:

- same organization
- same treatment area
- same modality when useful
- aggregate counts/averages/ranges
- exclude archived/deleted records
- respect permissions

Network Memory:

- future only
- aggregate and thresholded
- no raw PHI
- opt-in and compliance-reviewed

## UX Rules

Clinical Memory should feel like a calm clinical assistant, not a chatbot.

Rules:

- compact by default
- source is visible
- read-only unless provider chooses otherwise
- no hallucinated claims
- no black-box recommendations
- no large dashboard cards competing with charting
- provider remains in control

Language examples:

- "Previous for this area"
- "Common in this practice"
- "Photos available"
- "Provider note"
- "Trend"

Avoid:

- "AI says"
- "Recommended treatment"
- "Best setting"
- "Automatically apply"

## Implementation Phases

### Phase 1: Client Memory

- Improve the existing Previous Treatment reference.
- Include photos count and chart link.
- Make same-area matching reliable.
- Keep it read-only.

### Phase 2: Client Area Memory

- Add a compact area memory strip once treatment area is selected.
- Show most recent settings and recent trend.
- Include prior photos shortcut.

### Phase 3: Dashboard Memory

- Add a small Clinical Memory card to Provider Dashboard.
- Summarize latest care context for today's folio/recent clients.
- Do not add AI.

### Phase 4: Practice Memory

- Add aggregate practice patterns.
- Example: "Most upper lip Blend sessions in this practice use F3/F4 probes."
- Requires stronger permissions and outcome fields.

### Phase 5: Intelligence Layer

- Optional deterministic suggestions.
- Optional AI summaries.
- Requires auditability, source display, and privacy/legal review.

### Phase 6: Network Memory

- Future-only.
- De-identified, opt-in, aggregated, thresholded.
- Requires compliance architecture before product work.

## Non-Goals For Now

- Cross-practice raw data lookup
- AI chart writing
- automatic treatment plans
- global photo analysis
- body-map AI
- diagnosis
- replacing provider judgment

## Open Questions

- Should Practice Memory be visible to all providers or only owner/admin/provider
  roles with sufficient permissions?
- What outcome fields are essential for electrologists to consider a treatment
  "successful"?
- Should clients be able to see any Clinical Memory in the portal?
- How should genital/surgical prep areas be excluded or specially protected in
  aggregate analytics?
- What consent language is required before any future network-level learning?
