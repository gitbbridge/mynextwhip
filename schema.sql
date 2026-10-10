-- ============================================================================
-- MyNextWhip - Database Schema (PostgreSQL + PostGIS)
-- Denver Metro Local Vehicle Marketplace with Stripe Anti-Flake Hold & Scaled Monetization
-- ============================================================================

-- Enable PostGIS extension for hyper-local Denver proximity queries
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================================
-- 1. VEHICLE LISTINGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    seller_id UUID NOT NULL,
    vin VARCHAR(17) UNIQUE NOT NULL,
    year INT NOT NULL,
    make VARCHAR(50) NOT NULL,
    model VARCHAR(50) NOT NULL,
    trim VARCHAR(50),
    asking_price NUMERIC(10, 2) NOT NULL,
    odometer INT,
    transmission VARCHAR(20) DEFAULT 'Automatic',
    clean_title BOOLEAN DEFAULT TRUE,
    title_status VARCHAR(30) DEFAULT 'Clean Blue Colorado Title in Hand',
    listing_type VARCHAR(20) NOT NULL CHECK (listing_type IN ('BUY_IT_NOW', 'LIVE_AUCTION')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('ACTIVE', 'COMMITTED', 'SETTLED', 'ABANDONED')) DEFAULT 'ACTIVE',
    location_gps GEOMETRY(Point, 4326), -- PostGIS Spatial Point (SRID 4326: WGS 84, Lon/Lat)
    city VARCHAR(50) DEFAULT 'Denver',
    zip VARCHAR(10) DEFAULT '80202',
    video_cold_start_url TEXT,
    photos JSONB DEFAULT '[]'::jsonb,
    whip_report JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Spatial index for radius searches (e.g., within 25 miles of Denver Capitol 39.7392° N, 104.9903° W)
CREATE INDEX IF NOT EXISTS idx_listings_location_gps ON listings USING GIST (location_gps);
CREATE INDEX IF NOT EXISTS idx_listings_status ON listings (status);
CREATE INDEX IF NOT EXISTS idx_listings_seller_id ON listings (seller_id);
CREATE INDEX IF NOT EXISTS idx_listings_asking_price ON listings (asking_price);
CREATE INDEX IF NOT EXISTS idx_listings_listing_type ON listings (listing_type);

-- ============================================================================
-- 2. TRANSACTIONS TABLE
-- Anti-Flake $25 Pre-Authorization Holds & Settlement Fee Management
-- ============================================================================
CREATE TABLE IF NOT EXISTS transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    listing_id UUID NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
    buyer_id UUID NOT NULL,
    seller_id UUID NOT NULL,
    stripe_payment_intent_id VARCHAR(255) NOT NULL, -- Tracks the initial $25 pre-authorization hold
    hold_amount NUMERIC(10, 2) DEFAULT 25.00 NOT NULL,
    final_price NUMERIC(10, 2), -- Populated when keys change hands or auction hammers
    performance_fee NUMERIC(10, 2), -- $25, $49, $95, $99, or $149 based on asset tier & format
    status VARCHAR(30) NOT NULL CHECK (status IN ('HOLD_AUTHORIZED', 'CAPTURED_PERFORMANCE', 'CAPTURED_PENALTY', 'RELEASED_VOID')) DEFAULT 'HOLD_AUTHORIZED',
    payout_to_seller_amount NUMERIC(10, 2) DEFAULT 0.00,
    scheduled_meet_time TIMESTAMP WITH TIME ZONE,
    resolution_note TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transactions_listing_id ON transactions (listing_id);
CREATE INDEX IF NOT EXISTS idx_transactions_buyer_id ON transactions (buyer_id);
CREATE INDEX IF NOT EXISTS idx_transactions_seller_id ON transactions (seller_id);
CREATE INDEX IF NOT EXISTS idx_transactions_status ON transactions (status);
CREATE INDEX IF NOT EXISTS idx_transactions_stripe_pi ON transactions (stripe_payment_intent_id);

-- ============================================================================
-- 3. TRANSACTION ADDONS TABLE (Point-of-intent ecosystem services)
-- ============================================================================
CREATE TABLE IF NOT EXISTS transaction_addons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
    addon_type VARCHAR(30) NOT NULL CHECK (addon_type IN ('FLATBED_TOWING', 'MOBILE_PPI', 'TEMP_INSURANCE')),
    name VARCHAR(100) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    stripe_charge_id VARCHAR(255),
    status VARCHAR(20) NOT NULL CHECK (status IN ('REQUESTED', 'AUTHORIZED', 'CAPTURED', 'CANCELLED')) DEFAULT 'REQUESTED',
    details TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_transaction_addons_tx_id ON transaction_addons (transaction_id);
CREATE INDEX IF NOT EXISTS idx_transaction_addons_status ON transaction_addons (status);

-- ============================================================================
-- 4. AUTO-UPDATE TIMESTAMP TRIGGER
-- ============================================================================
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_listings_updated_at ON listings;
CREATE TRIGGER trg_listings_updated_at
    BEFORE UPDATE ON listings
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trg_transactions_updated_at ON transactions;
CREATE TRIGGER trg_transactions_updated_at
    BEFORE UPDATE ON transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp_column();

-- ============================================================================
-- EXAMPLE POSTGIS QUERY: Find active whips within 25 miles of Denver Civic Center
-- ST_DWithin uses spherical geography calculation in meters (25 miles = ~40,233.6m)
-- ============================================================================
-- SELECT id, make, model, asking_price,
--        ST_Distance(location_gps, ST_SetSRID(ST_MakePoint(-104.9903, 39.7392), 4326)::geography) / 1609.34 AS distance_miles
-- FROM listings
-- WHERE status = 'ACTIVE'
--   AND ST_DWithin(location_gps, ST_SetSRID(ST_MakePoint(-104.9903, 39.7392), 4326)::geography, 40233.6)
-- ORDER BY distance_miles ASC;
