'use client'

import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import type { TaskStatus } from '../database.types'
import { hasSupabaseConfig, supabase } from '../supabase'

type Organization = { id: string; name: string }
type Task = {
  id: string
  organization_id: string
  title: string
  description: string
  status: TaskStatus
  created_at: string
}
type Filter = 'all' | TaskStatus

const dateFormatter = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' })

function App() {
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
  const [tasks, setTasks] = useState<Task[]>([])
  const [tasksLoading, setTasksLoading] = useState(false)
  const [tasksError, setTasksError] = useState(false)
  const [taskMessage, setTaskMessage] = useState('')
  const [taskErrorMessage, setTaskErrorMessage] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [formOpen, setFormOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [taskBusyId, setTaskBusyId] = useState('')
  const [savingTask, setSavingTask] = useState(false)
  const [taskRevision, setTaskRevision] = useState(0)
  const taskRequest = useRef(0)

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
        taskRequest.current += 1
        setOrganizations([])
        setSelectedOrganizationId('')
        setTasks([])
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

  const selectedOrganization = organizations.find((organization) => organization.id === selectedOrganizationId)

  const loadTasks = useCallback(async () => {
    const requestNumber = ++taskRequest.current
    if (!supabase || !session?.user || !selectedOrganizationId) {
      setTasks([])
      setTasksLoading(false)
      setTasksError(false)
      return
    }

    setTasksLoading(true)
    setTasksError(false)
    const { data, error } = await supabase
      .from('tasks')
      .select('id, organization_id, title, description, status, created_at')
      .eq('organization_id', selectedOrganizationId)
      .order('created_at', { ascending: false })

    if (requestNumber !== taskRequest.current) return
    if (error) {
      setTasks([])
      setTasksError(true)
    } else {
      setTasks(data ?? [])
    }
    setTasksLoading(false)
  }, [session?.user.id, selectedOrganizationId])

  useEffect(() => {
    void loadTasks()
  }, [loadTasks, taskRevision])

  useEffect(() => {
    setTasks([])
    setTaskMessage('')
    setTaskErrorMessage('')
    setFormOpen(false)
    setEditingTask(null)
    setTitle('')
    setDescription('')
  }, [selectedOrganizationId])

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

  const startCreate = () => {
    setEditingTask(null)
    setTitle('')
    setDescription('')
    setTaskMessage('')
    setTaskErrorMessage('')
    setFormOpen(true)
  }

  const startEdit = (task: Task) => {
    setEditingTask(task)
    setTitle(task.title)
    setDescription(task.description)
    setTaskMessage('')
    setTaskErrorMessage('')
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingTask(null)
    setTitle('')
    setDescription('')
    setTaskErrorMessage('')
  }

  const saveTask = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!supabase || !selectedOrganization || !session?.user) return
    const cleanTitle = title.trim()
    const cleanDescription = description.trim()
    if (!cleanTitle) {
      setTaskErrorMessage('Add a title before saving.')
      return
    }

    setSavingTask(true)
    setTaskErrorMessage('')
    setTaskMessage('')
    const result = editingTask
      ? await supabase.from('tasks').update({ title: cleanTitle, description: cleanDescription }).eq('id', editingTask.id).select('id').single()
      : await supabase.from('tasks').insert({
          organization_id: selectedOrganization.id,
          title: cleanTitle,
          description: cleanDescription,
          status: 'open',
        }).select('id').single()

    if (result.error) {
      setTaskErrorMessage('The task could not be saved. Refresh the workspace and try again.')
    } else {
      setTaskMessage(editingTask ? 'Task updated.' : 'Task created.')
      closeForm()
      setTaskRevision((revision) => revision + 1)
    }
    setSavingTask(false)
  }

  const changeTaskStatus = async (task: Task) => {
    if (!supabase) return
    setTaskBusyId(task.id)
    setTaskErrorMessage('')
    setTaskMessage('')
    const nextStatus: TaskStatus = task.status === 'open' ? 'complete' : 'open'
    const { error } = await supabase.from('tasks').update({ status: nextStatus }).eq('id', task.id).select('id').single()
    if (error) {
      setTaskErrorMessage('That task could not be updated. Refresh the workspace and try again.')
    } else {
      setTaskMessage(nextStatus === 'complete' ? 'Task marked complete.' : 'Task reopened.')
      setTaskRevision((revision) => revision + 1)
    }
    setTaskBusyId('')
  }

  const deleteTask = async (task: Task) => {
    if (!supabase || !window.confirm(`Delete “${task.title}”? This cannot be undone.`)) return
    setTaskBusyId(task.id)
    setTaskErrorMessage('')
    setTaskMessage('')
    const { error } = await supabase.from('tasks').delete().eq('id', task.id)
    if (error) {
      setTaskErrorMessage('That task could not be deleted. Refresh the workspace and try again.')
    } else {
      setTaskMessage('Task deleted.')
      setTaskRevision((revision) => revision + 1)
    }
    setTaskBusyId('')
  }

  if (!hasSupabaseConfig) return <ConfigurationNotice />
  if (!authReady) return <CenteredState label="Restoring your session…" />
  if (!session) {
    return (
      <SignInScreen
        email={email}
        password={password}
        busy={authBusy}
        message={authMessage}
        setEmail={setEmail}
        setPassword={setPassword}
        onSubmit={signIn}
      />
    )
  }

  return (
    <WorkspaceScreen
      user={session.user}
      organizations={organizations}
      selectedOrganization={selectedOrganization}
      selectedOrganizationId={selectedOrganizationId}
      onSelectOrganization={setSelectedOrganizationId}
      organizationsLoading={organizationsLoading}
      organizationsError={organizationsError}
      tasks={tasks}
      tasksLoading={tasksLoading}
      tasksError={tasksError}
      filter={filter}
      setFilter={setFilter}
      visibleTasks={tasks.filter((task) => filter === 'all' || task.status === filter)}
      message={taskMessage}
      errorMessage={taskErrorMessage}
      taskBusyId={taskBusyId}
      formOpen={formOpen}
      editingTask={editingTask}
      title={title}
      description={description}
      savingTask={savingTask}
      setTitle={setTitle}
      setDescription={setDescription}
      onSignOut={signOut}
      onRetryTasks={() => { void loadTasks() }}
      onCreate={startCreate}
      onEdit={startEdit}
      onCloseForm={closeForm}
      onSaveTask={saveTask}
      onChangeStatus={changeTaskStatus}
      onDeleteTask={deleteTask}
    />
  )
}

