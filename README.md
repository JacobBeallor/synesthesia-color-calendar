# Color³

*A playful exploration of synesthetic color patterns in time.*

---

## Overview

Color³ is a web application that lets users map their personal color associations to calendar components (months, days of week, days of month) and discover **Color³ days** — rare dates where all three color families align.

This is version 2 of Color³, rebuilt as a modern web application with:
- Personal color mapping with real-time Color³ day discovery
- Anonymous submission system
- Collective aggregate analysis showing patterns across all submissions

Built as a portfolio project balancing playfulness with analytical rigor.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Prisma + SQLite (development), Postgres-compatible for production
- **Visualization**: Custom components with Recharts ready for enhanced charts

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**

```bash
cd synesthesia-color-calendar
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
DATABASE_URL="file:./dev.db"
```

For production deployment (e.g., Vercel), use a Postgres connection string:

```bash
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

4. **Initialize the database**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

This creates the SQLite database and generates the Prisma client.

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## Project Structure

```
synesthesia-color-calendar/
├── app/                        # Next.js App Router pages
│   ├── page.tsx               # Landing page
│   ├── personal/
│   │   └── page.tsx          # Personal mapping interface
│   ├── collective/
│   │   └── page.tsx          # Aggregate patterns view
│   ├── api/
│   │   ├── submissions/
│   │   │   └── route.ts      # POST endpoint for submissions
│   │   └── aggregate/
│   │       └── route.ts      # GET endpoint for aggregate data
│   ├── layout.tsx            # Root layout with navigation
│   └── globals.css           # Global styles
├── components/                # Reusable React components
│   ├── ColorPicker.tsx       # Color selection component
│   └── Color3Calendar.tsx    # Calendar visualization
├── lib/                       # Core logic and utilities
│   ├── color.ts              # Color classification (HEX→HSL, family mapping)
│   ├── color3.ts             # Color³ day computation
│   └── db.ts                 # Prisma client singleton
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── dev.db                # SQLite database (gitignored)
├── public/                    # Static assets
├── PRD.md                     # Product Requirements Document
├── README.md                  # This file
└── package.json
```

---

## Core Concepts

### Color Families

Each user-selected color is mapped to a **color family** based on its HSL values:

- **Hue-based**: red, orange, yellow, green, cyan, blue, purple, pink
- **Achromatic**: gray, black, white (based on saturation and lightness)

This allows users to choose any shade while enabling meaningful pattern detection.

### Color³ Days

A **Color³ day** occurs when the color families for:
1. The month
2. The day of the month
3. The day of the week

all match.

For example:
- January → blue family
- Friday → blue family  
- The 17th → blue family

→ Any Friday the 17th in January is a Color³ day.

The matching is intentionally lenient (family-based, not exact shades) to create moments of discovery.

---

## Database Schema

The application uses a simple schema optimized for anonymous submissions:

```prisma
model Submission {
  id              String   @id @default(uuid())
  createdAt       DateTime @default(now())
  monthsJson      String   // JSON: 12 ColorValue objects
  daysOfMonthJson String   // JSON: 31 ColorValue objects
  daysOfWeekJson  String   // JSON: 7 ColorValue objects
}
```

Each ColorValue contains:
```typescript
{
  hex: string;    // e.g., "#3B82F6"
  family: string; // e.g., "blue"
}
```

---

## API Endpoints

### `POST /api/submissions`

Submit a new color mapping.

**Request Body:**
```json
{
  "months": [{ "hex": "#...", "family": "..." }, ...],      // 12 items
  "daysOfMonth": [{ "hex": "#...", "family": "..." }, ...], // 31 items
  "daysOfWeek": [{ "hex": "#...", "family": "..." }, ...]   // 7 items
}
```

**Response:**
```json
{
  "success": true,
  "id": "uuid"
}
```

### `GET /api/aggregate`

Retrieve aggregate statistics across all submissions.

**Response:**
```json
{
  "totalSubmissions": 42,
  "months": {
    "0": [{ "family": "blue", "count": 15, "percentage": 36 }, ...],
    ...
  },
  "daysOfWeek": { ... },
  "daysOfMonth": { ... }
}
```

---

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your repository
   - Vercel auto-detects Next.js

3. **Configure Environment Variables**
   - Add `DATABASE_URL` with a Postgres connection string
   - For quick setup, use [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech)

4. **Update Prisma for Postgres**
   
   In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"  // changed from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

5. **Run migration on production database**
   ```bash
   npx prisma migrate deploy
   ```

6. **Deploy**
   - Vercel will automatically build and deploy
   - Prisma client generation happens during build via `postinstall` script

### Other Platforms

Color³ is a standard Next.js app and can be deployed to:
- Railway
- Render  
- DigitalOcean App Platform
- Any platform supporting Node.js

Ensure:
1. Set `DATABASE_URL` environment variable
2. Run Prisma migrations before first deployment
3. Use Postgres or another production-ready database

---

## Development Notes

### Adding Migrations

When you modify the Prisma schema:

```bash
npx prisma migrate dev --name descriptive_name
```

### Resetting the Database

To clear all data and reset:

```bash
npx prisma migrate reset
```

### Viewing Database Contents

```bash
npx prisma studio
```

Opens a GUI at `http://localhost:5555` to browse your data.

---

## Key Design Decisions

### 1. Color Family Classifier

Colors are classified deterministically based on HSL values:
- Hue ranges define color families (e.g., 200-260° = blue)
- Low saturation colors (< 10%) are classified as gray/black/white
- See `lib/color.ts` for implementation details

### 2. Anonymous Submissions

No user accounts or authentication. Each submission is:
- Stored with a UUID
- Timestamped
- Not editable after submission

This reduces friction while enabling aggregate analysis.

### 3. Client-Side Computation

Color³ days are computed in real-time on the client:
- Instant feedback as users adjust colors
- No server round-trips for preview
- See `lib/color3.ts` for logic

### 4. Visual Design

- Minimal, typography-focused interface
- Color as the primary UI element
- Subtle explanations (tooltips, helper text)
- Dark mode support via Tailwind

---

## Future Enhancements (Out of Scope for v2)

- User accounts for saving/editing mappings
- Comparison to aggregate "average"
- Additional synesthesia dimensions (letters, numbers, sounds)
- Advanced D3-based visualizations
- Mobile-optimized experience

---

## License

This is a personal portfolio project. Code is available for reference.

---

## Contact

Built by Jacob Beallor  
Portfolio: [Coming Soon]

For questions or feedback about this project, feel free to reach out!

