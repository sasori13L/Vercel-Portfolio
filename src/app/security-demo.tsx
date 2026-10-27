'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../supabase'

type CheckState =
  | { kind: 'idle' }
  | { kind: 'blocked' }
  | { kind: 'failure'; reason: 'row-returned' | 'request-error' }

type TestCase = {
  organizationId: string
  organizationName: string
  taskId: string
}

const foreignTaskByOrganization: Record<string, TestCase> = {
  '10000000-0000-4000-8000-000000000001': {
    organizationId: '10000000-0000-4000-8000-000000000002',
    organizationName: 'Cedar Works',
    taskId: '20000000-0000-4000-8000-000000000003',
  },
  '10000000-0000-4000-8000-000000000002': {
    organizationId: '10000000-0000-4000-8000-000000000001',
    organizationName: 'Northstar Studio',
    taskId: '20000000-0000-4000-8000-000000000001',
  },
}

export default function SecurityDemo({
  organizationId,
  organizationIds,
  userId,
}: {
  organizationId: string
  organizationIds: string[]
  userId: string
}) {
  const [state, setState] = useState<CheckState>({ kind: 'idle' })
  const [checking, setChecking] = useState(false)
  const requestId = useRef(0)
  const candidate = foreignTaskByOrganization[organizationId]
  const testCase = candidate && !organizationIds.includes(candidate.organizationId) ? candidate : null
  const membershipKey = organizationIds.join('|')

  useEffect(() => {
    requestId.current += 1
    setState({ kind: 'idle' })
    setChecking(false)
  }, [organizationId, userId, membershipKey])

  const runCheck = async () => {
    if (!supabase || !testCase || checking) return
    const thisRequest = ++requestId.current
    setChecking(true)
    setState({ kind: 'idle' })

    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('id')
        .eq('id', testCase.taskId)
        .maybeSingle()

      if (thisRequest !== requestId.current) return
      if (error) {
        setState({ kind: 'failure', reason: 'request-error' })
      } else if (data) {
        // Keep the result boolean-only. Never retain or render protected task content.
        setState({ kind: 'failure', reason: 'row-returned' })
      } else {
        setState({ kind: 'blocked' })
      }
    } catch {
      if (thisRequest !== requestId.current) return
      setState({ kind: 'failure', reason: 'request-error' })
    } finally {
      if (thisRequest === requestId.current) setChecking(false)
    }
  }

  const result = checking
    ? {
        className: 'security-result security-result-idle',
        label: 'Checking',
        heading: 'Request in progress.',
        detail: 'The authenticated client is querying the known foreign task ID.',
      }
    : state.kind === 'idle'
    ? {
        className: 'security-result security-result-idle',
        label: 'Not run',
        heading: 'Check not run yet.',
        detail: 'The check requests a known sample task from another organization using your current signed-in session.',
      }
    : state.kind === 'blocked'
      ? {
          className: 'security-result security-result-blocked',
          label: 'Blocked as expected',
          heading: 'No task was accessible.',
          detail: 'The database returned no row for the seeded foreign task ID. This is consistent with the organization membership policy.',
        }
      : state.reason === 'row-returned'
        ? {
            className: 'security-result security-result-failure',
            label: 'Unexpected access',
            heading: 'The database returned a restricted row.',
            detail: 'Treat this as an RLS failure and review the task policies. Protected task details were not displayed.',
          }
        : {
            className: 'security-result security-result-failure',
            label: 'Could not verify',
            heading: 'The isolation check did not complete.',
            detail: 'A request error is not a passing result. Check the Supabase configuration and database policies, then try again.',
          }

  return (
    <section className="security-demo panel" aria-labelledby="security-demo-title">
      <div className="security-demo-header">
        <div>
          <p className="eyebrow">Security demo</p>
          <h2 id="security-demo-title">Can this session reach another workspace?</h2>
          <p className="body-copy">This sends a direct request for a known sample task in {candidate?.organizationName ?? 'the other sample organization'}. PostgreSQL RLS decides whether the row is visible.</p>
        </div>
        <span className="security-demo-mark" aria-hidden="true">RLS</span>
      </div>

      {testCase ? (
        <button className="button-secondary security-check-button" type="button" onClick={() => void runCheck()} disabled={checking}>
          {checking ? 'Checking database…' : state.kind === 'idle' ? 'Run isolation check' : 'Run check again'}
        </button>
      ) : (
        <p className="security-unavailable" role="note">
          This check uses the two seeded sample organizations. It is unavailable when your account can already access the other sample organization or belongs to a different organization.
        </p>
      )}

      <div className={result.className} role="status" aria-live="polite" aria-atomic="true">
        <span className="security-result-label">{result.label}</span>
        <div><strong>{result.heading}</strong><p>{result.detail}</p></div>
      </div>

      <details className="security-policy-details">
        <summary>What does the database check?</summary>
        <p>The task SELECT policy requires a membership whose organization ID matches the task and whose user ID matches <code>auth.uid()</code>. Frontend filtering helps organize the screen; the database policy is the access control.</p>
      </details>
      <p className="security-seed-note">This result assumes the sample data from <code>supabase/seed-demo-data.sql</code> is present.</p>
    </section>
  )
}