function ConfigurationNotice() {
  return (
    <main className="auth-page">
      <BrandHeader />
      <section className="panel auth-card" aria-labelledby="config-heading">
        <p className="eyebrow">Setup required</p>
        <h1 id="config-heading" className="auth-title">Connect the demo workspace.</h1>
        <p className="body-copy">Add your Supabase project URL and anon or publishable key to <code>.env</code>, then restart the development server.</p>
        <p className="small-note">Use the values in Supabase project settings. Keep service-role keys out of browser configuration.</p>
      </section>
    </main>
  )
}

function CenteredState({ label }: { label: string }) {
  return <main className="auth-page"><BrandHeader /><div className="panel loading-card" role="status">{label}</div></main>
}

function BrandHeader() {
  return (
    <header className="app-header">
      <a className="wordmark" href="/" aria-label="Workspace Access home">
        <span className="wordmark-mark" aria-hidden="true">W</span>
        <span>workspace<span className="text-ink-muted">/access</span></span>
      </a>
      <span className="eyebrow header-note">Security playground · Tenant isolation</span>
    </header>
  )
}

function SignInScreen({
  email, password, busy, message, setEmail, setPassword, onSubmit,
}: {
  email: string
  password: string
  busy: boolean
  message: string
  setEmail: (value: string) => void
  setPassword: (value: string) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}) {
  return (
    <main className="auth-page">
      <BrandHeader />
      <section className="auth-layout">
        <div className="auth-intro">
          <p className="eyebrow">Multi-tenant access control</p>
          <h1 className="auth-hero-title">One workspace.<br /><span>Your data only.</span></h1>
          <p className="body-copy auth-description">A task dashboard that demonstrates organization-level access control. Your session reaches the database directly, where Row Level Security decides which rows you can access.</p>
          <div className="assurance-note"><span className="assurance-icon" aria-hidden="true">✓</span><span>Tenant access is enforced by PostgreSQL policies, not by hiding rows in the interface.</span></div>
        </div>
        <form className="panel auth-card" onSubmit={onSubmit}>
          <p className="eyebrow">Welcome back</p>
          <h2 className="auth-title">Sign in to your workspace</h2>
          <p className="small-note">Use a demo account provisioned for this project. New accounts need an organization membership from a project administrator.</p>
          <label className="field-label" htmlFor="email">Email address</label>
          <input className="field" id="email" name="email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} />
          <label className="field-label field-label-spaced" htmlFor="password">Password</label>
          <input className="field" id="password" name="password" type="password" autoComplete="current-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
          {message && <p className="notice notice-error" role="alert">{message}</p>}
          <button className="button-primary full-width" type="submit" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
          <p className="form-footnote">Your account only sees organizations where it has a membership.</p>
        </form>
      </section>
      <Footer />
    </main>
  )
}

