"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    // 터치 목표는 44px 이상. 밑줄 텍스트만 두면 모바일에서 누르기 어렵다.
    <button
      onClick={handleLogout}
      className="inline-flex min-h-[40px] items-center rounded-[9px] border border-line-strong bg-surface px-3 text-sm font-medium text-ink hover:bg-fill"
    >
      로그아웃
    </button>
  );
}
