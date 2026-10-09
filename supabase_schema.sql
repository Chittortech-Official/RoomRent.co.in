-- =========================================================
-- ROOMRENT.CO.IN — SUPABASE DATABASE SCHEMA + RLS
-- =========================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================
-- 1. FUNCTIONS & TRIGGERS
-- =========================================================

-- updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Secure admin check function (SECURITY DEFINER to bypass RLS internally)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
    user_role TEXT;
BEGIN
    SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
    RETURN user_role = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =========================================================
-- 2. TABLES CREATION
-- =========================================================

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'owner', 'admin')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTIES
CREATE TABLE IF NOT EXISTS public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    property_type TEXT NOT NULL CHECK (property_type IN ('room', 'pg', 'hostel', 'flat', 'apartment', '1_bhk', '2_bhk', '3_bhk')),
    rent NUMERIC NOT NULL CHECK (rent >= 0),
    deposit NUMERIC CHECK (deposit >= 0),
    area_sqft NUMERIC CHECK (area_sqft > 0),
    bedrooms INTEGER CHECK (bedrooms >= 0),
    bathrooms INTEGER CHECK (bathrooms >= 0),
    furnishing TEXT,
    city TEXT NOT NULL DEFAULT 'Hyderabad',
    locality TEXT NOT NULL,
    address TEXT,
    landmark TEXT,
    amenities JSONB DEFAULT '[]'::jsonb,
    availability_status TEXT NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'rented')),
    approval_status TEXT NOT NULL DEFAULT 'pending' CHECK (approval_status IN ('pending', 'approved', 'rejected')),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- PROPERTY IMAGES
CREATE TABLE IF NOT EXISTS public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    storage_path TEXT,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FAVORITES
CREATE TABLE IF NOT EXISTS public.favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, property_id)
);

-- PROPERTY REPORTS
CREATE TABLE IF NOT EXISTS public.property_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES public.properties(id) ON DELETE CASCADE,
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    details TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =========================================================
-- 3. APPLY TRIGGERS
-- =========================================================

-- Trigger to automatically create a profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (NEW.id, NEW.email, 'user');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at triggers
DROP TRIGGER IF EXISTS set_updated_at_profiles ON public.profiles;
CREATE TRIGGER set_updated_at_profiles
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_properties ON public.properties;
CREATE TRIGGER set_updated_at_properties
    BEFORE UPDATE ON public.properties
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_reports ON public.property_reports;
CREATE TRIGGER set_updated_at_reports
    BEFORE UPDATE ON public.property_reports
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =========================================================
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- =========================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_reports ENABLE ROW LEVEL SECURITY;

-- =========================================================
-- 5. POLICIES: PROFILES
-- =========================================================
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)
WITH CHECK (auth.uid() = id AND role = (SELECT role FROM public.profiles WHERE id = auth.uid()));

DROP POLICY IF EXISTS "Admins can manage profiles" ON public.profiles;
CREATE POLICY "Admins can manage profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- =========================================================
-- 6. POLICIES: PROPERTIES
-- =========================================================
DROP POLICY IF EXISTS "Public can view approved properties" ON public.properties;
CREATE POLICY "Public can view approved properties" ON public.properties FOR SELECT USING (approval_status = 'approved');

DROP POLICY IF EXISTS "Owners can view own properties" ON public.properties;
CREATE POLICY "Owners can view own properties" ON public.properties FOR SELECT USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Owners can insert own properties" ON public.properties;
CREATE POLICY "Owners can insert own properties" ON public.properties FOR INSERT WITH CHECK (
    owner_id = auth.uid() AND approval_status = 'pending'
);

DROP POLICY IF EXISTS "Owners can update own properties" ON public.properties;
CREATE POLICY "Owners can update own properties" ON public.properties FOR UPDATE USING (owner_id = auth.uid()) WITH CHECK (
    owner_id = auth.uid() AND approval_status = (SELECT approval_status FROM public.properties WHERE id = properties.id)
);