function WorkspaceScreen(props: {
  user: User
  organizations: Organization[]
  selectedOrganization?: Organization
  selectedOrganizationId: string
  onSelectOrganization: (id: string) => void
  organizationsLoading: boolean
  organizationsError: boolean
  tasks: Task[]
  tasksLoading: boolean
  tasksError: boolean
  filter: Filter
  setFilter: (filter: Filter) => void
  visibleTasks: Task[]
  message: string
  errorMessage: string
  taskBusyId: string
  formOpen: boolean
  editingTask: Task | null
  title: string
  description: string
  savingTask: boolean
  setTitle: (value: string) => void
  setDescription: (value: string) => void
  onSignOut: () => void
  onRetryTasks: () => void
  onCreate: () => void
  onEdit: (task: Task) => void
  onCloseForm: () => void
  onSaveTask: (event: FormEvent<HTMLFormElement>) => void
  onChangeStatus: (task: Task) => void
  onDeleteTask: (task: Task) => void
}) {
  const openCount = props.tasks.filter((task) => task.status === 'open').length
  const completeCount = props.tasks.filter((task) => task.status === 'complete').length
  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: 'All tasks' },
    { value: 'open', label: 'Open' },
    { value: 'complete', label: 'Complete' },
  ]

  return (
    <main className="workspace-page">
      <div className="workspace-container">
        <BrandHeader />
        <section className="workspace-welcome">
          <div>
            <p className="eyebrow">Your private workspace</p>
            <h1 className="workspace-title">Good work starts here.</h1>
          </div>
          <div className="identity-card">
            <div className="identity-copy"><span className="identity-label">Signed in as</span><strong title={props.user.email ?? ''}>{props.user.email ?? 'Workspace member'}</strong></div>
            <button className="button-secondary" type="button" onClick={props.onSignOut}>Sign out</button>
          </div>
        </section>

        {props.organizationsLoading ? <div className="panel loading-card" role="status">Loading your organizations…</div> : null}
        {props.organizationsError ? (
          <div className="panel empty-panel" role="alert">
            <p className="eyebrow">Workspace unavailable</p>
            <h2>We couldn’t load your organization access.</h2>
            <p className="body-copy">Refresh the page and try again. If the issue continues, check the Supabase project setup.</p>
          </div>
        ) : null}
        {!props.organizationsLoading && !props.organizationsError && props.organizations.length === 0 ? (
          <div className="panel empty-panel">
            <span className="empty-icon" aria-hidden="true">↗</span>
            <p className="eyebrow">No workspace membership</p>
            <h2>This account isn’t connected to an organization yet.</h2>
            <p className="body-copy">A project administrator must provision the membership through the trusted Supabase setup path. Memberships can’t be created from this app.</p>
          </div>
        ) : null}

        {props.selectedOrganization && !props.organizationsLoading && !props.organizationsError ? (
          <>
            <section className="workspace-toolbar" aria-label="Active organization">
              <div className="organization-context">
                <span className="organization-monogram" aria-hidden="true">{props.selectedOrganization.name.slice(0, 1).toUpperCase()}</span>
                <div>
                  <span className="identity-label">Active organization</span>
                  {props.organizations.length > 1 ? (
                    <label className="sr-only" htmlFor="organization">Choose an organization</label>
                  ) : null}
                  {props.organizations.length > 1 ? (
                    <select className="organization-select" id="organization" value={props.selectedOrganizationId} onChange={(event) => props.onSelectOrganization(event.target.value)}>
                      {props.organizations.map((organization) => <option key={organization.id} value={organization.id}>{organization.name}</option>)}
                    </select>
                  ) : <strong className="organization-name">{props.selectedOrganization.name}</strong>}
                </div>
              </div>
              <span className="status-pill"><span className="status-dot" />Database protected</span>
            </section>

            <section className="summary-grid" aria-label="Task summary">
              <SummaryCard label="Open tasks" value={props.tasksLoading || props.tasksError ? '—' : openCount} tone="open" />
              <SummaryCard label="Completed" value={props.tasksLoading || props.tasksError ? '—' : completeCount} tone="complete" />
              <SummaryCard label="Total tasks" value={props.tasksLoading || props.tasksError ? '—' : props.tasks.length} tone="total" />
            </section>

            <section className="task-section" aria-labelledby="tasks-heading">
              <div className="task-section-head">
                <div>
                  <p className="eyebrow">Organization board</p>
                  <h2 id="tasks-heading" className="section-title">Tasks <span className="count-badge">{props.tasks.length}</span></h2>
                </div>
                {!props.formOpen && <button className="button-primary" type="button" onClick={props.onCreate}><span className="plus-sign" aria-hidden="true">+</span> New task</button>}
              </div>

              {props.formOpen ? (
                <form className="panel task-form" onSubmit={props.onSaveTask}>
                  <div className="task-form-heading">
                    <div>
                      <p className="eyebrow">{props.editingTask ? 'Edit task' : 'New task'}</p>
                      <h3>{props.editingTask ? 'Update the task details.' : 'What needs to get done?'}</h3>
                    </div>
                    <button className="icon-button" type="button" aria-label="Close task form" onClick={props.onCloseForm}>×</button>
                  </div>
                  <label className="field-label" htmlFor="task-title">Title <span aria-hidden="true">*</span></label>
                  <input className="field" id="task-title" name="title" autoFocus maxLength={120} required value={props.title} onChange={(event) => props.setTitle(event.target.value)} placeholder="e.g. Prepare the project brief" />
                  <label className="field-label field-label-spaced" htmlFor="task-description">Description <span className="optional-label">Optional</span></label>
                  <textarea className="field field-textarea" id="task-description" name="description" maxLength={1000} rows={3} value={props.description} onChange={(event) => props.setDescription(event.target.value)} placeholder="Add a few details to help your team." />
                  {props.errorMessage && <p className="notice notice-error" role="alert">{props.errorMessage}</p>}
                  <div className="form-actions"><button className="button-secondary" type="button" onClick={props.onCloseForm}>Cancel</button><button className="button-primary" type="submit" disabled={props.savingTask}>{props.savingTask ? 'Saving…' : props.editingTask ? 'Save changes' : 'Create task'}</button></div>
                </form>
              ) : null}

              {props.message && <p className="notice notice-success" role="status">{props.message}</p>}
              {!props.formOpen && props.errorMessage && <p className="notice notice-error" role="alert">{props.errorMessage}</p>}

              <div className="task-list-panel panel">
                <div className="task-list-toolbar">
                  <div className="filter-tabs" role="group" aria-label="Filter tasks">
                    {filters.map((item) => <button className={`filter-tab ${props.filter === item.value ? 'filter-tab-active' : ''}`} key={item.value} type="button" aria-pressed={props.filter === item.value} onClick={() => props.setFilter(item.value)}>{item.label}</button>)}
                  </div>
                  <span className="result-count">{props.visibleTasks.length} shown</span>
                </div>
                {props.tasksLoading ? <div className="list-state" role="status"><span className="loading-indicator" />Loading authorized tasks…</div> : null}
                {!props.tasksLoading && props.tasksError ? (
                  <div className="list-state"><p>We couldn’t load tasks for this workspace.</p><button className="button-secondary" type="button" onClick={props.onRetryTasks}>Try again</button></div>
                ) : null}
                {!props.tasksLoading && !props.tasksError && props.visibleTasks.length === 0 ? (
                  <div className="list-state empty-list">
                    <span className="empty-icon" aria-hidden="true">✳</span>
                    <h3>{props.tasks.length === 0 ? 'A clear page to start from.' : 'No tasks match this filter.'}</h3>
                    <p>{props.tasks.length === 0 ? 'Create a task for this organization. RLS will check access when it reaches the database.' : 'Choose a different status filter to see more tasks.'}</p>
                    {props.tasks.length === 0 && <button className="button-secondary" type="button" onClick={props.onCreate}>Create your first task</button>}
                  </div>
                ) : null}
                {!props.tasksLoading && !props.tasksError && props.visibleTasks.length > 0 ? (
                  <ul className="task-list">
                    {props.visibleTasks.map((task) => (
                      <li className={`task-item ${task.status === 'complete' ? 'task-item-complete' : ''}`} key={task.id}>
                        <button className={`completion-toggle ${task.status === 'complete' ? 'completion-toggle-checked' : ''}`} type="button" aria-label={task.status === 'open' ? `Mark ${task.title} complete` : `Reopen ${task.title}`} disabled={props.taskBusyId === task.id} onClick={() => props.onChangeStatus(task)}>{task.status === 'complete' ? '✓' : ''}</button>
                        <div className="task-content">
                          <div className="task-title-line"><h3>{task.title}</h3><span className={`task-status task-status-${task.status}`}>{task.status === 'open' ? 'Open' : 'Complete'}</span></div>
                          {task.description && <p className="task-description">{task.description}</p>}
                          <span className="task-date">Added {dateFormatter.format(new Date(task.created_at))}</span>
                        </div>
                        <div className="task-actions">
                          <button className="text-action" type="button" disabled={props.taskBusyId === task.id} onClick={() => props.onEdit(task)}>Edit</button>
                          <button className="text-action text-action-danger" type="button" disabled={props.taskBusyId === task.id} onClick={() => props.onDeleteTask(task)}>Delete</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </section>
            <section className="security-note" aria-label="Data access note">
              <span className="security-lock" aria-hidden="true">⌑</span>
              <div><strong>Scoped by your membership.</strong><span>Organization data is filtered and protected by PostgreSQL Row Level Security.</span></div>
            </section>
          </>
        ) : null}
        <Footer />
      </div>
    </main>
  )
}

function SummaryCard({ label, value, tone }: { label: string; value: number | string; tone: string }) {
  return <article className="panel summary-card"><div className={`summary-icon summary-icon-${tone}`} aria-hidden="true">{tone === 'open' ? '◷' : tone === 'complete' ? '✓' : '▤'}</div><p>{label}</p><strong>{typeof value === 'number' ? value.toString().padStart(2, '0') : value}</strong></article>
}

function Footer() {
  return <footer className="app-footer"><span>Fictional data only · Not for production use</span><span>Supabase Auth + PostgreSQL RLS</span></footer>
}

export default App
