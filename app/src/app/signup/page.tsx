"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authMessage } from "@/lib/authMessage";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  // 성공과 실패를 같은 회색 문단으로 보여주고 있었다. 색이 같으면
  // 사용자는 가입이 된 건지 안 된 건지 문장을 읽어야만 안다.
  const [ok, setOk] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.error("[auth] 가입 실패:", error.message);
      setOk(false);
      setMessage(authMessage(error.message));
    } else {
      setOk(true);
      setMessage("가입이 끝났어요. 로그인 화면으로 이동할게요.");
      setTimeout(() => router.push("/login"), 1000);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md p-6 sm:p-8">
      <h1 className="font-serif text-2xl font-semibold">회원가입</h1>

      <form onSubmit={handleSignUp} className="mt-6 space-y-4">
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
            autoComplete="new-password"
            required
            minLength={6}
            aria-describedby="password-help"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="min-h-[46px] w-full rounded-[10px] border border-line-strong bg-surface px-3.5 py-2.5 text-sm"
          />
          {/* 규칙을 placeholder 에 두면 입력을 시작하는 순간 사라진다. */}
          <p id="password-help" className="mt-1.5 text-[11.5px] text-ink-faint">
            6자 이상으로 입력해 주세요.
          </p>
        </div>

        <button
          type="submit"
          className="min-h-[50px] w-full rounded-[11px] bg-brand text-[15px] font-bold text-white hover:bg-brand-strong"
        >
          가입하기
        </button>
      </form>

      {message && (
        <p
          role="status"
          className={`mt-4 text-[12.5px] leading-[1.65] ${ok ? "text-pass-fg" : "text-alert-fg"}`}
        >
          {message}
        </p>
      )}

      <p className="mt-6 text-[12.5px] text-ink-muted">
        이미 계정이 있나요?{" "}
        <a href="/login" className="font-medium text-brand underline hover:text-brand-strong">
          로그인
        </a>
      </p>
    </main>
  );
}
