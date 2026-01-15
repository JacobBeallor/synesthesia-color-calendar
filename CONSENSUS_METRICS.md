# Consensus Metrics Implementation

## Overview

The Color³ app now includes sophisticated consensus analysis for all time units (days of week, months, and days of month). Each unit is classified based on normalized Shannon entropy and top color share.

## Classification System

### Metrics Computed

For each unit (e.g., "Monday", "January", "Day 15"):

1. **Top Share**: Percentage of selections for the most popular color family
   - Formula: `max(count_i) / total_count`

2. **Normalized Shannon Entropy**: Measure of distribution evenness
   - Formula: `H = -Σ(p_i * log(p_i)) / log(11)`
   - Range: 0 (complete agreement) to 1 (maximum disagreement)
   - Normalized by dividing by `log(11)` since there are 11 color families

### Classification Rules

- **Strong Agreement**
  - Normalized entropy ≤ 0.35 AND top share ≥ 60%
  - Indicates clear consensus on a single color

- **No Consensus** (Heavily Debated)
  - Normalized entropy ≥ 0.70 AND top share ≤ 40%
  - Indicates highly distributed opinions with no clear winner

- **Mixed**
  - Everything else
  - Indicates moderate variation or partial consensus

### Data Threshold

- Units require at least **10 responses** to be classified
- Below this threshold, status is "Not enough data"

## Visual Indicators

### Pie Chart Borders

Each pie chart in the Community Patterns page has a colored border indicating consensus:

- **Green border**: Strong agreement
- **Yellow border**: Mixed
- **Red border**: No consensus
- **Gray border**: Not enough data

### Tooltip Display

Hovering over a pie chart shows:
- Unit name
- Consensus status badge (color-coded)
- Top 3 color families with percentages

### Consensus & Variation Section

At the bottom of the Community page, units are grouped by consensus status:

- **Strong Agreement** (green): Shows top 5 units with clear consensus, including the winning color
- **Mixed** (yellow): Lists top 5 units with moderate variation
- **No Consensus** (red): Lists top 5 units with heavily debated color associations

## API Response Structure

```typescript
interface ConsensusMetrics {
  status: "Strong agreement" | "Mixed" | "No consensus" | "Not enough data";
  topShare: number;      // 0.00 to 1.00 (rounded to 2 decimals)
  entropy: number;       // 0.00 to 1.00 (rounded to 2 decimals)
  totalCount: number;    // Number of non-null responses
}

interface UnitData {
  counts: FamilyCount[];       // Sorted by count descending
  consensus: ConsensusMetrics;
}

interface AggregateData {
  totalSubmissions: number;
  months: Record<number, UnitData>;      // 0-11
  daysOfWeek: Record<number, UnitData>;  // 0-6
  daysOfMonth: Record<number, UnitData>; // 1-31
}
```

## Implementation Files

- **`/app/api/aggregate/route.ts`**: Server-side consensus calculation
- **`/app/collective/page.tsx`**: UI display of consensus metrics

## Stability

The normalization by `log(11)` ensures that:
- Thresholds remain stable if color family count changes
- Entropy values are interpretable (0-1 range)
- Classification rules are consistent across different sample sizes (above minimum threshold)

## Future Enhancements

Potential improvements:
- Adjustable thresholds based on user feedback
- Temporal analysis (consensus changes over time)
- Cross-unit correlation analysis (e.g., do people who see Monday as red also see January as red?)

