-- Add original_price column to master_digital_products
ALTER TABLE master_digital_products ADD COLUMN IF NOT EXISTS original_price INTEGER;

-- Add badge column to master_digital_products
ALTER TABLE master_digital_products ADD COLUMN IF NOT EXISTS badge VARCHAR(255);
