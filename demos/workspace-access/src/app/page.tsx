'use client'

import { useEffect, useState, type FormEvent } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { hasSupabaseConfig, supabase } from '../supabase'

type Organization = { id: string; name: string }

export default function HomePage() {
  const [session, setSession] = useState<Session | null>(null)
  const [authReady, setAuthReady] = useState(false)
  const [authBusy, setAuthBusy] = useState(false)
  const [authMessage, setAuthMessage] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [selectedOrganizationId, setSelectedOrganizationId] = useState('')
  const [organizationsLoading, setOrganizationsLoading] = useState(false)
  const [organizationsError, setOrganizationsError] = useState(false)

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true)
      return
    }

    let mounted = true
    let authEventReceived = false
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nextSession) => {
      authEventReceived = true
      setSession(nextSession)
      setAuthReady(true)
      if (event === 'SIGNED_OUT') {
        setOrganizations([])
        setSelectedOrganizationId('')
        setAuthMessage('You have been signed out.')
      }
    })

    void supabase.auth.getSession().then(({ data, error }) => {
      if (!mounted || authEventReceived) return
      if (error) setAuthMessage('Your session could not be restored. Sign in again to continue.')
      setSession(error ? null : data.session)
      setAuthReady(true)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!supabase || !session?.user) {
      setOrganizations([])
      setSelectedOrganizationId('')
      setOrganizationsError(false)
      setOrganizationsLoading(false)
      return
    }

    let cancelled = false
    const loadOrganizations = async () => {
      setOrganizationsLoading(true)
      setOrganizationsError(false)
      const { data: memberships, error: membershipError } = await supabase
        .from('memberships')
        .select('organization_id')
        .eq('user_id', session.user.id)

      if (cancelled) return
      if (membershipError) {
        setOrganizationsError(true)
        setOrganizations([])
        setSelectedOrganizationId('')
        setOrganizationsLoading(false)
        return
      }

      const organizationIds = [...new Set((memberships ?? []).map((row) => row.organization_id))]
      if (organizationIds.length === 0) {
        setOrganizations([])
        setSelectedOrganizationId('')
        setOrganizationsLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('organizations')
        .select('id, name')
        .in('id', organizationIds)
        .order('name')

      if (cancelled) return
      if (error) {
        setOrganizationsError(true)
        setOrganizations([])
        setSelectedOrganizationId('')
      } else {
        const accessibleOrganizations = data ?? []
        setOrganizations(accessibleOrganizations)
        setSelectedOrganizationId((current) =>
          accessibleOrganizations.some((organization) => organization.id === current)
            ? current
            : accessibleOrganizations[0]?.id ?? '',
        )
      }
      setOrganizationsLoading(false)
    }

    void loadOrganizations()
    return () => { cancelled = true }
  }, [session?.user.id])

  const signIn = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase) return
    setAuthBusy(true)
    setAuthMessage('')
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (error) {
      setAuthMessage('Sign-in failed. Check the email and password, then try again.')
    } else {
      setPassword('')
    }
    setAuthBusy(false)
  }

  const signOut = async () => {
    if (!supabase) return
    const { error } = await supabase.auth.signOut()
    if (error) setAuthMessage('Could not sign out. Please try again.')
  }

  if (!hasSupabaseConfig) return <ConfigurationNotice />
  if (!authReady) return <PageFrame><div className="panel loading-card" role="status">Restoring your session…</div></PageFrame>

  if (!session) {
    return (
      <PageFrame>
        <section className="auth-layout">
          <div className="auth-intro">
            <p className="eyebrow">Multi-tenant access control</p>
            <h1 className="auth-hero-title">One workspace.<br /><span>Your data only.</span></h1>
            <p className="body-copy auth-description">A task dashboard that demonstrates organization-level access control. Your session reaches the database directly, where Row Level Security decides which rows you can access.</p>
            <div className="assurance-note"><span className="assurance-icon" aria-hidden="true">✓</span><span>Tenant access is enforced by PostgreSQL policies, not by hiding rows in the interface.</span></div>
          </div>
          <form className="panel auth-card" onSubmit={signIn}>
            <p className="eyebrow">Welcome back</p>
            <h2 className="auth-title">Sign in to your workspace</h2>
            <p className="small-note">Use a demo account provisioned for this project. New accounts need an organization membership from a project administrator.</p>
            <label className="field-label" htmlFor="email">Email address</label>
            <input className="field" id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
            <label className="field-label field-label-spaced" htmlFor="password">Password</label>
            <input className="field" id="password" name="password" type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            {authMessage && <p className="notice notice-error" role="alert">{authMessage}</p>}
            <button className="button-primary full-width" type="submit" disabled={authBusy}>{authBusy ? 'Signing in…' : 'Sign in'}</button>
            <p className="form-footnote">Your account only sees organizations where it has a membership.</p>
          </form>
        </section>
        <Footer />
      </PageFrame>
    )
  }

  return (
    <PageFrame>
      <section className="workspace-welcome">
        <div><p className="eyebrow">Your private workspace</p><h1 className="workspace-title">Good work starts here.</h1></div>
        <div className="identity-card">
          <div className="identity-copy"><span className="identity-label">Signed in as</span><strong title={session.user.email ?? ''}>{session.user.email ?? 'Workspace member'}</strong></div>
          <button className="button-secondary" type="button" onClick={signOut}>Sign out</button>
        </div>
      </section>

      {organizationsLoading && <div className="panel loading-card" role="status">Loading your organizations…</div>}
      {organizationsError && <div className="panel empty-panel" role="alert"><p className="eyebrow">Workspace unavailable</p><h2>We couldn’t load your organization access.</h2><p className="body-copy">Refresh the page and try again. If the issue continues, check the Supabase project setup.</p></div>}
      {!organizationsLoading && !organizationsError && organizations.length === 0 && (
        <div className="panel empty-panel"><span className="empty-icon" aria-hidden="true">↗</span><p className="eyebrow">No workspace membership</p><h2>This account isn’t connected to an organization yet.</h2><p className="body-copy">A project administrator must provision the membership through the trusted Supabase setup path. Memberships can’t be created from this app.</p></div>
      )}
      {!organizationsLoading && !organizationsError && organizations.length > 0 && (
        <OrganizationWorkspace
          organizations={organizations}
          selectedOrganizationId={selectedOrganizationId}
          user={session.user}
          onSelectOrganization={setSelectedOrganizationId}
        />
      )}
      <Footer />
    </PageFrame>
  )
}

