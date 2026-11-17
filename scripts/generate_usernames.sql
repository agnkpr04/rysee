-- Migration script to auto-generate username for existing users
-- Run this in your SQL editor (Supabase SQL Editor) AFTER running add_username_field.sql

-- Function to slugify text (lowercase, replace spaces with dashes, remove special chars)
CREATE OR REPLACE FUNCTION slugify(text TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Convert to lowercase
  text := lower(text);
  -- Replace spaces and special chars with dashes
  text := regexp_replace(text, '[^a-z0-9]+', '-', 'g');
  -- Remove leading/trailing dashes
  text := trim(both '-' from text);
  -- Limit to 50 chars
  text := substring(text from 1 for 50);
  RETURN text;
END;
$$ LANGUAGE plpgsql;

-- Function to generate unique username with increment
CREATE OR REPLACE FUNCTION generate_unique_username(base_username TEXT)
RETURNS TEXT AS $$
DECLARE
  final_username TEXT;
  counter INTEGER := 0;
BEGIN
  final_username := base_username;
  
  -- Check if username exists, if so, add increment
  WHILE EXISTS (SELECT 1 FROM "User" WHERE username = final_username) LOOP
    counter := counter + 1;
    final_username := base_username || counter;
  END LOOP;
  
  RETURN final_username;
END;
$$ LANGUAGE plpgsql;

-- Update existing users with generated usernames
UPDATE "User"
SET username = generate_unique_username(
  CASE 
    WHEN name IS NOT NULL AND name != '' THEN slugify(name)
    WHEN email IS NOT NULL THEN slugify(split_part(email, '@', 1))
    ELSE 'user' || id
  END
)
WHERE username IS NULL OR username = '';

-- Drop helper functions (optional - keep if needed for future use)
-- DROP FUNCTION IF EXISTS slugify(TEXT);
-- DROP FUNCTION IF EXISTS generate_unique_username(TEXT);
