# Workspace Access Demo — Product Specification

## 1. Purpose

Build a small, polished multi-tenant task dashboard that demonstrates secure organization-level data isolation with Supabase Auth and PostgreSQL Row Level Security (RLS). A signed-in user should only be able to access tasks belonging to an organization where they have a membership. The authorization boundary must be enforced by the database, not only by frontend filtering.

This is a portfolio demo, not a production project-management product. Use fictional organizations, users, and tasks only.

## 2. Goals

- Demonstrate a working Next.js App Router, React, and TypeScript application deployed to Vercel.
- Demonstrate Supabase authentication and organization membership.
- Enforce task access with RLS for read and write operations.
- Make cross-organization denial easy to understand and demonstrate.
- Document the schema, policies, setup, and demo limitations for reviewers.

## 3. Out of scope

- Real customer data or production use.
- Organization invitations, billing, audit exports, or advanced administration.
- Third-party integrations, email delivery, or AI features.
- A service-role key in the browser or any client-side authorization treated as sufficient security.

## 4. Users and roles

- **Member:** can view and manage tasks in organizations where they have a membership.
- **Reviewer:** uses one of the published demo accounts to inspect the app and security explanation.

For the first version, organization membership grants the same task permissions to all members. Role-based permissions can be a later extension.

## 5. Core user journeys

### A. Sign in and view a workspace

1. The user opens the app and sees a short description and sign-in form.
2. The user signs in with a provided demo account or their configured account.
3. The app loads that user's organizations and tasks through the authenticated Supabase client.
4. The user sees only organizations and tasks they are authorized to access.

### B. Manage a task

1. The user creates a task with a title and optional description, or edits/completes/deletes an existing task.
2. The app sends the request through Supabase using the user's session.
3. The database allows the change only if the user is a member of the task's organization.
4. The UI displays success or a clear error without exposing sensitive database details.

### C. Demonstrate tenant isolation

1. The user opens a “Security demo” panel.
2. The panel explains that task access is checked by database RLS.
3. The user runs a safe check against a known task ID belonging to the other sample organization.
4. The request returns no accessible row (or a permission error), and the UI reports that cross-organization access was blocked.
5. The panel explains that hiding a task in the UI is not the security control; the RLS policy is.

## 6. Functional requirements

- Email/password sign-in and sign-out using Supabase Auth.
- Authenticated app shell with current user's email and sign-out action.
- Organization selector when a user belongs to more than one organization; omit it if each demo user has exactly one.
- Task list with title, description, status, and created date.
- Create, edit, complete/reopen, and delete task actions.
- Loading, empty, validation, and error states.
- Security demo panel with a cross-tenant access check.
- Responsive layout suitable for desktop and mobile.
- README with local setup, Supabase setup, deployment setup, demo credentials guidance, schema/policy overview, and security limitations.

## 7. Data model

### `organizations`

- `id uuid primary key`
- `name text not null`
- `created_at timestamptz not null default now()`

### `memberships`

- `organization_id uuid not null references organizations(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `role text not null default 'member'` (reserved for a later role-based extension)
- `created_at timestamptz not null default now()`
- Composite primary key: `(organization_id, user_id)`

### `tasks`

- `id uuid primary key default gen_random_uuid()`
- `organization_id uuid not null references organizations(id) on delete cascade`
- `title text not null`
- `description text not null default ''`
- `status text not null default 'open'` with allowed values `open` and `complete`
- `created_by uuid not null default auth.uid() references auth.users(id)`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`

Add an index on `tasks.organization_id` and an index on `memberships.user_id`. Add a database constraint for allowed task status values. Treat `organization_id` as immutable through the app; updates must not let a member move a task into an organization they do not belong to.

## 8. Security requirements

