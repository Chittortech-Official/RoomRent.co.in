import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// -------------------------------------------------------
// Types matching our database schema
// -------------------------------------------------------
export type UserRole = 'tenant' | 'owner' | 'broker' | 'admin';
export type ListingStatus = 'draft' | 'payment_pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
export type AvailabilityStatus = 'available' | 'rented' | 'temporarily_unavailable';

export interface UserProfile {
  id: string;
  full_name: string;
  profile_photo?: string;
  email: string;
  phone_number?: string;
  whatsapp_number?: string;
  role: UserRole;
  company_name?: string;
  agency_name?: string;
  designation?: string;
  years_of_experience?: number;
  business_email?: string;
  business_phone?: string;
  business_whatsapp?: string;
  website?: string;
  business_address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  about?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  owner_id: string;
  listed_by: 'Owner' | 'Broker' | 'Builder';
  title: string;
  description?: string;
  property_type?: string;
  listing_type: 'For Rent' | 'For Lease';
  bedrooms?: number;
  bathrooms?: number;
  balconies?: number;
  area_sqft?: number;
  built_up_area?: number;
  carpet_area?: number;
  floor_number?: number;
  total_floors?: number;
  property_age?: string;
  facing?: string;
  furnishing?: 'Fully Furnished' | 'Semi Furnished' | 'Unfurnished';
  parking_availability?: boolean;
  parking_type?: string;
  rent: number;
  security_deposit?: number;
  maintenance_charges?: number;
  electricity_charges?: string;
  water_charges?: string;
  other_charges?: string;
  rent_negotiable?: boolean;
  no_brokerage?: boolean;
  brokerage_amount?: number;
  brokerage_type?: string;
  city: string;
  state?: string;
  locality: string;
  area?: string;
  address_line?: string;
  pincode?: string;
  landmark?: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  available_from?: string;
  gender_preference?: string;
  pets_allowed?: boolean;
  smoking_allowed?: boolean;
  drinking_allowed?: boolean;
  food_preference?: string;
  maximum_occupancy?: number;
  minimum_stay?: string;
  notice_period?: string;
  property_highlights?: string[];
  nearby_schools?: string;
  nearby_colleges?: string;
  nearby_hospitals?: string;
  nearby_metro?: string;
  nearby_transport?: string;
  nearby_markets?: string;
  additional_information?: string;
  property_rules?: string;
  contact_name?: string;
  contact_number?: string;
  whatsapp_number?: string;
  contact_email?: string;
  alternative_phone?: string;
  alternative_whatsapp?: string;
  listing_status: ListingStatus;
  availability_status: AvailabilityStatus;
  rejection_reason?: string;
  approved_by?: string;
  approved_at?: string;
  expiry_at?: string;
  created_at: string;
  updated_at: string;
  property_images?: PropertyImage[];
  users?: UserProfile;
}

export interface PropertyImage {
  id: string;
  property_id: string;
  uploaded_by?: string;
  image_data: string;
  image_name?: string;
  mime_type?: string;
  is_primary: boolean;
  sort_order: number;
  uploaded_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  is_read: boolean;
  property_id?: string;
  created_at: string;
}
