import { NextRequest, NextResponse } from "next/server";
import {
  createAdminSessionToken,
  hasSameOrigin,
  safeCompare,
  setAdminSessionCookie,
} from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const usernameSetting = process.env.RECRUITING_ADMIN_USERNAME;
  const passwordSetting = process.env.RECRUITING_ADMIN_PASSWORD;
  const sessionSecret = process.env.RECRUITING_ADMIN_SESSION_SECRET;

  if (!usernameSetting || !passwordSetting || !sessionSecret || sessionSecret.length < 32) {
    return NextResponse.json(
      { error: "관리자 로그인 환경변수가 설정되지 않았습니다. 운영자 설정이 필요합니다." },
      { status: 503 }
    );
  }

  let body: { username?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "로그인 정보를 확인해 주세요." }, { status: 400 });
  }

  const username = typeof body.username === "string" ? body.username : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (
    !safeCompare(username, usernameSetting) ||
    !safeCompare(password, passwordSetting)
  ) {
    return NextResponse.json({ error: "아이디 또는 비밀번호가 올바르지 않습니다." }, { status: 401 });
  }

  try {
    const response = NextResponse.json({ success: true });
    setAdminSessionCookie(response, createAdminSessionToken());
    return response;
  } catch {
    return NextResponse.json({ error: "관리자 세션을 생성하지 못했습니다." }, { status: 500 });
  }
}
