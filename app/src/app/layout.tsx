import type { Metadata } from "next";
import { Noto_Sans_KR, Noto_Serif_KR } from "next/font/google";
import "./globals.css";

// 한글 서비스인데 Geist(subsets: latin)를 쓰고 있었다. Geist 에는 한글
// 글리프가 없어서 본문이 기기 기본 폰트로 떨어졌고, 결과적으로 같은
// 화면이 기기마다 다르게 보였다.
//
// next/font 의 subsets 에 'korean' 은 없다. subsets 는 preload 대상만
// 정하고 나머지 글리프는 unicode-range 로 자체 호스팅되므로, latin 만
// 지정해도 한글은 정상 렌더된다. 한글 슬라이스는 용량이 커서 오히려
// preload 하지 않는 편이 낫다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

// 공고문 인용 전용. 본문(고딕)과 활자체로 구분한다 — 색으로 구분하면
// 판정 상태 배지의 색과 섞여서 인용문이 판정처럼 읽힌다.
const notoSerifKr = Noto_Serif_KR({
  variable: "--font-noto-serif-kr",
  subsets: ["latin"],
  weight: ["500", "600"],
});

export const metadata: Metadata = {
  title: "청년서랍",
  description: "내 조건으로 청년정책 신청 가능 여부와 공고문 근거를 확인합니다.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // lang 이 en 이면 스크린리더가 한글을 영어 발음으로 읽고 줄바꿈 규칙도 틀어진다.
    <html
      lang="ko"
      className={`${notoSansKr.variable} ${notoSerifKr.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
