export default function HomePage() {
  return (
    <main className="min-h-screen px-5 py-10 sm:px-8 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between">
          <a className="wordmark" href="/" aria-label="Workspace Access home">
            <span className="wordmark-mark" aria-hidden="true">W</span>
            <span>workspace<span className="text-ink-muted">/access</span></span>
          </a>
          <span className="eyebrow">Security playground · Tenant isolation</span>
        </header>
        <section className="mt-16 items-end gap-12 md:mt-24 md:grid md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="eyebrow mb-5">Multi-tenant access control</p>
            <h1 className="max-w-3xl text-5xl font-medium leading-[1.04] tracking-[-0.055em] sm:text-7xl">
              One workspace.<br />
              <span className="text-ink-muted">Your data only.</span>
            </h1>
            <p className="mt-7 max-w-xl text-lg leading-8 text-ink-muted">
              A task dashboard that demonstrates organization-level access control, enforced by database policies.
            </p>
          </div>
          <aside className="panel mt-10 p-6 sm:p-8 md:mt-0">
            <p className="eyebrow">Workspace setup</p>
            <h2 className="mt-5 text-2xl font-medium tracking-tight">Supabase-backed workspaces.</h2>
            <p className="mt-3 text-sm leading-6 text-ink-muted">
              Sign-in, organization membership, and tenant-scoped tasks are part of this demo.
            </p>
            <span className="status-pill mt-6"><span className="status-dot" />Next.js App Router</span>
          </aside>
        </section>
        <footer className="mt-20 flex flex-col gap-3 border-t border-line pt-5 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <span>Built to demonstrate PostgreSQL Row Level Security.</span>
          <span>Fictional data only · Not for production use</span>
        </footer>
      </div>
    </main>
  )
}
