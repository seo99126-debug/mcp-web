# 청년서랍 (YPC) — 오늘의 스펙

## 한 문장 정의

로그인한 사용자가 자신의 조건(나이·지역·거주기간·학력·취업상태)을 입력해서, 미리 등록된 청년정책별 신청 가능 여부와 조건별 이유·공고문 근거를 얻는다.

## 화면

- 로그인/회원가입 — 이메일로 가입하고 로그인한다
- 조건 입력 — 생년월일, 지역, 거주 시작일, 학력, 취업상태를 입력·수정한다
- 결과 대시보드 — 정책 목록을 신청 가능 / 향후 가능 / 신청 불가로 나눠 본다
- 정책 상세 — 조건별 PASS/FAIL/FUTURE_PASS, 공고문 근거 문장, 향후 가능일을 본다

## 데이터

- users — id, email, password_hash, created_at
- profiles — user_id, birth_date, region, residence_start_date, education, employment_status
- policies — id, name, agency, benefit_amount, source_url, apply_start, apply_end
- policy_conditions — policy_id, field, operator, value, unit, time_satisfiable, source_quote
- judgements — user_id, policy_id, verdict, future_eligibility_date, created_at

## 오늘 만들 기능 3개

1. 내 조건을 입력하고 저장한다
2. 저장된 조건으로 정책별 신청 가능 여부를 판정한다
3. 조건별 판정 이유·공고문 근거·향후 가능일을 보여준다

## 오늘 안 만들 것

- 공고문 AI Parsing / Structuring (A1·A2) — 정책 데이터는 손으로 입력
- AI 역질문 및 재판정 (C1)
- AI 설명문 생성 (C2)
- 중복수혜 Conflict 분석
- 정책 조합 추천
- 필요서류 체크리스트
- 신청 일정 Timeline
- 온통청년 OPEN API 연동
- 대안 정책 추천
- 관리자 검증 화면
- 알림·캘린더
- 통계 Dashboard
- 애니메이션
