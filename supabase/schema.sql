-- 청년서랍 Block 3: 테이블 + 시드 + RLS
-- Supabase 대시보드 → SQL Editor → New Query 에 전체 복사해서 Run

-- ============================================================
-- 1. 테이블
-- ============================================================

-- 사용자 조건 (users 는 Supabase auth.users 가 대신함)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  birth_date DATE,
  region TEXT,                 -- 예: '경기도 용인시'
  residence_start_date DATE,   -- 현재 지역 거주 시작일
  education TEXT,              -- '고졸' | '대학생' | '대졸' | '대학원생' 등
  employment_status TEXT,      -- '미취업' | '재직' | '자영업' 등
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 정책 (공용 데이터, 손으로 입력)
CREATE TABLE public.policies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  agency TEXT,
  benefit_amount INTEGER,      -- 원 단위 추정 총액 (없으면 NULL)
  benefit_text TEXT,           -- 사람이 읽는 지원내용
  source_url TEXT,
  apply_start DATE,
  apply_end DATE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 정책별 자격조건 (공용 데이터)
CREATE TABLE public.policy_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  label TEXT NOT NULL,         -- 화면에 보일 조건 이름: '나이', '거주기간'
  field TEXT NOT NULL,         -- age | region | residence_months | education | employment_status
  operator TEXT NOT NULL,      -- >= | <= | = | contains
  value TEXT NOT NULL,
  unit TEXT,                   -- 'years' | 'months' | NULL
  time_satisfiable BOOLEAN DEFAULT false,  -- 시간이 지나면 충족되는 조건인가 (FUTURE_PASS 계산용)
  source_quote TEXT,           -- 공고문 원문 근거
  sort_order INTEGER DEFAULT 0
);

-- 판정 결과 (사용자 데이터)
CREATE TABLE public.judgements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id UUID NOT NULL REFERENCES public.policies(id) ON DELETE CASCADE,
  verdict TEXT NOT NULL CHECK (verdict IN ('ELIGIBLE', 'INELIGIBLE', 'FUTURE_ELIGIBLE')),
  future_eligibility_date DATE,
  details JSONB,               -- 조건별 PASS/FAIL/FUTURE_PASS 목록
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- 2. 시드 데이터 (예시) — 실제 공고문 확인 후 내용·근거문장 교체할 것
--    데모 사용자: 24세 / 경기도 용인시 / 거주 4개월 / 대학생 / 미취업
-- ============================================================

INSERT INTO public.policies (id, name, agency, benefit_amount, benefit_text, source_url, apply_start, apply_end) VALUES
  ('11111111-1111-1111-1111-111111111111', '용인시 청년 월세 지원 (예시)', '용인시', 2400000, '월 20만원 × 12개월', 'https://www.yongin.go.kr', '2026-09-01', '2026-10-31'),
  ('22222222-2222-2222-2222-222222222222', '경기도 청년 면접수당 (예시)', '경기도', 300000, '면접 1회당 5만원, 최대 6회', 'https://www.gg.go.kr', '2026-09-01', '2026-11-30'),
  ('33333333-3333-3333-3333-333333333333', '경기도 대학생 학자금 이자 지원 (예시)', '경기도', NULL, '학자금 대출 이자 전액 지원', 'https://www.gg.go.kr', '2026-09-15', '2026-10-15');

-- 정책 A: 나이 19~34, 용인시, 6개월 이상 거주  → 데모 사용자는 거주기간 때문에 FUTURE_ELIGIBLE
INSERT INTO public.policy_conditions (policy_id, label, field, operator, value, unit, time_satisfiable, source_quote, sort_order) VALUES
  ('11111111-1111-1111-1111-111111111111', '나이 (하한)', 'age', '>=', '19', 'years', true,  '신청일 기준 만 19세 이상 34세 이하 청년', 1),
  ('11111111-1111-1111-1111-111111111111', '나이 (상한)', 'age', '<=', '34', 'years', false, '신청일 기준 만 19세 이상 34세 이하 청년', 2),
  ('11111111-1111-1111-1111-111111111111', '거주 지역', 'region', 'contains', '용인시', NULL, false, '공고일 현재 용인시에 주민등록을 둔 자', 3),
  ('11111111-1111-1111-1111-111111111111', '거주 기간', 'residence_months', '>=', '6', 'months', true, '신청일 기준 용인시에 6개월 이상 계속 거주', 4);

-- 정책 B: 나이 18~39, 경기도, 미취업  → 데모 사용자 ELIGIBLE
INSERT INTO public.policy_conditions (policy_id, label, field, operator, value, unit, time_satisfiable, source_quote, sort_order) VALUES
  ('22222222-2222-2222-2222-222222222222', '나이 (하한)', 'age', '>=', '18', 'years', true,  '만 18세 이상 39세 이하', 1),
  ('22222222-2222-2222-2222-222222222222', '나이 (상한)', 'age', '<=', '39', 'years', false, '만 18세 이상 39세 이하', 2),
  ('22222222-2222-2222-2222-222222222222', '거주 지역', 'region', 'contains', '경기도', NULL, false, '경기도에 주민등록을 둔 청년', 3),
  ('22222222-2222-2222-2222-222222222222', '취업 상태', 'employment_status', '=', '미취업', NULL, false, '신청일 현재 미취업 상태인 자', 4);

-- 정책 C: 경기도, 대학생  → 데모 사용자 ELIGIBLE
INSERT INTO public.policy_conditions (policy_id, label, field, operator, value, unit, time_satisfiable, source_quote, sort_order) VALUES
  ('33333333-3333-3333-3333-333333333333', '거주 지역', 'region', 'contains', '경기도', NULL, false, '경기도 거주 대학생', 1),
  ('33333333-3333-3333-3333-333333333333', '학력', 'education', '=', '대학생', NULL, false, '국내 대학 재학 중인 자', 2);

-- ============================================================
-- 3. RLS 켜기
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.policy_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judgements ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 4. 정책(Policy)
-- ============================================================

-- 공용 데이터: 누구나 읽기
CREATE POLICY "누구나 읽기 가능" ON public.policies
  FOR SELECT USING (true);

CREATE POLICY "누구나 읽기 가능" ON public.policy_conditions
  FOR SELECT USING (true);

-- 사용자 데이터: 내 것만 (Block 4에서 로그인 붙으면 auth.uid()가 동작)
CREATE POLICY "내 프로필만" ON public.profiles
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "내 판정만" ON public.judgements
  FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
