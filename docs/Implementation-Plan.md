# Workspace Access Demo — Implementation Plan

This plan turns the requirements in [the product specification](./workspace-access-demo-spec.md) into an ordered, reviewable build sequence.

## 1. Implementation decisions

- **Keep the existing portfolio intact.** The repository root is currently a Next.js portfolio, while the spec calls for React, TypeScript, Vite, and Tailwind. Build the demo as a standalone app under `demos/workspace-access/`, with its own `package.json`, Vite config, TypeScript config, and Tailwind setup. Configure a separate Vercel project with that directory as its root. This preserves the required Vite stack without changing the portfolio's root build.
- **Use Supabase Auth plus direct, authenticated Supabase client calls.** RLS is the authorization boundary for all tenant records.
- **Use two fictional organizations and at least two demo users.** Each user should belong to one organization for the initial demo; keep the schema capable of supporting multiple memberships.
- **Provision memberships outside the browser.** Public sign-up must not grant organization membership. Create demo Auth users in Supabase and associate their IDs with memberships through a documented trusted setup step.
- **Treat reviewer accounts as mutable demo data.** Document that users can alter their own organization's tasks. Do not put sensitive data in the public project. If public writes become a problem, switch the demo accounts to read-only policies or add a reset process as a follow-up.

## 2. Phase 0 — Repository and deployment setup

### Tasks

1. Create `demos/workspace-access/` as an independent Vite + React + TypeScript app.
2. Add Tailwind and establish a small set of reusable layout, form, button, badge, and panel styles.
3. Add `.env.example` with only client-side variable names, such as `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`; include no real credentials.
4. Add an app README or link it to the root README, explaining the app's independent setup.
5. Create a separate Vercel project rooted at `demos/workspace-access/`; configure the expected build and output settings.

### Exit criteria

- The demo runs independently from its directory.
- The existing portfolio's dependencies and root scripts remain unchanged.
- A Vercel preview can build the standalone demo without deploying the portfolio as the demo.

## 3. Phase 1 — Supabase schema, seed setup, and RLS

### Tasks

1. Add a Supabase migration directory under `demos/workspace-access/supabase/migrations/`.
2. Create `organizations`, `memberships`, and `tasks` with the fields, foreign keys, defaults, and constraints in the spec.
3. Add indexes for `tasks.organization_id` and `memberships.user_id`.
4. Enable RLS on all three exposed tables.
5. Set explicit grants for `anon` and `authenticated`; revoke unnecessary access and grant only operations the app needs.
6. Add separate policies for organization reads, membership reads, and task select/insert/update/delete.
7. Ensure insert policies validate both organization membership and `created_by = auth.uid()`.
8. Ensure update policies check the existing and resulting row, preventing changes to `organization_id` or `created_by` that would bypass access.
9. Do not add public insert/update/delete policies for memberships. Keep membership provisioning to the trusted setup path.
10. Add a setup guide for creating two Auth users, capturing their user IDs, creating the two organizations, and inserting the corresponding memberships plus fictional tasks.

### Exit criteria

- Schema and policies are reproducible from checked-in migrations.
- The setup guide does not ask a reviewer to expose a service-role key in frontend configuration.
- A direct authenticated request for another organization's task is filtered or denied by the database.
- Anonymous users cannot access tenant data, and the browser client cannot create or change memberships.

## 4. Phase 2 — App foundation and authentication

### Tasks

1. Add a typed Supabase client initialized from the Vite environment variables.
2. Add auth state handling for initial session load, sign-in, sign-out, and expired sessions.
3. Build the signed-out screen with a short explanation and validated email/password form.
4. Build an authenticated shell showing the user's email, active organization, and sign-out action.
5. Load organization memberships through the authenticated client; handle no-membership and multiple-membership states explicitly.
6. Keep all privileged configuration out of the client. The Vite bundle may contain the Supabase URL and anon key only.

### Exit criteria

- Each demo user can sign in and sign out.
- Unauthenticated users see no workspace data.
- A user with no membership receives a useful empty/error state and cannot access tenant records.

## 5. Phase 3 — Workspace and task management

### Tasks

