/**
 * Supabase Auth 의 영문 에러를 사용자 문구로 옮긴다.
 *
 * 원문("Invalid login credentials")을 그대로 보여주면 사용자는 읽지
 * 못하고, 무엇을 고쳐야 하는지도 알 수 없다. 매칭되지 않는 에러는
 * 일반 문구로 덮되, 원문은 호출부에서 console.error 로 남긴다.
 *
 * 비밀번호가 틀렸는지 없는 계정인지 구분해 알려주지 않는 것은 의도다
 * (계정 존재 여부가 새어 나간다).
 */
const RULES: [RegExp, string][] = [
  [/invalid login credentials/i, "이메일 또는 비밀번호가 맞지 않아요."],
  [/email not confirmed/i, "메일함에서 인증 링크를 먼저 확인해 주세요."],
  [/user already registered|already been registered/i, "이미 가입된 이메일이에요."],
  [/password should be at least/i, "비밀번호는 6자 이상이어야 해요."],
  [/unable to validate email|invalid email/i, "이메일 형식을 확인해 주세요."],
  [/rate limit|too many requests/i, "잠시 후 다시 시도해 주세요."],
  [/network|fetch failed/i, "연결이 불안정해요. 잠시 후 다시 시도해 주세요."],
];

export function authMessage(raw: string): string {
  for (const [pattern, text] of RULES) {
    if (pattern.test(raw)) return text;
  }
  return "처리하지 못했어요. 잠시 후 다시 시도해 주세요.";
}
