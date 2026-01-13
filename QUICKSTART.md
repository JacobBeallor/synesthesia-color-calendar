# Color³ Quick Start

Get Color³ up and running in 3 minutes.

---

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)

---

## Installation

### Option 1: Automated Setup (Recommended)

```bash
cd synesthesia-color-calendar
./scripts/setup.sh
npm run dev
```

### Option 2: Manual Setup

```bash
cd synesthesia-color-calendar

# Install dependencies
npm install

# Create environment file
echo 'DATABASE_URL="file:./dev.db"' > .env

# Initialize database
npx prisma migrate dev --name init

# Start development server
npm run dev
```

---

## Access the App

Open [http://localhost:3000](http://localhost:3000) in your browser.

If port 3000 is in use, Next.js will use 3001 or the next available port.

---

## Test the Features

### 1. Create a Personal Mapping

- Go to `/personal`
- Use the color pickers to assign colors to:
  - Months (12 pickers)
  - Days of week (7 pickers)
  - Days of month (31 pickers)
- Watch Color³ days appear automatically as you adjust colors!

### 2. View Color³ Days

- Your Color³ days appear in two formats:
  - **Calendar View**: Visual monthly calendars with highlighted dates
  - **List View**: Detailed list with dates and color families

### 3. Submit Your Mapping

- Click "Submit Anonymously" at the bottom of `/personal`
- No login required, no personal data collected

### 4. Explore Collective Patterns

- Go to `/collective` after submitting
- See aggregate data from all submissions:
  - Color distributions for each weekday
  - Color distributions for each month
  - Consensus analysis showing agreement vs variation

---

## Common Issues

### Port 3000 already in use

✓ Next.js automatically uses the next available port (3001, 3002, etc.)

### "Cannot find module '@prisma/client'"

```bash
npx prisma generate
```

### Database errors

```bash
npx prisma migrate reset  # Resets database
npx prisma migrate dev     # Recreates tables
```

### Changes not appearing

- Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Clear cache and reload

---

## Project Structure

```
synesthesia-color-calendar/
├── app/                    # Next.js pages
│   ├── page.tsx           # Landing page
│   ├── personal/          # Personal mapping interface
│   ├── collective/        # Aggregate visualization
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Core logic
│   ├── color.ts          # Color classification
│   ├── color3.ts         # Color³ day computation
│   └── db.ts             # Database client
└── prisma/               # Database schema and migrations
```

---

## Next Steps

- **Customize**: Edit color family ranges in `lib/color.ts`
- **Deploy**: See `DEPLOYMENT.md` for production deployment
- **Extend**: Add new visualizations or features
- **Share**: Get feedback from friends and portfolio reviewers

---

## Key Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build locally |
| `npx prisma studio` | Open database GUI |
| `npx prisma migrate dev` | Create new migration |

---

## Getting Help

- Read the full `README.md` for detailed information
- Check `DEPLOYMENT.md` for hosting instructions
- Review the `PRD.md` for product context and design decisions

---

## What Makes a Color³ Day?

A Color³ day occurs when the **color families** (not exact colors) match across:

1. Month (e.g., January)
2. Day of month (e.g., 17th)
3. Day of week (e.g., Friday)

Example:
- January → `#003366` → **blue family**
- Friday → `#87CEEB` → **blue family**
- The 17th → `#0066CC` → **blue family**

→ Any Friday, January 17th is a Color³ day! ✨

---

## Tips for Interesting Mappings

- **Trust your intuition**: There's no "correct" answer
- **Move quickly**: First instincts are often most authentic
- **Notice patterns**: Do certain months feel warmer? Days darker?
- **Vary saturation**: Not everything needs to be vibrant
- **Use the spectrum**: Don't be afraid of purples, cyans, and pinks

The most interesting submissions show personal patterns, not random colors or artificial variety.

---

Enjoy exploring your synesthetic color patterns! 🎨

