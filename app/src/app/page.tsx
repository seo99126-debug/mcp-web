import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { Disclaimer, EmptyState, ErrorState } from "@/components/EmptyState";
import { formatDeadline, joinMeta } from "@/lib/format";

// 매 요청마다 DB에서 새로 읽는다 (빌드 시점에 고정되지 않게)
export const dynamic = "force-dynamic";

type Policy = {
  id: string;
  name: string;
  agency: string | null;
  benefit_text: string | null;
  apply_end: string | null;
};

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("policies")
    .select("id, name, agency, benefit_text, apply_end")
    .order("apply_end");

  // 원문 에러는 서버 로그에만 남긴다. 화면에는 사용자가 읽을 수 있는
  // 문구를 보여준다 — Supabase 의 영문 메시지를 그대로 내보내면
  // 사용자는 무엇을 해야 할지 알 수 없고 내부 구조만 드러난다.
  if (error) console.error("[policies] 조회 실패:", error.message);

  const policies = (data ?? []) as Policy[];

  return (
    <main className="mx-auto w-full max-w-2xl p-6 sm:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-semibold">청년서랍</h1>
          <p className="mt-1 text-sm text-ink-muted">등록된 청년정책 목록</p>
        </div>
        {user ? (
          <div className="flex shrink-0 items-center gap-3 text-sm">
            <span className="text-ink-muted">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <Link
            href="/login"
            className="inline-flex min-h-[40px] shrink-0 items-center rounded-[9px] border border-line-strong bg-surface px-3.5 text-sm font-medium text-ink hover:bg-fill"
          >
            로그인
          </Link>
        )}
      </div>

      {error ? (
        <ErrorState title="정책을 불러오지 못했어요" />
      ) : policies.length === 0 ? (
        <EmptyState
          title="아직 등록된 정책이 없어요"
          description="정책을 준비하고 있어요. 곧 다시 열어봐 주세요."
        />
      ) : (
        <ul className="space-y-2.5">
          {policies.map((p) => {
            const meta = joinMeta(p.agency, p.benefit_text);
            const deadline = formatDeadline(p.apply_end);
            return (
              <li key={p.id} className="rounded-[13px] border border-line bg-surface p-4">
                <p className="text-[15px] font-bold leading-snug">{p.name}</p>
                {meta ? <p className="mt-1.5 text-[12.5px] text-ink-muted">{meta}</p> : null}
                <p
                  className={`mt-2 text-xs ${
                    deadline.tone === "urgent" || deadline.tone === "closed"
                      ? "font-medium text-alert-fg"
                      : "text-ink-faint"
                  }`}
                >
                  {deadline.text}
                </p>
              </li>
            );
          })}
        </ul>
      )}

      {/* 비로그인 사용자가 목록만 보고 나가지 않도록. 판정은 로그인 뒤에만 존재한다. */}
      {!user && policies.length > 0 ? (
        <div className="mt-6 rounded-[13px] bg-fill px-5 py-5 text-center">
          <p className="text-[15px] font-bold">내 조건으로 판정해 볼까요?</p>
          <p className="mt-2 text-[12.5px] leading-[1.65] text-ink-muted">
            나이와 지역만 넣어도 대부분의 정책을 판정할 수 있어요.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex min-h-[46px] items-center justify-center rounded-[10px] bg-brand px-5 py-3 text-sm font-bold text-white hover:bg-brand-strong"
          >
            로그인하고 시작하기
          </Link>
        </div>
      ) : null}

      <div className="mt-8">
        <Disclaimer />
      </div>
    </main>
  );
}
