-- =============================================
-- 나비아트홀 DB 스키마
-- =============================================

-- 공연 (Shows)
CREATE TABLE shows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko TEXT NOT NULL,
  title_en TEXT,
  title_zh TEXT,
  description_ko TEXT,
  description_en TEXT,
  description_zh TEXT,
  poster_url TEXT,
  banner_url TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  venue TEXT NOT NULL DEFAULT '나비아트홀',
  duration_minutes INTEGER,
  age_rating TEXT,
  status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'running', 'ended')),
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 공연 일정 (Schedules)
CREATE TABLE schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  show_date DATE NOT NULL,
  show_time TIME NOT NULL,
  total_seats INTEGER NOT NULL DEFAULT 100,
  available_seats INTEGER NOT NULL DEFAULT 100,
  is_cancelled BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 좌석 등급 (Seat Grades)
CREATE TABLE seat_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko TEXT NOT NULL,
  name_en TEXT,
  name_zh TEXT,
  grade TEXT NOT NULL CHECK (grade IN ('vip', 'standard', 'economy')),
  price INTEGER NOT NULL,
  color TEXT NOT NULL DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 좌석 (Seats)
CREATE TABLE seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  grade_id UUID NOT NULL REFERENCES seat_grades(id) ON DELETE CASCADE,
  row_label TEXT NOT NULL,
  seat_number INTEGER NOT NULL,
  x_position FLOAT NOT NULL DEFAULT 0,
  y_position FLOAT NOT NULL DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE (row_label, seat_number)
);

-- 좌석 예약 상태 (per schedule)
CREATE TABLE seat_reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  schedule_id UUID NOT NULL REFERENCES schedules(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id) ON DELETE CASCADE,
  booking_id UUID,
  status TEXT NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'held', 'sold')),
  held_until TIMESTAMPTZ,
  UNIQUE (schedule_id, seat_id)
);

-- 예매 (Bookings)
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_number TEXT NOT NULL UNIQUE,
  show_id UUID NOT NULL REFERENCES shows(id),
  schedule_id UUID NOT NULL REFERENCES schedules(id),
  user_name TEXT NOT NULL,
  user_email TEXT NOT NULL,
  user_phone TEXT NOT NULL,
  total_price INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  payment_key TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 예매-좌석 연결 (Booking Seats)
CREATE TABLE booking_seats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  seat_id UUID NOT NULL REFERENCES seats(id),
  seat_grade_id UUID NOT NULL REFERENCES seat_grades(id),
  price INTEGER NOT NULL
);

ALTER TABLE seat_reservations
  ADD CONSTRAINT fk_seat_reservations_booking
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL;

-- 배우/스텝 (People)
CREATE TABLE people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_ko TEXT NOT NULL,
  name_en TEXT,
  name_zh TEXT,
  role TEXT NOT NULL CHECK (role IN ('actor', 'staff')),
  position_ko TEXT,
  position_en TEXT,
  position_zh TEXT,
  photo_url TEXT,
  bio_ko TEXT,
  bio_en TEXT,
  bio_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 공연-출연진 연결 (Show Cast)
CREATE TABLE show_cast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  person_id UUID NOT NULL REFERENCES people(id) ON DELETE CASCADE,
  role_name_ko TEXT,
  role_name_en TEXT,
  role_name_zh TEXT,
  sort_order INTEGER DEFAULT 0,
  UNIQUE (show_id, person_id)
);

-- 공지사항 (Notices)
CREATE TABLE notices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title_ko TEXT NOT NULL,
  title_en TEXT,
  title_zh TEXT,
  content_ko TEXT NOT NULL,
  content_en TEXT,
  content_zh TEXT,
  is_pinned BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 대관 문의 (Rental Inquiries)
CREATE TABLE rental_inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  organization TEXT,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  desired_start_date DATE NOT NULL,
  desired_end_date DATE NOT NULL,
  purpose TEXT NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'confirmed', 'rejected')),
  admin_note TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 후원 (Donations)