1. Implement organization selection if a user has multiple memberships; otherwise show the user's single organization.
2. Load tasks for the selected organization using the authenticated client and rely on RLS for the final row filtering.
3. Add summary cards for open, complete, and total task counts.
4. Add task list, status filter, and created date display.
5. Add create and edit forms with required title validation and optional description.
6. Add complete/reopen and delete actions with clear confirmation or undo feedback.
7. Implement loading, empty, validation, error, and success states.
8. Ensure task writes do not accept arbitrary organization or creator values from the form; derive trusted values from current app state and database defaults, while RLS independently validates them.
9. Make the layout usable on mobile and keyboard accessible.

### Exit criteria

- Authorized users can create, read, update, complete/reopen, and delete tasks in their organization.
- Invalid or denied operations show neutral errors without leaking another organization's task details.
- Summary counts and filters reflect the currently loaded authorized rows.

## 6. Phase 4 — Security demonstration

### Tasks

1. Add a distinct “Security demo” panel with a plain-language explanation of tenant isolation.
2. Select a known task ID from the other seeded organization for each demo user, without exposing that task's title or description.
3. Add a button that queries the known ID through the currently authenticated Supabase client.
4. Present three states: not run, blocked as expected, and unexpected access/error.
5. Treat a returned row as a serious failure state. Do not render the row's protected content; communicate that the policy needs review.
6. Include a compact explanation of the relevant policy and distinguish database enforcement from frontend filtering.
7. Add documented verification scenarios for cross-tenant select, insert, update/reassignment, delete, anonymous access, and membership mutation attempts.

### Exit criteria

- Company A's user gets no accessible Company B task from the security check, and vice versa.
- The UI never displays the foreign task's title or description.
- The documentation explains expected outcomes for each verification scenario.

## 7. Phase 5 — Documentation, release, and handoff

### Tasks

1. Document local install, environment setup, Supabase project setup, migrations, demo-user provisioning, and Vercel deployment.
2. Document demo account access without committing passwords or privileged secrets to the repository.
3. Explain the schema, each policy's purpose, the public-write behavior, and the project's security limitations.
4. Add a final checklist mapping each acceptance criterion in the spec to its implementation location or verification procedure.
5. Deploy a Vercel preview, configure production client variables, and publish the demo only after checking the deployed app and Supabase configuration.

### Exit criteria

- A reviewer can follow the README to understand and try the demo.
- The Vercel deployment uses only public client configuration.
- Both demo accounts work and isolation is demonstrable in the deployed environment.
- The portfolio's root app remains deployable independently.

## 8. Verification matrix

| Scenario | Expected result |
| --- | --- |
| Signed-out user selects organizations, memberships, or tasks | No tenant rows returned; mutations denied |
| Member selects tasks in their organization | Only that organization's tasks are visible |
| Member selects a known foreign task ID | No row returned or operation denied |
| Member inserts into their organization with their own identity | Allowed |
| Member inserts into a foreign organization | Denied |
| Member changes an existing task's organization or creator | Denied |
| Member updates or deletes a foreign task | Denied |
| Member attempts to add or change a membership from the browser | Denied |
| Authorized member performs normal task CRUD | Allowed |

Run these checks using real authenticated sessions for each demo user, not only as the database owner. Keep any SQL or browser-console verification steps in the README reproducible and safe for the demo project.

## 9. Dependencies and sequencing

- The UI work depends on the table and policy contract from Phase 1.
- The organization screen depends on Auth and membership reads from Phase 2.
- Task CRUD depends on both the workspace UI and operation-specific RLS policies.
- The isolation panel depends on seeded foreign task IDs and working authenticated reads.
- Public deployment depends on successful setup and verification of both demo accounts.

## 10. Main implementation risks

- **Stack mismatch with repository root:** isolate Vite in a subdirectory and deploy it as a separate Vercel project; do not convert the portfolio root as part of this demo.
- **Membership bootstrap:** migrations cannot safely assume Auth user IDs. Create demo Auth users first, then provision memberships through the documented trusted step.
- **RLS policy gaps:** test each operation independently; a correct `SELECT` rule does not automatically secure writes.
- **Public demo writes:** public credentials make the demo easy to inspect but allow users to modify their own tenant's sample data. Use synthetic data and decide whether public writes or read-only access best fits the portfolio.
- **Misleading security result:** an empty response can also indicate a wrong ID or configuration problem. Seed a known foreign task and display an error separately from the expected blocked result.

## 11. Definition of done

The demo is done when every acceptance criterion in the product spec is implemented or has a documented verification step, both tenant accounts can use the deployed app, cross-tenant reads and writes are blocked by RLS, and the standalone Vite demo and existing portfolio can be deployed independently.
