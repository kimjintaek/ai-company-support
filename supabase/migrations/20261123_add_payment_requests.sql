-- Apply manually in Supabase SQL Editor before testing the payment request feature.
create table if not exists public.payment_requests (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.members(id) on delete cascade,
  depositor_name text not null check (char_length(btrim(depositor_name)) between 2 and 80),
  status text not null default '입금확인요청' check (status in ('입금확인요청', '확인완료')),
  requested_at timestamptz not null default now(),
  confirmed_at timestamptz,
  unique (member_id)
);
alter table public.payment_requests enable row level security;
drop policy if exists "Members can view own payment request" on public.payment_requests;
create policy "Members can view own payment request" on public.payment_requests
for select to authenticated using (
  exists (select 1 from public.members m where m.id = member_id and m.auth_user_id = auth.uid())
  or exists (select 1 from public.admin_users a where a.auth_user_id = auth.uid())
);
drop policy if exists "Members can request own payment verification" on public.payment_requests;
create policy "Members can request own payment verification" on public.payment_requests
for insert to authenticated with check (
  status = '입금확인요청' and confirmed_at is null
  and exists (select 1 from public.members m where m.id = member_id and m.auth_user_id = auth.uid())
);
drop policy if exists "Admins can confirm payment request" on public.payment_requests;
create policy "Admins can confirm payment request" on public.payment_requests
for update to authenticated using (
  exists (select 1 from public.admin_users a where a.auth_user_id = auth.uid())
) with check (
  exists (select 1 from public.admin_users a where a.auth_user_id = auth.uid())
);
