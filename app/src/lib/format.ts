/**
 * 화면 표기 헬퍼 — 값이 없을 때 무엇을 보여줄지가 이 파일의 전부다.
 *
 * policies 의 agency / benefit_text / apply_end 는 전부 nullable 이라서,
 * 그냥 꽂으면 화면에 "null · null · 마감 null" 이 찍힌다. 실제로 찍혔었다.
 */

/** 마감 임박으로 볼 기준. 이 안쪽이면 빨강을 쓴다. */
const URGENT_DAYS = 7;

/**
 * "2026-11-19" → "2026년 11월 19일"
 *
 * new Date("2026-11-19") 는 UTC 자정으로 해석돼서 KST 로 찍으면
 * 하루 밀린다. 그래서 문자열을 직접 쪼갠다 — 마감일이 하루 밀리면
 * 사용자가 신청을 놓친다.
 */
export function formatKoreanDate(
  value: string | null | undefined,
  fallback = "날짜 미정",
): string {
  const parts = parseDateParts(value);
  if (!parts) return fallback;
  return `${parts.year}년 ${parts.month}월 ${parts.day}일`;
}

export type DeadlineTone = "normal" | "urgent" | "closed" | "unknown";

export type Deadline = {
  text: string;
  tone: DeadlineTone;
};

/**
 * 마감일 표기. 마감이 없는 것("상시 모집"일 수도, 아직 입력이 안 됐을 수도)과
 * 마감이 지난 것을 구분한다. 둘 다 조용히 빈칸으로 두지 않는다.
 */
export function formatDeadline(
  applyEnd: string | null | undefined,
  today: Date = new Date(),
): Deadline {
  const parts = parseDateParts(applyEnd);
  if (!parts) return { text: "마감일 미정", tone: "unknown" };

  const days = daysUntil(parts, today);
  const date = `${parts.year}년 ${parts.month}월 ${parts.day}일`;

  if (days < 0) return { text: `${date} 마감됨`, tone: "closed" };
  if (days === 0) return { text: `${date} 마감 · 오늘까지`, tone: "urgent" };
  if (days <= URGENT_DAYS) {
    return { text: `${date} 마감 · ${days}일 남음`, tone: "urgent" };
  }
  return { text: `${date} 마감`, tone: "normal" };
}

/**
 * 정책 카드의 부제. null 인 조각은 빼고 남은 것만 가운뎃점으로 잇는다.
 * 전부 비면 빈 문자열이 아니라 null 을 돌려줘서, 호출부가 줄 자체를
 * 그리지 않게 한다 (빈 줄이 남으면 카드 높이가 들쭉날쭉해진다).
 */
export function joinMeta(...parts: (string | null | undefined)[]): string | null {
  const kept = parts.map((p) => p?.trim()).filter((p): p is string => !!p);
  return kept.length > 0 ? kept.join(" · ") : null;
}

type DateParts = { year: number; month: number; day: number };

function parseDateParts(value: string | null | undefined): DateParts | null {
  if (!value) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(value.trim());
  if (!m) return null;
  return { year: Number(m[1]), month: Number(m[2]), day: Number(m[3]) };
}

function daysUntil(target: DateParts, today: Date): number {
  const end = Date.UTC(target.year, target.month - 1, target.day);
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.round((end - now) / 86_400_000);
}
