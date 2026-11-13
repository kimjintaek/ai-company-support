import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_TEXT_LENGTH = 1000;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const insuranceCompany =
      typeof body.insurance_company === "string"
        ? body.insurance_company.trim()
        : "";
    const experience =
      typeof body.experience === "string" ? body.experience.trim() : "";
    const desiredSupport =
      typeof body.desired_support === "string"
        ? body.desired_support.trim()
        : "";
    const privacyConsent = body.privacy_consent === true;

    if (name.length < 2 || name.length > 50) {
      return NextResponse.json({ error: "이름을 2~50자로 입력해 주세요." }, { status: 400 });
    }
    if (!/^[0-9+()\-\s]{8,20}$/.test(phone)) {
      return NextResponse.json({ error: "연락처를 확인해 주세요." }, { status: 400 });
    }
    if (insuranceCompany.length < 1 || insuranceCompany.length > 100) {
      return NextResponse.json({ error: "소속 보험회사 및 조직을 입력해 주세요." }, { status: 400 });
    }
    if (desiredSupport.length > MAX_TEXT_LENGTH) {
      return NextResponse.json({ error: "참여 희망 내용은 1,000자 이내로 입력해 주세요." }, { status: 400 });
    }
    if (!privacyConsent) {
      return NextResponse.json({ error: "개인정보 수집·이용 동의가 필요합니다." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json({ error: "접수 시스템 설정을 확인하고 있습니다." }, { status: 500 });
    }

    const databaseResponse = await fetch(
      `${supabaseUrl}/rest/v1/recruitment_inquiries`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          name,
          phone,
          insurance_company: insuranceCompany,
          experience: experience || null,
          desired_support: desiredSupport || null,
          privacy_consent: true,
        }),
        cache: "no-store",
      }
    );

    if (!databaseResponse.ok) {
      return NextResponse.json({ error: "신청 내용을 저장하지 못했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "입력 내용을 확인한 뒤 다시 신청해 주세요." }, { status: 400 });
  }
}
