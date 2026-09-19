import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// 서버 컴포넌트 / 서버 액션에서 쓰는 Supabase 클라이언트.
// 요청 쿠키에서 로그인 세션을 읽으므로 auth.getUser()와 RLS(auth.uid())가 동작한다.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // 서버 컴포넌트에서는 쿠키를 쓸 수 없다 (읽기만 가능). 무시해도 된다.
          }
        },
      },
    }
  );
}
