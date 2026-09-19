import { supabase } from "@/utils/supabase";

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
  if (!supabase) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold mb-4">청년서랍</h1>
        <p className="text-red-600">
          NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY 환경변수가 없습니다.
        </p>
      </main>
    );
  }

  const { data: policies, error } = await supabase
    .from("policies")
    .select("id, name, agency, benefit_text, apply_end")
    .order("apply_end");

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-1">청년서랍</h1>
      <p className="text-zinc-500 mb-6">등록된 청년정책 목록</p>

      {error && <p className="text-red-600">오류: {error.message}</p>}

      <ul className="space-y-3">
        {(policies as Policy[] | null)?.map((p) => (
          <li key={p.id} className="rounded-lg border border-zinc-200 p-4">
            <div className="font-semibold">{p.name}</div>
            <div className="text-sm text-zinc-600">
              {p.agency} · {p.benefit_text} · 마감 {p.apply_end}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
