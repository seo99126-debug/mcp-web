import type { Metadata } from "next";
import { Disclaimer, EmptyState, ErrorState } from "@/components/EmptyState";
import { Evidence, EvidenceMissing } from "@/components/Evidence";
import { VerdictBadge } from "@/components/VerdictBadge";
import { VERDICT, VERDICT_ORDER, futureEligibleSentence } from "@/lib/verdict";
import { formatDeadline, formatKoreanDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "디자인 규격 · 청년서랍",
  description: "판정 상태·근거 표현 규격을 실제 컴포넌트로 확인합니다.",
};

/**
 * 살아 있는 스타일 가이드.
 *
 * 시안은 캔버스에 있지만, 시안과 코드가 갈라지는 순간 규격은 죽는다.
 * 이 화면은 실제 컴포넌트를 그대로 렌더하므로, 여기서 보이는 것이
 * 사용자에게 보이는 것이다. 토큰을 고치면 이 화면이 먼저 바뀐다.
 */
export default function DesignSystem() {
  const swatches = [
    { name: "ground", hex: "#faf8f5", box: "bg-ground" },
    { name: "surface", hex: "#ffffff", box: "bg-surface" },
    { name: "fill", hex: "#f2eee8", box: "bg-fill" },
    { name: "line", hex: "#e3ded7", box: "bg-line" },
    { name: "ink", hex: "#1a1817", box: "bg-ink" },
    { name: "ink-muted", hex: "#5c5651", box: "bg-ink-muted" },
    { name: "brand", hex: "#b4552f", box: "bg-brand" },
    { name: "alert-fg", hex: "#a32e24", box: "bg-alert-fg" },
  ];

  return (
    <main className="mx-auto w-full max-w-3xl p-6 sm:p-8">
      <header className="border-b border-line pb-5">
        <p className="text-xs font-bold tracking-[0.14em] text-brand">M0 · DESIGN &amp; PLANNING</p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">디자인 규격</h1>
        <p className="mt-2 text-[13px] leading-[1.7] text-ink-muted">
          아래는 시안 그림이 아니라 실제 컴포넌트다. 새 화면을 만들 때 여기서 가져다 쓴다.
        </p>
      </header>

      <Section title="판정 상태 4종" note="화면에 나가는 상태는 이게 전부다. 늘리거나 줄이지 않는다.">
        <div className="space-y-2.5">
          {VERDICT_ORDER.map((v) => (
            <div key={v} className={`rounded-[13px] border bg-surface p-4 ${VERDICT[v].cardClass}`}>
              <div className="flex flex-wrap items-center gap-2">
                <Variant label="연한">
                  <VerdictBadge verdict={v} />
                </Variant>
                <Variant label="진한">
                  <VerdictBadge verdict={v} tone="solid" />
                </Variant>
                <Variant label="조건 단위">
                  <VerdictBadge verdict={v} scope="condition" />
                </Variant>
                <code className="ml-auto self-start text-[11px] text-ink-faint">{v}</code>
              </div>
              <p className="mt-3 text-[13px] font-medium">{VERDICT[v].groupTitle}</p>
              <p className="mt-1 text-[12.5px] text-ink-muted">0건일 때 — {VERDICT[v].groupEmpty}</p>
            </div>
          ))}
        </div>
        <p className="mt-3 rounded-[12px] bg-alert-bg px-4 py-3 text-[12.5px] leading-[1.65]">
          <strong className="text-alert-fg">빨강은 판정 상태가 아니다.</strong> 시스템 오류, 마감
          임박(D-7 이내), 마감 경과에만 쓴다. 부적격은 사용자의 실수가 아니라 정책의 조건이다.
        </p>
      </Section>

      <Section title="향후 가능 — 날짜가 문장의 주어다">
        <div className="rounded-[13px] border border-future-line bg-future-bg p-4">
          <VerdictBadge verdict="FUTURE_ELIGIBLE" tone="solid" />
          <p className="mt-3 text-[17px] font-bold leading-[1.5] text-future-ink">
            {futureEligibleSentence(formatKoreanDate("2026-11-19"))}
          </p>
          <p className="mt-2 text-[12.5px] leading-[1.65] text-future-fg">
            3개 조건 중 2개를 충족했어요. 남은 하나는 거주 기간이에요.
          </p>
        </div>
        <p className="mt-2 text-[12px] text-ink-muted">
          날짜 없이 이 배지를 쓰지 않는다 — 날짜가 없으면 그건 그냥 미충족이다.
        </p>
      </Section>

      <Section title="공고문 근거" note="본문은 고딕, 인용은 명조 +「」. 색이 아니라 활자체로 구분한다.">
        <div className="space-y-3">
          <Evidence
            quote="신청일 기준 용인시에 6개월 이상 계속 거주"
            sourceUrl="https://www.yongin.go.kr"
            sourceLabel="용인시 공고문"
          />
          <Evidence quote="만 18세 이상 39세 이하" sourceLabel="경기도 공고문" />
          <EvidenceMissing />
        </div>
        <p className="mt-2 text-[12px] leading-[1.65] text-ink-muted">
          가운데는 원문 링크가 없는 경우 — 인용은 그대로 두고 링크 자리만 비운다. 아래는 근거
          자체가 없는 경우 — 조건을 목록에서 지우지 않고, 정책 전체를 &lsquo;확인 필요&rsquo;로 내린다.
        </p>
      </Section>

      <Section title="마감일 표기" note="apply_end 는 nullable 이다. 비면 '마감 null' 이 찍혔었다.">
        <ul className="divide-y divide-line overflow-hidden rounded-[13px] border border-line bg-surface">
          {[null, "2026-12-31", "2026-09-22", "2026-08-01"].map((d, i) => {
            const deadline = formatDeadline(d);
            return (
              <li key={i} className="flex items-center justify-between gap-4 px-4 py-3">
                <code className="text-[11px] text-ink-faint">{d ?? "null"}</code>
                <span
                  className={`text-[12.5px] ${
                    deadline.tone === "urgent" || deadline.tone === "closed"
                      ? "font-medium text-alert-fg"
                      : "text-ink-muted"
                  }`}
                >
                  {deadline.text}
                </span>
              </li>
            );
          })}
        </ul>
      </Section>

      <Section title="비어 있음 · 오류" note="가장 나쁜 화면은 틀린 화면이 아니라 백지 화면이다.">
        <div className="space-y-3">
          <EmptyState
            title="아직 판정할 조건이 없어요"
            description="나이와 지역만 넣어도 대부분의 정책을 판정할 수 있어요."
            action={{ href: "/login", label: "로그인하고 시작하기" }}
          />
          <EmptyState
            title="아직 등록된 정책이 없어요"
            description="정책을 준비하고 있어요. 곧 다시 열어봐 주세요."
          />
          <ErrorState title="정책을 불러오지 못했어요" />
        </div>
        <p className="mt-2 text-[12px] leading-[1.65] text-ink-muted">
          &lsquo;조건 미입력&rsquo;과 &lsquo;판정 결과 0건&rsquo;은 절대 같은 화면을 쓰지 않는다. 전자는
          아직 판정 전이고, 후자는 판정이 끝난 것이다.
        </p>
      </Section>

      <Section title="바탕 색">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
          {swatches.map((s) => (
            <div key={s.name} className="overflow-hidden rounded-[11px] border border-line">
              <div className={`h-12 ${s.box}`} />
              <div className="bg-surface px-3 py-2">
                <p className="text-[11.5px] font-bold">{s.name}</p>
                <code className="text-[10.5px] text-ink-faint">{s.hex}</code>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <div className="mt-10">
        <Disclaimer />
      </div>
    </main>
  );
}

function Variant({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <span className="inline-flex flex-col items-start gap-1">
      {children}
      <span className="text-[10px] text-ink-faint">{label}</span>
    </span>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-9">
      <h2 className="text-[15px] font-bold">{title}</h2>
      {note ? <p className="mt-1 mb-3.5 text-[12.5px] text-ink-muted">{note}</p> : <div className="mb-3.5" />}
      {children}
    </section>
  );
}
