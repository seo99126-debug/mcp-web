import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

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

  const { data: policies, error } = await supabase
    .from("policies")
    .select("id, name, agency, benefit_text, apply_end")
    .order("apply_end");

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">청년서랍</h1>
          <p className="text-zinc-500 text-sm">등록된 청년정책 목록</p>
        </div>
        {user ? (
          <div className="flex items-center gap-3 text-sm">
            <span className="text-zinc-600">{user.email}</span>
            <LogoutButton />
          </div>
        ) : (
          <Link href="/login" className="text-sm underline">
            로그인
          </Link>
        )}
      </div>

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
