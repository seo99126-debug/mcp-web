import { VERDICT, type Verdict } from "@/lib/verdict";

type Scope = "policy" | "condition";

/**
 * 판정 배지. 정책 하나에 붙는 것과 조건 한 줄에 붙는 것은 말이 다르다.
 *
 *   정책  신청 가능 / 향후 가능 / 확인 필요 / 신청 불가
 *   조건  충족     / 아직 미충족 / 확인 필요 / 미충족
 *
 * 조건 단위에 "신청 가능" 이라고 쓰면 그 조건 하나로 신청이 된다는 뜻이 된다.
 */
export function VerdictBadge({
  verdict,
  scope = "policy",
  tone = "soft",
}: {
  verdict: Verdict;
  scope?: Scope;
  tone?: "soft" | "solid";
}) {
  const spec = VERDICT[verdict];
  const label = scope === "condition" ? spec.condition : spec.badge;
  const color = tone === "solid" ? spec.solidClass : spec.softClass;

  return (
    <span
      className={`inline-block shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ${color}`}
    >
      {label}
    </span>
  );
}
