/**
 * 공고문 원문 인용.
 *
 * 본문은 고딕, 인용은 명조 + 낫표「」다. 색이나 좌측 테두리로 구분하지
 * 않는 이유는, 그렇게 하면 판정 상태 배지의 색과 섞여서 인용문이
 * 판정처럼 읽히기 때문이다. 활자체로 구분하면 어떤 상태 옆에 놓여도
 * 인용은 인용으로 보인다.
 *
 * 인용문은 사용자 입력이 아니라 공고문이다. 줄바꿈이나 공백을 임의로
 * 다듬지 않는다 — 원문과 달라지는 순간 근거가 아니게 된다.
 */
export function Evidence({
  quote,
  sourceUrl,
  sourceLabel,
}: {
  quote: string | null | undefined;
  sourceUrl?: string | null;
  sourceLabel?: string | null;
}) {
  if (!quote?.trim()) return <EvidenceMissing />;

  return (
    <div className="rounded-[9px] bg-fill px-3.5 py-3">
      <p className="font-serif text-[13px] leading-[1.7] whitespace-pre-line text-ink">
        「{quote.trim()}」
      </p>
      {sourceUrl ? (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-brand hover:text-brand-strong"
        >
          {sourceLabel ?? "공고문 원문"}
          <ExternalIcon />
        </a>
      ) : (
        <p className="mt-2 text-[11.5px] text-ink-faint">
          {sourceLabel ? `${sourceLabel} · ` : ""}링크 준비 중
        </p>
      )}
    </div>
  );
}

/**
 * 근거가 없을 때. 조건을 목록에서 지우지 않는다 —
 * 보이지 않는 조건은 판정되지 않은 것과 같고, 사용자는 그게 빠졌다는
 * 사실조차 모른다. 근거 없는 조건이 하나라도 있으면 정책 전체를
 * '확인 필요'로 내린다.
 */
export function EvidenceMissing() {
  return (
    <div className="flex items-center gap-2 rounded-[9px] bg-info-bg px-3.5 py-3">
      <QuestionIcon />
      <span className="text-[13px] font-medium text-info-fg">
        공고문 근거를 확인하지 못했어요
      </span>
    </div>
  );
}

function ExternalIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M6.2 3h6.8v6.8M13 3L3.4 12.6"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function QuestionIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="shrink-0 text-info-fg"
    >
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.6v4.2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="11.3" r="0.85" fill="currentColor" />
    </svg>
  );
}
