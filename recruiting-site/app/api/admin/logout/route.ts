import { NextRequest, NextResponse } from "next/server";
import { clearAdminSessionCookie, hasSameOrigin } from "../../../../lib/admin-auth";

export async function POST(request: NextRequest) {
  if (!hasSameOrigin(request)) {
    return NextResponse.json({ error: "허용되지 않은 요청입니다." }, { status: 403 });
  }

  const response = NextResponse.json({ success: true });
  clearAdminSessionCookie(response);
  return response;
}
