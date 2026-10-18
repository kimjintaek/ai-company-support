import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

type DiagnosisFileField =
  | "business_registration_file_path"
  | "financial_file_path"
  | "insurance_file_path";

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { error: "서버에 관리자 삭제 기능의 Supabase 키가 설정되지 않았습니다." },
      { status: 503 }
    );
  }

  const authorization = request.headers.get("authorization") || "";
  const accessToken = authorization.startsWith("Bearer ")
    ? authorization.slice("Bearer ".length)
    : "";

  if (!accessToken) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  let body: { diagnosisId?: unknown; fileField?: unknown };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const diagnosisId =
    typeof body.diagnosisId === "string" ? body.diagnosisId.trim() : "";
  const fileField = body.fileField as DiagnosisFileField;

  if (
    !diagnosisId ||
    (fileField !== "business_registration_file_path" &&
      fileField !== "financial_file_path" &&
      fileField !== "insurance_file_path")
  ) {
    return NextResponse.json({ error: "삭제할 자료 정보가 올바르지 않습니다." }, { status: 400 });
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  const { data: { user }, error: userError } =
    await adminClient.auth.getUser(accessToken);

  if (userError || !user) {
    return NextResponse.json({ error: "로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요." }, { status: 401 });
  }

  const { data: adminUser, error: adminError } = await adminClient
    .from("admin_users")
    .select("id")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (adminError || !adminUser) {
    return NextResponse.json({ error: "관리자 권한이 확인되지 않습니다." }, { status: 403 });
  }

  const { data: diagnosis, error: diagnosisError } = await adminClient
    .from("diagnoses")
    .select("id, member_id, business_registration_file_path, financial_file_path, insurance_file_path")
    .eq("id", diagnosisId)
    .maybeSingle();

  if (diagnosisError || !diagnosis) {
    return NextResponse.json({ error: "해당 진단자료를 찾을 수 없습니다." }, { status: 404 });
  }

  const filePath = diagnosis[fileField];
  if (!filePath) {
    return NextResponse.json({ error: "이미 삭제되었거나 등록되지 않은 파일입니다." }, { status: 404 });
  }

  const { data: member, error: memberError } = await adminClient
    .from("members")
    .select("auth_user_id")
    .eq("id", diagnosis.member_id)
    .maybeSingle();

  if (
    memberError ||
    !member?.auth_user_id ||
    !filePath.startsWith(member.auth_user_id + "/")
  ) {
    return NextResponse.json({ error: "파일 소유자 정보가 일치하지 않아 삭제를 중단했습니다." }, { status: 409 });
  }

  const { error: storageError } = await adminClient.storage
    .from("diagnosis-files")
    .remove([filePath]);

  if (storageError) {
    return NextResponse.json(
      { error: "저장소 파일 삭제에 실패했습니다: " + storageError.message },
      { status: 500 }
    );
  }

  const { data: updatedDiagnosis, error: updateError } = await adminClient
    .from("diagnoses")
    .update({ [fileField]: null })
    .eq("id", diagnosisId)
    .eq(fileField, filePath)
    .select("id")
    .maybeSingle();

  if (updateError || !updatedDiagnosis) {
    return NextResponse.json(
      {
        error:
          "파일은 삭제했지만 데이터베이스 경로 정리에 실패했습니다. 다시 시도하거나 관리자에게 알려주세요.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}
