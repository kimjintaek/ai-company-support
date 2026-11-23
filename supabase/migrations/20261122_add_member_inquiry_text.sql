-- Run in Supabase SQL Editor before preview testing or production deployment.
-- Adds optional inquiry content to the existing member record.
ALTER TABLE public.members
ADD COLUMN IF NOT EXISTS inquiry_text TEXT;
