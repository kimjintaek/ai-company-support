-- Allow administrators to save a diagnosis draft before the customer uploads files.
-- Apply this migration in the Supabase SQL Editor before testing the new admin flow.

CREATE OR REPLACE FUNCTION public.admin_save_member_diagnosis_draft(
  p_member_id uuid,
  p_ai_draft text,
  p_expert_memo text
)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
DECLARE
  v_diagnosis public.diagnoses%ROWTYPE;
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION '관리자 권한이 필요합니다.';
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM public.members m
    WHERE m.id = p_member_id
  ) THEN
    RAISE EXCEPTION '신청 기업을 찾을 수 없습니다.';
  END IF;

  SELECT d.*
    INTO v_diagnosis
  FROM public.diagnoses d
  WHERE d.member_id = p_member_id
  ORDER BY d.created_at DESC
  LIMIT 1
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO public.diagnoses (
      member_id,
      ai_draft,
      expert_memo
    )
    VALUES (
      p_member_id,
      p_ai_draft,
      p_expert_memo
    )
    RETURNING * INTO v_diagnosis;
  ELSE
    UPDATE public.diagnoses
    SET
      ai_draft = p_ai_draft,
      expert_memo = p_expert_memo,
      updated_at = now()
    WHERE id = v_diagnosis.id
    RETURNING * INTO v_diagnosis;
  END IF;

  RETURN to_jsonb(v_diagnosis);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_save_member_diagnosis_draft(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_save_member_diagnosis_draft(uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_save_member_diagnosis_draft(uuid, text, text) TO authenticated;
