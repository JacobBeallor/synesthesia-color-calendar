#!/bin/bash

# Color³ Setup Script
# Automates the initial setup process

set -e

echo "🎨 Color³ Setup Script"
echo "======================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo 'DATABASE_URL="file:./dev.db"' > .env
  echo "✓ .env file created"
else
  echo "✓ .env file already exists"
fi

# Install dependencies
echo ""
echo "Installing dependencies..."
npm install
echo "✓ Dependencies installed"

# Run Prisma migrations
echo ""
echo "Setting up database..."
npx prisma migrate dev --name init
echo "✓ Database initialized"

# Generate Prisma client
echo ""
echo "Generating Prisma client..."
npx prisma generate
echo "✓ Prisma client generated"

echo ""
echo "✓ Setup complete!"
echo ""
echo "To start the development server, run:"
echo "  npm run dev"
echo ""
echo "The app will be available at http://localhost:3000"