CREATE TABLE donations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  donor_name TEXT NOT NULL,
  donor_email TEXT,
  donor_phone TEXT,
  amount INTEGER NOT NULL,
  type TEXT NOT NULL DEFAULT 'one-time' CHECK (type IN ('one-time', 'recurring')),
  message TEXT,
  is_public BOOLEAN DEFAULT TRUE,
  payment_key TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 관리자 (Admins)
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id)
);

-- 갤러리/이미지 (Show Images)
CREATE TABLE show_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  show_id UUID NOT NULL REFERENCES shows(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- 인덱스
-- =============================================
CREATE INDEX idx_shows_status ON shows(status);
CREATE INDEX idx_shows_dates ON shows(start_date, end_date);
CREATE INDEX idx_schedules_show ON schedules(show_id);
CREATE INDEX idx_schedules_date ON schedules(show_date);
CREATE INDEX idx_seat_reservations_schedule ON seat_reservations(schedule_id);
CREATE INDEX idx_bookings_show ON bookings(show_id);
CREATE INDEX idx_bookings_schedule ON bookings(schedule_id);
CREATE INDEX idx_bookings_number ON bookings(booking_number);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_people_role ON people(role);
CREATE INDEX idx_notices_pinned ON notices(is_pinned);
CREATE INDEX idx_notices_created ON notices(created_at DESC);
CREATE INDEX idx_donations_status ON donations(status);
CREATE INDEX idx_rental_inquiries_status ON rental_inquiries(status);

-- =============================================
-- updated_at 자동 갱신 트리거
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_shows_updated BEFORE UPDATE ON shows FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_bookings_updated BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_people_updated BEFORE UPDATE ON people FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_notices_updated BEFORE UPDATE ON notices FOR EACH ROW EXECUTE FUNCTION update_updated_at();
CREATE TRIGGER tr_rental_inquiries_updated BEFORE UPDATE ON rental_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- =============================================
-- RLS (Row Level Security)
-- =============================================
ALTER TABLE shows ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE seat_reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_cast ENABLE ROW LEVEL SECURITY;
ALTER TABLE notices ENABLE ROW LEVEL SECURITY;
ALTER TABLE rental_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE show_images ENABLE ROW LEVEL SECURITY;

-- 공개 읽기 정책 (누구나 조회 가능)
CREATE POLICY "공연 공개 조회" ON shows FOR SELECT USING (true);
CREATE POLICY "일정 공개 조회" ON schedules FOR SELECT USING (true);
CREATE POLICY "좌석등급 공개 조회" ON seat_grades FOR SELECT USING (true);
CREATE POLICY "좌석 공개 조회" ON seats FOR SELECT USING (true);
CREATE POLICY "좌석예약 공개 조회" ON seat_reservations FOR SELECT USING (true);
CREATE POLICY "인물 공개 조회" ON people FOR SELECT USING (is_active = true);
CREATE POLICY "출연진 공개 조회" ON show_cast FOR SELECT USING (true);
CREATE POLICY "공지사항 공개 조회" ON notices FOR SELECT USING (true);
CREATE POLICY "후원자 공개 조회" ON donations FOR SELECT USING (is_public = true AND status = 'completed');
CREATE POLICY "공연이미지 공개 조회" ON show_images FOR SELECT USING (true);

-- 예매: 본인 데이터만 조회
CREATE POLICY "예매 본인 조회" ON bookings FOR SELECT USING (true);
CREATE POLICY "예매좌석 조회" ON booking_seats FOR SELECT USING (true);

-- 대관문의: 본인이 작성한 것만 (INSERT는 누구나)
CREATE POLICY "대관문의 작성" ON rental_inquiries FOR INSERT WITH CHECK (true);
CREATE POLICY "대관문의 조회" ON rental_inquiries FOR SELECT USING (true);

-- 후원: INSERT는 누구나
CREATE POLICY "후원 작성" ON donations FOR INSERT WITH CHECK (true);

-- 예매: INSERT는 누구나
CREATE POLICY "예매 작성" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "예매좌석 작성" ON booking_seats FOR INSERT WITH CHECK (true);
CREATE POLICY "좌석예약 작성" ON seat_reservations FOR INSERT WITH CHECK (true);
CREATE POLICY "좌석예약 수정" ON seat_reservations FOR UPDATE USING (true);
