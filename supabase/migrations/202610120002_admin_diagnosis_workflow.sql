-- Keep the admin diagnosis RPCs versioned in the repository.
-- Safe to re-apply in the preview database: these functions are replaced in place.

CREATE OR REPLACE FUNCTION public.admin_list_diagnoses()
RETURNS SETOF public.diagnoses
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = pg_catalog, public
AS $$
BEGIN
  IF auth.uid() IS NULL OR NOT EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
  ) THEN
    RAISE EXCEPTION '관리자 권한이 필요합니다.';
  END IF;

  RETURN QUERY
  SELECT d.*
  FROM public.diagnoses d
  ORDER BY d.created_at DESC;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_publish_diagnosis(
  p_diagnosis_id uuid,
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

  IF p_ai_draft IS NULL OR length(trim(p_ai_draft)) = 0 THEN
    RAISE EXCEPTION '최종 진단서 내용을 입력해주세요.';
  END IF;

  UPDATE public.diagnoses d
  SET
    ai_draft = p_ai_draft,
    published_draft = p_ai_draft,
    expert_memo = p_expert_memo,
    sent_at = now(),
    updated_at = now()
  WHERE d.id = p_diagnosis_id
  RETURNING d.* INTO v_diagnosis;

  IF NOT FOUND THEN
    RAISE EXCEPTION '진단자료를 찾을 수 없습니다.';
  END IF;

  RETURN to_jsonb(v_diagnosis);
END;
$$;

REVOKE ALL ON FUNCTION public.admin_list_diagnoses() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_list_diagnoses() FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_list_diagnoses() TO authenticated;

REVOKE ALL ON FUNCTION public.admin_publish_diagnosis(uuid, text, text) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.admin_publish_diagnosis(uuid, text, text) FROM anon;
GRANT EXECUTE ON FUNCTION public.admin_publish_diagnosis(uuid, text, text) TO authenticated;
