# Product Requirements Document (PRD)
## Project: Color³  
### Subtitle: *A playful exploration of synesthetic color patterns in time.*

---

## 1. Background & Context

**Color³** is a personal project inspired by synesthetic associations between time and color.  
A v1 prototype was built in Python + Streamlit and run locally, allowing a single user to assign colors to calendar components (month, day of month, day of week) and compute “Color³ days” — dates where all three color mappings align.

While v1 proved the concept, it was:
- Single-user
- Local-only
- Limited in visual expression
- Not easily shareable or extensible

v2 aims to turn Color³ into a **public, thoughtful, human-facing web product** that balances playfulness with analytical depth.

---

## 2. Goals & Non-Goals

### Goals (v2)
- Allow anonymous users to define their own color mappings for time
- Preserve expressive freedom in color choice
- Surface “Color³ days” clearly and delightfully
- Provide engaging visualizations of personal mappings
- Aggregate all submissions to reveal collective patterns
- Feel playful, curious, and human — not clinical
- Be polished enough to stand as a portfolio project

### Non-Goals (v2)
- User accounts or authentication
- Long-term user profiles or editing past submissions
- Scientific validation of synesthesia
- Mobile-first perfection
- Real-time collaboration or social features

---

## 3. Target Audience

Primary:
- Curious internet users who enjoy playful, introspective experiences

Secondary:
- Product, data, and design professionals reviewing the project as a portfolio artifact

The experience should feel welcoming and intuitive to the former, while signaling care, rigor, and taste to the latter.

---

## 4. Core Concepts & Definitions

### Color Mapping
A user assigns a color to:
- Each month (January–December)
- Each day of the month (1–31)
- Each day of the week (Sunday–Saturday)

Colors are selected freely via a color picker and may vary in hue, saturation, and brightness.

### Color Value vs Color Family
Each selected color is represented in two ways:

- **Color value**: the exact user-selected color (e.g., HEX or RGB)
- **Color family**: a normalized category derived from the color’s hue (e.g., blue, red, green)

Different shades of the same perceived color (e.g., sky blue and navy) are distinct color values but belong to the same color family.

This allows expressive, nuanced color choice while enabling meaningful pattern detection.

### Color³ Day
A **Color³ day** is a calendar date where the **color families** (not necessarily the exact color values) assigned to:
- the month,
- the day of the month, and
- the day of the week

all match.

For example:
- January = navy
- Friday = sky blue
- The 17th = teal  

If all three map to the **blue** color family, the date qualifies as a Color³ day.

Exact color matches are not required.

These days are rare by design and serve as the project’s central moment of delight and discovery.

---

## 5. Key User Flows

### Flow 1: Personal Exploration
1. User lands on the Color³ site
2. User assigns colors to:
   - Months
   - Days of month
   - Days of week
3. UI updates in real time to reflect choices
4. User sees:
   - Upcoming Color³ days
   - A calendar or timeline highlighting them
5. User explores visual summaries of their mappings, seeing both:
   - Exact color values
   - Underlying color families (when relevant)

### Flow 2: Collective Exploration
1. User navigates to a “Collective Patterns” view
2. User sees aggregate insights such as:
   - Most common color family for each weekday
   - Color-family distributions by month
   - Where people strongly agree vs diverge
3. Visuals emphasize patterns and curiosity over precision

---

## 6. Functional Requirements

### Personal Mapping
- Color picker for each:
  - Month
  - Day of month
  - Day of week
- No restrictions on shade or tone
- Immediate visual feedback
- Ability to recompute Color³ days instantly

### Color Classification
- Each selected color must be:
  - Stored as its original color value
  - Mapped deterministically to a color family
- Color family mapping should:
  - Be based primarily on hue
  - Be consistent and predictable
  - Be explainable to users in simple terms
- The system interprets colors; it does not constrain them

### Color³ Day Computation
- Identify Color³ days for:
  - The next N months (default: 12–24)
- Matching logic is based on **color families**
- Display results as:
  - Highlighted calendar view
  - Simple list of dates with associated colors

### Submission Handling
- Anonymous submission of mappings
- Mappings stored for aggregate analysis
- No personal identifiers collected

### Aggregate Analysis
- Aggregate across all submissions to compute:
  - Most common color family per month / weekday / day-of-month
  - Distribution and variability of color families
- Aggregates updated periodically (real-time updates not required)

---

## 7. UX & Design Principles

- **Playful, not gimmicky**
- **Clear before clever**
- **Color is the interface**
- **Expressive freedom over strict precision**
- Minimal text, strong visuals
- Gentle explanations via tooltips or captions

Where helpful, the UI may briefly explain:
> “Color³ days are based on color families, not exact shades.”

This explanation should be optional and non-intrusive.

Color³ should feel more like:
> “A thoughtful interactive exhibit”

than:
> “A data product.”

---

## 8. Technical Approach (Proposed)

### Frontend
- JavaScript-based frontend (e.g., React / Next.js)
- Modern styling system (e.g., Tailwind)
- Visualization components for:
  - Color grids
  - Calendars
  - Aggregate distributions

### Backend
- Lightweight API for:
  - Submitting color mappings
  - Fetching aggregate results
- Simple data store (e.g., Postgres, SQLite, or serverless DB)
- No authentication layer

### Data Model (High-Level)
- `submission_id`
- `month_colors` (values + families)
- `day_of_month_colors` (values + families)
- `day_of_week_colors` (values + families)
- `submitted_at`

Aggregate tables derived from submissions.

---

## 9. Success Metrics (Qualitative)

Since Color³ is not a growth-oriented product, success is defined by:
- Users completing the mapping flow
- Users discovering at least one Color³ day
- Users exploring both personal and collective views
- Feedback describing the project as:
  - “Thoughtful”
  - “Surprisingly human”
  - “Well-considered”
- The project standing out positively in portfolio reviews

---

## 10. Risks & Open Questions

- Color choice fatigue (31 + 12 + 7 selections)
- Choosing the right number of color families:
  - Too few → everything matches
  - Too many → nothing matches
- Ensuring users intuitively understand why a Color³ day appears
- Accessibility and contrast concerns for color vision differences

---

## 11. Future Directions (Explicitly Out of Scope for v2)

- User accounts and saved profiles
- Comparing individuals to the “average” user
- Additional synesthesia dimensions (letters, numbers, sounds)
- Heavy D3-based bespoke visualizations
- Scientific or clinical framing

---

## 12. Why Color³ Exists

Color³ is not about correctness or optimization.  
It exists to:
- Make internal mental models visible
- Find structure in subjective experience
- Explore how data products can feel personal and human

That tension — between rigor and play — is the heart of the project.
