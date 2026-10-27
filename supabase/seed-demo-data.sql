-- Trusted setup only: run in the Supabase SQL Editor after creating both Auth users.
-- Replace each UUID placeholder with the corresponding Auth user's id.
-- Never expose a service-role key in the browser to provision these rows.

insert into public.organizations (id, name)
values
  ('10000000-0000-4000-8000-000000000001', 'Northstar Studio'),
  ('10000000-0000-4000-8000-000000000002', 'Cedar Works')
on conflict (id) do update set name = excluded.name;

insert into public.memberships (organization_id, user_id, role)
values
  ('10000000-0000-4000-8000-000000000001', '<USER_A_AUTH_UUID>'::uuid, 'member'),
  ('10000000-0000-4000-8000-000000000002', '<USER_B_AUTH_UUID>'::uuid, 'member')
on conflict (organization_id, user_id) do nothing;

insert into public.tasks (id, organization_id, title, description, status, created_by)
values
  ('20000000-0000-4000-8000-000000000001', '10000000-0000-4000-8000-000000000001', 'Prepare the launch checklist', 'Collect final review notes and confirm the release sequence.', 'open', '<USER_A_AUTH_UUID>'::uuid),
  ('20000000-0000-4000-8000-000000000002', '10000000-0000-4000-8000-000000000001', 'Review the workspace brief', 'Summarize the decisions from the project kickoff.', 'complete', '<USER_A_AUTH_UUID>'::uuid),
  ('20000000-0000-4000-8000-000000000003', '10000000-0000-4000-8000-000000000002', 'Map the customer journey', 'Document the main steps for a first-time customer.', 'open', '<USER_B_AUTH_UUID>'::uuid),
  ('20000000-0000-4000-8000-000000000004', '10000000-0000-4000-8000-000000000002', 'Organize the design library', 'Group reusable components for the next sprint.', 'complete', '<USER_B_AUTH_UUID>'::uuid)
on conflict (id) do nothing;
