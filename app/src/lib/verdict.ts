/**
 * 판정 상태 표현 규격 — M0 Design·Planning 확정본.
 *
 * 화면에 나가는 상태는 4개뿐이고, 이 파일이 그 원본이다.
 * 화면마다 라벨이나 색을 다시 고르면 같은 판정이 대시보드와 상세에서
 * 다르게 보인다. 새 화면을 만들 때도 여기서 가져다 쓴다.
 *
 * 색 선택의 이유 두 가지:
 *
 *   - 신청 불가에 빨강을 쓰지 않는다. 빨강은 시스템 오류와 마감 임박
 *     전용이다(alert-*). 부적격은 사용자의 실수가 아니라 정책의 조건인데,
 *     빨강으로 칠하면 "내가 뭘 잘못했다"로 읽힌다.
 *   - 향후 가능은 파랑이다. 날짜·일정을 뜻하는 색이라서, 사용자가
 *     "거절"이 아니라 "언제부터"로 읽게 된다.
 *
 * 주의: NEEDS_INFO 는 아직 judgements.verdict 의 CHECK 제약에 없다
 * (supabase/schema.sql 은 ELIGIBLE | INELIGIBLE | FUTURE_ELIGIBLE 만 허용).
 * 판정 불가를 저장하려면 제약을 먼저 고쳐야 한다. 그때까지 이 상태는
 * 화면에서 계산해 쓰는 값이다.
 */

/** 화면에 나열하는 순서. 사용자가 먼저 알고 싶은 것부터. */
export const VERDICT_ORDER = [
  "ELIGIBLE",
  "FUTURE_ELIGIBLE",
  "NEEDS_INFO",
  "INELIGIBLE",
] as const;

export type Verdict = (typeof VERDICT_ORDER)[number];

export type VerdictSpec = {
  /** 정책 단위 배지 문구 */
  badge: string;
  /** 조건 한 줄에 붙는 라벨 — 정책 단위와 말이 다르다 */
  condition: string;
  /** 대시보드 그룹 제목 */
  groupTitle: string;
  /** 그룹이 0건일 때 — 그룹 자체를 숨기지 않는다 */
  groupEmpty: string;
  /** 연한 배지 (카드 위) */
  softClass: string;
  /** 진한 배지 (상세 헤더처럼 하나만 놓일 때) */
  solidClass: string;
  /** 이 상태의 카드 테두리 */
  cardClass: string;
};

/**
 * Tailwind 는 소스에 그대로 적힌 클래스만 찾아낸다.
 * 그래서 `bg-${x}-bg` 같은 조립을 하지 않고 전부 펼쳐 쓴다.
 */
export const VERDICT: Record<Verdict, VerdictSpec> = {
  ELIGIBLE: {
    badge: "신청 가능",
    condition: "충족",
    groupTitle: "지금 신청할 수 있어요",
    groupEmpty: "지금 바로 신청할 수 있는 정책은 없어요.",
    softClass: "bg-pass-bg text-pass-fg",
    solidClass: "bg-pass-fg text-white",
    cardClass: "border-pass-line",
  },
  FUTURE_ELIGIBLE: {
    badge: "향후 가능",
    condition: "아직 미충족",
    groupTitle: "조건이 채워지면 가능해요",
    groupEmpty: "기다리면 가능해지는 정책은 없어요.",
    softClass: "bg-future-bg text-future-fg",
    solidClass: "bg-future-fg text-white",
    cardClass: "border-future-line",
  },
  NEEDS_INFO: {
    badge: "확인 필요",
    condition: "확인 필요",
    groupTitle: "정보가 더 필요해요",
    groupEmpty: "지금 조건으로 모든 정책을 판정할 수 있었어요.",
    softClass: "bg-info-bg text-info-fg",
    solidClass: "bg-info-fg text-white",
    cardClass: "border-info-line",
  },
  INELIGIBLE: {
    badge: "신청 불가",
    condition: "미충족",
    groupTitle: "이번에는 해당되지 않아요",
    groupEmpty: "해당 없음.",
    softClass: "bg-off-bg text-off-fg",
    solidClass: "bg-off-fg text-white",
    cardClass: "border-off-line",
  },
};

/**
 * 향후 가능 문구. 날짜가 문장의 주어다.
 *
 * "아직 조건을 충족하지 않았습니다" 처럼 부정으로 끝내지 않는다.
 * 사용자가 알고 싶은 것은 거절이 아니라 언제다.
 *
 * 날짜가 없으면 향후 가능 배지를 쓸 수 없다 — 그건 그냥 미충족이다.
 */
export function futureEligibleSentence(date: string): string {
  return `${date}부터 신청할 수 있어요`;
}
