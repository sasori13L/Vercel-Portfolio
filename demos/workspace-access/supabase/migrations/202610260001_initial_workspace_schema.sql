create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_at timestamptz not null default now()
);

create table public.memberships (
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (organization_id, user_id)
);

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text not null default '',
  status text not null default 'open' check (status in ('open', 'complete')),
  created_by uuid not null default auth.uid() references auth.users(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index memberships_user_id_idx on public.memberships(user_id);
create index tasks_organization_id_idx on public.tasks(organization_id);

create function public.set_task_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = pg_catalog.now();
  return new;
end;
$$;

revoke all on function public.set_task_updated_at() from public, anon, authenticated;

create trigger tasks_set_updated_at
before update on public.tasks
for each row execute function public.set_task_updated_at();

alter table public.organizations enable row level security;
alter table public.memberships enable row level security;
alter table public.tasks enable row level security;

revoke all on table public.organizations from anon, authenticated;
revoke all on table public.memberships from anon, authenticated;
revoke all on table public.tasks from anon, authenticated;

grant select on table public.organizations to authenticated;
grant select on table public.memberships to authenticated;
grant select on table public.tasks to authenticated;
grant insert (organization_id, title, description, status) on public.tasks to authenticated;
grant update (title, description, status) on public.tasks to authenticated;
grant delete on table public.tasks to authenticated;

create policy "Members can read their organizations"
on public.organizations
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = organizations.id
      and m.user_id = (select auth.uid())
  )
);

create policy "Users can read their own memberships"
on public.memberships
for select
to authenticated
using (user_id = (select auth.uid()));

create policy "Members can read tasks in their organizations"
on public.tasks
for select
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = tasks.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "Members can create tasks as themselves"
on public.tasks
for insert
to authenticated
with check (
  created_by = (select auth.uid())
  and exists (
    select 1
    from public.memberships m
    where m.organization_id = tasks.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "Members can update tasks in their organizations"
on public.tasks
for update
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = tasks.organization_id
      and m.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = tasks.organization_id
      and m.user_id = (select auth.uid())
  )
);

create policy "Members can delete tasks in their organizations"
on public.tasks
for delete
to authenticated
using (
  exists (
    select 1
    from public.memberships m
    where m.organization_id = tasks.organization_id
      and m.user_id = (select auth.uid())
  )
);
