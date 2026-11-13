import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !supabaseSecretKey) {
    return NextResponse.json(
      { error: "관리자 조회용 Supabase 비밀 키가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  const query = new URLSearchParams({
    select: "id,name,phone,insurance_company,experience,desired_support,status,created_at",
    order: "created_at.desc",
    limit: "200",
  });

  try {
    const response = await fetch(
      `${supabaseUrl}/rest/v1/recruitment_inquiries?${query.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: supabaseSecretKey,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorBody = (await response.text()).slice(0, 600);
      console.error("[admin/inquiries] Supabase response error", {
        status: response.status,
        body: errorBody,
      });
      return NextResponse.json(
        {
          error: `Supabase 조회 오류 (HTTP ${response.status}): ${errorBody || "상세 오류 내용 없음"}`,
        },
        { status: 502 }
      );
    }

    const inquiries = await response.json();
    return NextResponse.json({ inquiries }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (caught) {
    console.error("[admin/inquiries] Request failed", caught);
    return NextResponse.json({ error: "Supabase 요청 자체가 실패했습니다. Vercel 로그를 확인해야 합니다." }, { status: 502 });
  }
}
