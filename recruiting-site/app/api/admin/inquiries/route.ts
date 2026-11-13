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
          Authorization: `Bearer ${supabaseSecretKey}`,
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "신청 내역을 불러오지 못했습니다. Supabase 관리자 키 설정을 확인해 주세요." },
        { status: 502 }
      );
    }

    const inquiries = await response.json();
    return NextResponse.json({ inquiries }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch {
    return NextResponse.json({ error: "신청 내역 조회 중 오류가 발생했습니다." }, { status: 502 });
  }
}