DROP POLICY IF EXISTS "Owners can delete own properties" ON public.properties;
CREATE POLICY "Owners can delete own properties" ON public.properties FOR DELETE USING (owner_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all properties" ON public.properties;
CREATE POLICY "Admins can manage all properties" ON public.properties FOR ALL USING (public.is_admin());

-- =========================================================
-- 7. POLICIES: PROPERTY IMAGES
-- =========================================================
DROP POLICY IF EXISTS "Public can view images of approved properties" ON public.property_images;
CREATE POLICY "Public can view images of approved properties" ON public.property_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_images.property_id AND approval_status = 'approved')
);

DROP POLICY IF EXISTS "Owners can view own property images" ON public.property_images;
CREATE POLICY "Owners can view own property images" ON public.property_images FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_images.property_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "Owners can insert images for own properties" ON public.property_images;
CREATE POLICY "Owners can insert images for own properties" ON public.property_images FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_images.property_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "Owners can update images for own properties" ON public.property_images;
CREATE POLICY "Owners can update images for own properties" ON public.property_images FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_images.property_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "Owners can delete images for own properties" ON public.property_images;
CREATE POLICY "Owners can delete images for own properties" ON public.property_images FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.properties WHERE id = property_images.property_id AND owner_id = auth.uid())
);

DROP POLICY IF EXISTS "Admins can manage all images" ON public.property_images;
CREATE POLICY "Admins can manage all images" ON public.property_images FOR ALL USING (public.is_admin());

-- =========================================================
-- 8. POLICIES: FAVORITES
-- =========================================================
DROP POLICY IF EXISTS "Users can read own favorites" ON public.favorites;
CREATE POLICY "Users can read own favorites" ON public.favorites FOR SELECT USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own favorites" ON public.favorites;
CREATE POLICY "Users can insert own favorites" ON public.favorites FOR INSERT WITH CHECK (user_id = auth.uid());

DROP POLICY IF EXISTS "Users can delete own favorites" ON public.favorites;
CREATE POLICY "Users can delete own favorites" ON public.favorites FOR DELETE USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all favorites" ON public.favorites;
CREATE POLICY "Admins can manage all favorites" ON public.favorites FOR ALL USING (public.is_admin());

-- =========================================================
-- 9. POLICIES: PROPERTY REPORTS
-- =========================================================
DROP POLICY IF EXISTS "Users can read own reports" ON public.property_reports;
CREATE POLICY "Users can read own reports" ON public.property_reports FOR SELECT USING (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Users can insert own reports" ON public.property_reports;
CREATE POLICY "Users can insert own reports" ON public.property_reports FOR INSERT WITH CHECK (reporter_id = auth.uid());

DROP POLICY IF EXISTS "Admins can manage all reports" ON public.property_reports;
CREATE POLICY "Admins can manage all reports" ON public.property_reports FOR ALL USING (public.is_admin());

-- =========================================================
-- 10. INDEXES FOR PERFORMANCE
-- =========================================================
CREATE INDEX IF NOT EXISTS idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX IF NOT EXISTS idx_properties_locality ON public.properties(locality);
CREATE INDEX IF NOT EXISTS idx_properties_city ON public.properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_property_type ON public.properties(property_type);
CREATE INDEX IF NOT EXISTS idx_properties_rent ON public.properties(rent);
CREATE INDEX IF NOT EXISTS idx_properties_availability_status ON public.properties(availability_status);
CREATE INDEX IF NOT EXISTS idx_properties_approval_status ON public.properties(approval_status);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON public.properties(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_property_id ON public.favorites(property_id);

CREATE INDEX IF NOT EXISTS idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reports_property_id ON public.property_reports(property_id);
CREATE INDEX IF NOT EXISTS idx_property_reports_reporter_id ON public.property_reports(reporter_id);
