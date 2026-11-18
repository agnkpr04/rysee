-- Add preview_images column to master_digital_products table
-- This migration adds the previewImages field without dropping any data

ALTER TABLE "master_digital_products" 
ADD COLUMN IF NOT EXISTS "preview_images" TEXT[];
