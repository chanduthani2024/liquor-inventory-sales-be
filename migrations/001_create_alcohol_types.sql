-- Migration to create alcohol_types table and insert default data
-- This should be run once to initialize the alcohol types

-- Create alcohol_types table (if using manual migrations)
CREATE TABLE IF NOT EXISTS alcohol_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description VARCHAR(255),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add foreign key constraint to brands table
ALTER TABLE brands 
ADD COLUMN IF NOT EXISTS alcohol_type_id INTEGER REFERENCES alcohol_types(id);

-- Insert default alcohol types
INSERT INTO alcohol_types (name, description, display_order) VALUES
('Vodka', 'Premium vodka brands', 1),
('Low Cost Whisky', 'Budget-friendly whisky options', 2),
('Mid Cost Whisky', 'Mid-range whisky brands', 3),
('High Cost Whisky', 'Premium whisky collection', 4),
('Beer', 'Beer and lager varieties', 5),
('Rum', 'Rum and dark spirits', 6),
('Wine', 'Wine and champagne', 7)
ON CONFLICT (name) DO NOTHING;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_brands_alcohol_type_id ON brands(alcohol_type_id);
CREATE INDEX IF NOT EXISTS idx_alcohol_types_active ON alcohol_types(is_active) WHERE is_active = true;