function OrganizationWorkspace({
  organizations, selectedOrganizationId, user, onSelectOrganization,
}: {
  organizations: Organization[]
  selectedOrganizationId: string
  user: User
  onSelectOrganization: (id: string) => void
}) {
  const activeOrganization = organizations.find((organization) => organization.id === selectedOrganizationId)
  return (
    <>
      <section className="workspace-toolbar" aria-label="Active organization">
        <div className="organization-context">
          <span className="organization-monogram" aria-hidden="true">{activeOrganization?.name.slice(0, 1).toUpperCase() ?? 'W'}</span>
          <div>
            <span className="identity-label">Active organization</span>
            {organizations.length > 1 ? (
              <>
                <label className="sr-only" htmlFor="organization">Choose an organization</label>
                <select className="organization-select" id="organization" value={selectedOrganizationId} onChange={(event) => onSelectOrganization(event.target.value)}>
                  {organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
                </select>
              </>
            ) : <strong className="organization-name">{activeOrganization?.name}</strong>}
          </div>
        </div>
        <span className="status-pill"><span className="status-dot" />Database protected</span>
      </section>
      <section className="panel empty-panel">
        <p className="eyebrow">Authenticated workspace</p>
        <h2>Welcome, {user.email ?? 'workspace member'}.</h2>
        <p className="body-copy">Your organization access is loaded through your signed-in Supabase session. Task management is the next implementation phase.</p>
      </section>
    </>
  )
}

function ConfigurationNotice() {
  return <PageFrame><section className="panel auth-card"><p className="eyebrow">Setup required</p><h1 className="auth-title">Connect the demo workspace.</h1><p className="body-copy">Add your Supabase project URL and anon or publishable key to <code>.env.local</code>, then restart the development server.</p><p className="small-note">Use the values in Supabase project settings. Keep service-role keys out of browser configuration.</p></section></PageFrame>
}

function PageFrame({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-page">
      <div className="workspace-container">
        <header className="app-header">
          <a className="wordmark" href="/" aria-label="Workspace Access home"><span className="wordmark-mark" aria-hidden="true">W</span><span>workspace<span className="text-ink-muted">/access</span></span></a>
          <span className="eyebrow header-note">Security playground · Tenant isolation</span>
        </header>
        {children}
      </div>
    </main>
  )
}

function Footer() {
  return <footer className="app-footer"><span>Fictional data only · Not for production use</span><span>Supabase Auth + PostgreSQL RLS</span></footer>
}
