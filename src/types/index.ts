export type Locale = 'ko' | 'en' | 'zh';

export type Theme = 'system' | 'light' | 'dark';

export interface Show {
  id: string;
  title: string;
  description: string;
  poster_url: string;
  start_date: string;
  end_date: string;
  venue: string;
  status: 'upcoming' | 'running' | 'ended';
  created_at: string;
}

export interface Person {
  id: string;
  name: string;
  role: 'actor' | 'staff';
  position: string;
  photo_url: string;
  bio: string;
  shows: string[];
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  show_id: string;
  schedule_id: string;
  seat_ids: string[];
  user_name: string;
  user_email: string;
  user_phone: string;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  booking_number: string;
  created_at: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  grade: 'vip' | 'standard' | 'economy';
  price: number;
  status: 'available' | 'reserved' | 'sold';
}

export interface RentalInquiry {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  desired_date: string;
  purpose: string;
  message: string;
  status: 'pending' | 'reviewed' | 'confirmed' | 'rejected';
  created_at: string;
}

export interface Donation {
  id: string;
  donor_name: string;
  amount: number;
  type: 'one-time' | 'recurring';
  is_public: boolean;
  message: string;
  created_at: string;
}
