-- Add username field to User table
-- Run this in your SQL editor (Supabase SQL Editor)

ALTER TABLE "User" 
ADD COLUMN "username" TEXT;

-- Create unique index for username
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
