"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SignUp() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setMessage("오류: " + error.message);
    } else {
      setMessage("가입 완료. 로그인 페이지로 이동합니다.");
      setTimeout(() => router.push("/login"), 1000);
    }
  };

  return (
    <main className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">회원가입</h1>
      <form onSubmit={handleSignUp} className="space-y-4">
        <input
          type="email"
          placeholder="이메일"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="password"
          placeholder="비밀번호 (6자 이상)"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <button
          type="submit"
          className="bg-black text-white px-4 py-2 rounded w-full"
        >
          가입하기
        </button>
      </form>
      {message && <p className="mt-4 text-sm">{message}</p>}
      <p className="mt-4 text-sm">
        이미 계정이 있나요?{" "}
        <a href="/login" className="underline">
          로그인
        </a>
      </p>
    </main>
  );
}
