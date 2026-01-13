# Deployment Guide for Color³

This guide covers deploying Color³ to various platforms.

---

## Vercel (Recommended)

Vercel is the easiest deployment option for Next.js applications.

### Prerequisites

- GitHub/GitLab/Bitbucket account
- Vercel account (free tier available)
- Postgres database (recommended: Vercel Postgres or Neon)

### Steps

1. **Push your code to a Git repository**

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**

- Go to [vercel.com](https://vercel.com)
- Click "Add New Project"
- Import your Git repository
- Vercel will auto-detect Next.js settings

3. **Set up Postgres Database**

Option A: Vercel Postgres (easiest)
- In your Vercel project dashboard, go to Storage
- Create a new Postgres database
- It will automatically set the `DATABASE_URL` environment variable

Option B: Neon (free tier available)
- Sign up at [neon.tech](https://neon.tech)
- Create a new project
- Copy the connection string
- In Vercel, go to Settings → Environment Variables
- Add `DATABASE_URL` with your Neon connection string

4. **Update Prisma Schema for Postgres**

Edit `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "postgresql"  // Changed from "sqlite"
  url      = env("DATABASE_URL")
}
```

5. **Create a build script for migrations**

Add to `package.json`:

```json
{
  "scripts": {
    "build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

Or add a `vercel-build` script:

```json
{
  "scripts": {
    "vercel-build": "prisma generate && prisma migrate deploy && next build"
  }
}
```

6. **Deploy**

- Commit and push changes
- Vercel will automatically build and deploy
- First deployment will run migrations

7. **Verify**

- Visit your deployment URL
- Test creating a personal mapping
- Submit it and check the collective view

---

## Railway

Railway offers a simple deployment with built-in Postgres.

### Steps

1. **Sign up at [railway.app](https://railway.app)**

2. **Create a new project**

- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository

3. **Add Postgres**

- In your project, click "+ New"
- Select "Database" → "PostgreSQL"
- Railway will provision a database

4. **Configure environment**

- Railway will automatically set `DATABASE_URL`
- No manual configuration needed

5. **Update Prisma schema** to use `postgresql` (same as Vercel above)

6. **Deploy**

- Push to your repository
- Railway will build and deploy automatically

---

## Docker Deployment

For self-hosting or cloud VMs.

### Dockerfile

Create `Dockerfile` in project root:

```dockerfile
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set DATABASE_URL for build (will be overridden at runtime)
ENV DATABASE_URL="postgresql://placeholder"

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

USER nextjs

EXPOSE 3000

ENV PORT=3000

CMD ["node", "server.js"]
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/color3
    depends_on:
      - db

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=color3
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Build and run

```bash
docker-compose up -d
```

Then run migrations:

```bash
docker-compose exec app npx prisma migrate deploy
```

---

## Environment Variables

Required for all deployments:

- `DATABASE_URL`: Postgres connection string

Example:
```
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
```

---

## Post-Deployment Checklist

- [ ] Database migrations applied successfully
- [ ] Can access landing page (/)
- [ ] Can create color mappings (/personal)
- [ ] Color³ days compute correctly
- [ ] Can submit mappings (check browser console for errors)
- [ ] Collective page loads (/collective)
- [ ] Aggregate data displays after submissions

---

## Troubleshooting

### "Prisma Client not generated"

Run during build:
```bash
npx prisma generate
```

### "Database connection error"

- Verify `DATABASE_URL` is set correctly
- Check database is accessible from your hosting platform
- Ensure connection string includes `?schema=public` for Postgres

### "Migration failed"

Run manually:
```bash
npx prisma migrate deploy
```

### "Build fails on Vercel"

- Ensure `postinstall` script in package.json runs `prisma generate`
- Check build logs for specific error
- Verify all dependencies are in `dependencies` (not `devDependencies`)

---

## Performance Considerations

For production with many submissions:

1. **Add database indexes** (edit `prisma/schema.prisma`):

```prisma
model Submission {
  id        String   @id @default(uuid())
  createdAt DateTime @default(now()) @db.Timestamp(3)

  monthsJson      String
  daysOfMonthJson String
  daysOfWeekJson  String

  @@index([createdAt])
  @@map("submissions")
}
```

2. **Add caching** for aggregate endpoint:
   - Use Vercel's Edge Caching
   - Or implement Redis caching layer

3. **Rate limiting** on POST endpoint to prevent spam

---

## Monitoring

Recommended tools:

- **Vercel Analytics**: Built-in for Vercel deployments
- **Sentry**: Error tracking (add `@sentry/nextjs`)
- **Prisma Pulse**: Real-time database events (premium)

---

## Backup Strategy

For Postgres databases:

### Vercel Postgres
- Automatic backups included
- Point-in-time recovery available

### Neon
- Automatic daily backups
- Branch your database for testing

### Self-hosted
```bash
pg_dump $DATABASE_URL > backup.sql
```

Schedule regular backups via cron or your hosting platform.

---

## Cost Estimates

### Free Tier Options

| Platform | Database | Limits |
|----------|----------|--------|
| Vercel + Vercel Postgres | Included | 256 MB DB, 10K rows |
| Vercel + Neon | Free | 512 MB DB, 3 projects |
| Railway | $5/month | 512 MB RAM, 1 GB disk |

For a low-traffic portfolio project, free tiers are sufficient.

---

## Custom Domain

All platforms support custom domains:

1. Purchase domain (Namecheap, Google Domains, etc.)
2. In hosting dashboard, add custom domain
3. Update DNS records as instructed
4. SSL certificates are automatic

---

## Support

For deployment issues specific to Color³:
- Check GitHub Issues
- Review this guide
- Contact: [Your contact info]

For platform-specific issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Docker: [docs.docker.com](https://docs.docker.com)

