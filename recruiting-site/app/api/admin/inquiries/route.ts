import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "../../../../lib/admin-auth";

export const runtime = "nodejs";

const ALLOWED_STATUSES = ["신규", "연락 완료", "상담 진행", "상담 완료"] as const;

function getSupabaseConfig() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY;
  if (!supabaseUrl || !supabaseSecretKey) return null;
  return { supabaseUrl, supabaseSecretKey };
}

export async function GET(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
  }

  const config = getSupabaseConfig();
  if (!config) {
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
      `${config.supabaseUrl}/rest/v1/recruitment_inquiries?${query.toString()}`,
      {
        method: "GET",
        headers: {
          apikey: config.supabaseSecretKey,
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

export async function PATCH(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: "관리자 로그인이 필요합니다." }, { status: 401 });
  }

  const config = getSupabaseConfig();
  if (!config) {
    return NextResponse.json(
      { error: "관리자 수정용 Supabase 비밀 키가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  let body: { id?: unknown; status?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "변경할 신청 정보를 확인해 주세요." }, { status: 400 });
  }

  const id = typeof body.id === "string" ? body.id : "";
  const status = typeof body.status === "string" ? body.status : "";

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: "신청 번호가 올바르지 않습니다." }, { status: 400 });
  }

  if (!ALLOWED_STATUSES.includes(status as (typeof ALLOWED_STATUSES)[number])) {
    return NextResponse.json({ error: "허용되지 않은 상담 상태입니다." }, { status: 400 });
  }

  const query = new URLSearchParams({
    id: `eq.${id}`,
    select: "id,status",
  });

  try {
    const response = await fetch(
      `${config.supabaseUrl}/rest/v1/recruitment_inquiries?${query.toString()}`,
      {
        method: "PATCH",
        headers: {
          apikey: config.supabaseSecretKey,
          Accept: "application/json",
          "Content-Type": "application/json",
          Prefer: "return=representation",
        },
        body: JSON.stringify({ status }),
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorBody = (await response.text()).slice(0, 600);
      console.error("[admin/inquiries] Supabase update error", {
        status: response.status,
        body: errorBody,
      });
      return NextResponse.json(
        { error: `상담 상태 변경 오류 (HTTP ${response.status}): ${errorBody || "상세 오류 내용 없음"}` },
        { status: 502 }
      );
    }

    const updatedRows = await response.json();
    if (!Array.isArray(updatedRows) || updatedRows.length === 0) {
      return NextResponse.json({ error: "해당 신청 내역을 찾을 수 없습니다." }, { status: 404 });
    }

    return NextResponse.json({ inquiry: updatedRows[0] }, {
      headers: { "Cache-Control": "private, no-store, max-age=0" },
    });
  } catch (caught) {
    console.error("[admin/inquiries] Update request failed", caught);
    return NextResponse.json({ error: "상태 변경 요청에 실패했습니다. Vercel 로그를 확인해 주세요." }, { status: 502 });
  }
}