- Enable RLS on all exposed tables: `organizations`, `memberships`, and `tasks`.
- Grant only the database operations required by the app to the `authenticated` role; do not rely on policies alone to remove table privileges.
- `anon` users must not read or mutate organization, membership, or task data.
- A user may read an organization only when a matching membership exists.
- A user may read tasks only when a matching membership exists for the task's `organization_id`.
- Inserts must require membership in the target organization and require `created_by` to match `auth.uid()`.
- Updates must check both the existing row and resulting row so a user cannot reassign the organization or creator to bypass isolation.
- Deletes must require membership in the task's organization.
- Membership rows must not be self-created or self-edited through the public client. Provision sample memberships through a trusted setup/migration process.
- Keep the Supabase service-role key out of Vercel client environment variables and browser bundles.
- Do not use `security definer` functions unless necessary; if one is added, document and secure its privileges and search path.
- Return a neutral denial state in the UI; do not reveal another organization's task details.

## 9. Interface outline

### Signed-out screen

- Demo name and one-sentence purpose.
- Sign-in form.
- Link to a short “How the security demo works” explanation.

### Workspace screen

- Header with app name, active organization, user identity, and sign-out.
- Summary cards: open tasks, completed tasks, total tasks.
- Task list with status filter and create-task action.
- Task form in a dialog or inline panel.
- Security demo panel, visually distinct from normal task management.

### Security demo panel

- Plain-language explanation of tenant isolation.
- Button to run the cross-tenant check.
- Result state: not run, blocked as expected, or unexpected result.
- Show the tested task's opaque ID only if useful; never display its title or description to the unauthorized user.
- Link or expandable area summarizing the relevant RLS policy.

## 10. Technical approach

- **Frontend:** Next.js App Router, React, TypeScript, Tailwind CSS.
- **Backend:** Supabase Auth and Postgres; direct client access with RLS for the demo.
- **Hosting:** Vercel deployment using the Next.js framework preset.
- **Configuration:** Next.js public client variables (`NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`) for the Supabase project URL and anon/publishable key. These are public client configuration and must be protected by RLS. Never configure the service-role key in client-exposed variables.
- **Database setup:** checked-in SQL migration(s) for tables, indexes, constraints, grants, and policies; seed fictional organizations and tasks through a documented trusted setup step.

## 11. Acceptance criteria

- A reviewer can sign in to each demo account and see only its authorized workspace data.
- Company A's user cannot retrieve Company B's task through the app's security check or a direct authenticated query.
- Company A's user cannot insert a task into Company B, change a task's `organization_id` to Company B, or mutate Company B's task.
- Signed-out requests cannot read or mutate tenant data.
- Normal authorized create, edit, completion, and delete actions work for the signed-in user's organization.
- Memberships cannot be added or changed from the browser client.
- The interface handles empty, loading, and denied/error states clearly.
- The deployed Vercel app works with the configured Supabase project and no privileged secret is present in the client bundle.
- README gives a reviewer enough information to understand and reproduce the demo.

## 12. Delivery plan

1. **Project foundation:** scaffold app, configure Tailwind, routing, Supabase client, environment variable example, and Vercel deployment.
2. **Database and access rules:** add migrations, seed fictional data, enable RLS, configure grants and operation-specific policies.
3. **Authentication and workspace UI:** implement sign-in/out, membership loading, organization view, task list, and task CRUD.
4. **Isolation demonstration:** add the security panel and a cross-tenant check using the authenticated client.
5. **Documentation and release polish:** write setup/deployment instructions, provide safe demo-account guidance, refine responsive and error states, then deploy the public demo.

## 13. Demo safety and maintenance notes

- Use synthetic data and accounts created specifically for the demo.
- If demo credentials are publicly available, avoid putting real or confidential information in those accounts; consider resetting seeded data periodically or making the public demo read-only.
- Keep migrations as the source of truth for schema and policies.
- Review policies whenever a table, relationship, or client operation is added.
- The project demonstrates a focused RLS pattern; it is not a complete security audit or a claim of production readiness.
