import Link from "next/link";
import type { ReactNode } from "react";

/**
 * 비어 있음 / 오류 상태.
 *
 * 이 프로젝트에서 가장 나쁜 화면은 틀린 화면이 아니라 백지 화면이다.
 * 목록이 0건일 때 아무것도 그리지 않으면 사용자는 서비스가 고장난 건지
 * 자기가 해당이 안 되는 건지 구분할 수 없다.
 *
 * 특히 '조건 미입력'과 '판정 결과 0건'은 절대 같은 화면을 쓰지 않는다.
 * 전자는 아직 판정 전이고, 후자는 판정이 끝난 것이다.
 */
export function EmptyState({
  title,
  description,
  icon,
  action,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: { href: string; label: string };
}) {
  return (
    <div className="rounded-[13px] border border-line bg-surface px-5 py-7 text-center">
      {icon ? <div className="mb-3 flex justify-center">{icon}</div> : null}
      <p className="text-[15px] font-bold">{title}</p>
      {description ? (
        <p className="mt-2 text-[12.5px] leading-[1.65] text-ink-muted">{description}</p>
      ) : null}
      {action ? (
        <Link
          href={action.href}
          className="mt-4 inline-flex min-h-[46px] items-center justify-center rounded-[10px] bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-strong"
        >
          {action.label}
        </Link>
      ) : null}
    </div>
  );
}

/**
 * 불러오기 실패. Supabase 의 원문 에러(영문)를 화면에 그대로 내보내지
 * 않는다 — 사용자가 읽을 수 없고, 내부 구조를 드러낸다.
 * 원문은 호출부에서 console.error 로 남긴다.
 */
export function ErrorState({
  title = "정보를 불러오지 못했어요",
  description = "잠시 후 다시 시도해 주세요. 계속되면 문의해 주세요.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="flex gap-2.5 rounded-[13px] border border-alert-line bg-surface p-4">
      <svg
        width="18"
        height="18"
        viewBox="0 0 18 18"
        fill="none"
        aria-hidden="true"
        className="mt-0.5 shrink-0 text-alert-fg"
      >
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 5.2v4.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        <circle cx="9" cy="12.2" r="0.9" fill="currentColor" />
      </svg>
      <div>
        <p className="text-[14.5px] font-bold">{title}</p>
        <p className="mt-1.5 text-[12.5px] leading-[1.65] text-ink-muted">{description}</p>
      </div>
    </div>
  );
}

/** 면책 문구. 정책 카드마다 반복하지 않는다 — 반복하면 아무도 읽지 않는다. */
export function Disclaimer({ department }: { department?: string | null }) {
  const who = department ? `${department} 담당부서` : "각 정책 담당부서";
  return (
    <p className="border-t border-line pt-3.5 text-[11.5px] leading-[1.7] text-ink-faint">
      이 결과는 공고문 분석에 기반한 참고 정보이며 법적 효력이 없습니다. 최종 자격 여부는 {who}의
      확인을 받으세요.
    </p>
  );
}
