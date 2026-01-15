# Deployment Guide

## Environment Variables

The following environment variables are required:

```
DATABASE_URL="postgresql://..."
```

This will be automatically set by Vercel when you connect Vercel Postgres.

## Deployment Steps

### 1. Prerequisites
- GitHub repository with your code
- Vercel account

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Click "Deploy"

### 3. Set Up Database
1. In your Vercel project dashboard, go to "Storage"
2. Click "Create Database" → "Postgres"
3. Vercel will automatically set the `DATABASE_URL` environment variable
4. Redeploy your project (or it will auto-deploy)

### 4. Initialize Database Schema
After deployment, run this command locally with your production database URL:

```bash
# Pull environment variables from Vercel
npx vercel env pull .env.production

# Push database schema to production
npx prisma db push
```

Or manually with your production DATABASE_URL:
```bash
DATABASE_URL="your_vercel_postgres_url" npx prisma db push
```

### 5. Verify
Visit your deployed site and test:
- Submit a color mapping
- View the Community page
- Check that consensus analysis appears

## Local Development

For local development, use SQLite by updating `prisma/schema.prisma`:

```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

And set in `.env`:
```
DATABASE_URL="file:./dev.db"
```

Then run:
```bash
npx prisma migrate dev
```
