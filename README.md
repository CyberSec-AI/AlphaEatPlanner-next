# Alpha Eat Planner (Next.js Edition)

This is the modernized Full Stack Next.js version of Alpha Eat Planner.

## Prerequisites
- Docker & Docker Compose
- (Optional) Node.js 18+ for local development

## How to Run (Docker)
1. Navigate to this directory:
   ```bash
   cd next-planner
   ```
2. Build and start the container:
   ```bash
   docker-compose up --build -d
   ```
3. Open your browser: [http://localhost:3000](http://localhost:3000)

## How to Run (Local Dev)
1. Install dependencies:
   ```bash
   npm install
   ```
2. Initialize Database:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
3. Start Dev Server:
   ```bash
   npm run dev
   ```

## Accounts
- Default login: You will need to seed the database or register.
- Since we didn't implement a public register page (only login), you can use the Prisma Studio (`npx prisma studio`) or a seed script to create the first user.

### Seeding a User (Quick Fix)
To create a user manually via API (if you enabled registration) or directly in DB:
The current Auth setup checks against `User` table.
Password must be hashed.
