MASTERCLASS DEPLOYMENT README

Files added:
 - prisma/schema.prisma
 - prisma/supabase_setup.sql
 - frontend/pages/api/ai/converse.js
 - frontend/pages/api/spotify/auth.js
 - frontend/pages/api/spotify/callback.js
 - backend/routes/musical_dna.py
 - VERCEL_PREP_NOTES.txt (updated)

Essential env vars (set in Vercel/Supabase):
 - DATABASE_URL (Supabase Postgres)
 - MONGO_URI (MongoDB Atlas)
 - SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET / SPOTIFY_REDIRECT_URI
 - NEXT_PUBLIC_BASE_URL
 - SENTRY_DSN (optional)

Quick steps:
1. Push repo to GitHub and connect Vercel project.
2. Set environment variables in Vercel.
3. For Prisma: run `prisma generate` and push migrations to Supabase.
4. Deploy and test endpoints.
