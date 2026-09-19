"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authMessage } from "@/lib/authMessage";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("[auth] 로그인 실패:", error.message);
      setMessage(authMessage(error.message));
    } else {
      router.push("/");
      router.refresh(); // 서버 컴포넌트가 새 세션 쿠키로 다시 렌더되게
    }
  };

  return (
    <main className="mx-auto w-full max-w-md p-6 sm:p-8">
      <h1 className="font-serif text-2xl font-semibold">로그인</h1>

      <form onSubmit={handleLogin} className="mt-6 space-y-4">
        {/* placeholder 만 있으면 입력을 시작한 순간 무슨 칸이었는지 사라지고,
            스크린리더가 읽을 라벨도 없다. */}
        <div>
          <label htmlFor="email" className="mb-1.5 block text-[12.5px] font-bold">
            이메일
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="min-h-[46px] w-full rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-sm"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-[12.5px] font-bold">
            비밀번호
          </label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[46px] w-full rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-sm"
          />
        </div>

        <button
          type="submit"
          className="min-h-[50px] w-full rounded-[11px] bg-brand text-[15px] font-bold text-white hover:bg-brand-strong"
        >
          로그인
        </button>
      </form>

      {message && (
        <p role="alert" className="mt-4 text-[12.5px] leading-[1.65] text-alert-fg">
          {message}
        </p>
      )}

      <p className="mt-6 text-[12.5px] text-ink-muted">
        계정이 없나요?{" "}
        <a href="/signup" className="font-medium text-brand underline hover:text-brand-strong">
          회원가입
        </a>
      </p>
    </main>
  );
}
