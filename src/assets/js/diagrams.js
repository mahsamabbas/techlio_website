/* Diagram definitions for pipeline.js.
   Each diagram: columns of nodes, directed edges, per-node detail, and scenarios that walk a path through the nodes.
   Step state: 'ok' (default), 'review', 'blocked', 'verified'. */
window.TL_DIAGRAMS = {
  /* Home hero: an AI agent handling a request in production */
  agent: {
    title: 'An agent request, traced end to end',
    columns: [
      { label: 'Sources', nodes: [
        { id: 'request', label: 'User request', sub: 'chat, email, API' },
        { id: 'kb', label: 'Knowledge base', sub: 'docs, tickets, wiki' },
        { id: 'sor', label: 'Systems of record', sub: 'CRM, ERP, billing' },
      ] },
      { label: 'Context', nodes: [
        { id: 'tenant', label: 'Tenant scope', sub: 'identity, permissions' },
        { id: 'retrieval', label: 'Retrieval', sub: 'hybrid search, rerank' },
      ] },
      { label: 'Reasoning', nodes: [
        { id: 'orchestrator', label: 'Orchestrator', sub: 'plans steps' },
        { id: 'tools', label: 'Tools', sub: 'typed, permissioned' },
      ] },
      { label: 'Control', nodes: [
        { id: 'guardrails', label: 'Guardrails', sub: 'policy, PII, schema' },
        { id: 'confidence', label: 'Confidence check', sub: 'threshold from evals' },
        { id: 'human', label: 'Human review', sub: 'approve, edit, reject' },
      ] },
      { label: 'Outcome', nodes: [
        { id: 'action', label: 'Verified action', sub: 'written back' },
        { id: 'audit', label: 'Audit trail', sub: 'one trace per decision' },
      ] },
    ],
    edges: [
      ['request', 'tenant'], ['tenant', 'retrieval'], ['kb', 'retrieval'], ['sor', 'retrieval'],
      ['retrieval', 'orchestrator'], ['orchestrator', 'tools'], ['orchestrator', 'guardrails'], ['tools', 'guardrails'],
      ['guardrails', 'confidence'], ['confidence', 'human'], ['confidence', 'action'], ['human', 'action'],
      ['guardrails', 'audit'], ['action', 'audit'],
    ],
    details: {
      request: { title: 'User request', body: 'Every request enters through one authenticated gateway, whatever the channel.', points: ['Rate limits and abuse checks at the edge', 'Each request gets a trace ID that follows it to the audit trail'] },
      kb: { title: 'Knowledge base', body: 'Your documents are chunked, embedded and re-indexed on a schedule you control.', points: ['Source and version kept on every chunk', 'Stale content expires instead of lingering in answers'] },
      sor: { title: 'Systems of record', body: 'Agents read live data from the systems your team already trusts.', points: ['Read replicas or APIs, never a shadow copy', 'Writes go through the same validation your app uses'] },
      tenant: { title: 'Tenant scope', body: 'The caller’s identity and permissions are resolved before any data is touched.', points: ['Row-level security enforced in the database', 'Cross-tenant access is tested in CI on every change'] },
      retrieval: { title: 'Retrieval', body: 'Keyword and vector search run together, then a reranker picks what the model sees.', points: ['Retrieval quality measured on its own eval set', 'Citations returned with every answer'] },
      orchestrator: { title: 'Orchestrator', body: 'The model plans the work as explicit steps so each one can be inspected and retried.', points: ['Step and cost budgets per request', 'Model choice is configuration, so you are not locked to one vendor'] },
      tools: { title: 'Tools', body: 'Agents act through typed functions with their own permissions, not free-form API access.', points: ['Inputs validated against a schema', 'Destructive actions require approval by default'] },
      guardrails: { title: 'Guardrails', body: 'Inputs and outputs are checked against your policies before anything leaves the system.', points: ['Prompt-injection and PII screening', 'Blocked requests are logged with the reason'] },
      confidence: { title: 'Confidence check', body: 'A threshold tuned on your eval data decides what ships on its own and what waits for a person.', points: ['Threshold set per action type', 'Tightened or relaxed with evidence, not instinct'] },
      human: { title: 'Human review', body: 'Low-confidence and high-impact actions queue for a reviewer who can approve, edit or reject.', points: ['Reviewer edits feed the next eval set', 'Queue time tracked as a product metric'] },
      action: { title: 'Verified action', body: 'The result is written back to your system and confirmed, not assumed.', points: ['Idempotent writes with rollback', 'Outcome checked against the source system'] },
      audit: { title: 'Audit trail', body: 'Inputs, retrieved context, model output and the final decision are stored together.', points: ['Answers the question “why did it do that?”', 'Exportable for compliance reviews'] },
    },
    scenarios: [
      { id: 'routine', label: 'Routine request', outcome: 'Completed without review', steps: [
        { node: 'request', log: 'Refund request received, trace opened' },
        { node: 'tenant', log: 'Caller resolved to one account, scope applied' },
        { node: 'retrieval', log: 'Refund policy and order history retrieved' },
        { node: 'orchestrator', log: 'Plan: verify order, check policy, issue refund' },
        { node: 'tools', log: 'Billing tool called with validated input' },
        { node: 'guardrails', log: 'Policy and schema checks passed' },
        { node: 'confidence', log: 'Above threshold for refunds of this size' },
        { node: 'action', log: 'Refund written to billing and confirmed', state: 'verified' },
        { node: 'audit', log: 'Trace stored', state: 'verified' },
      ] },
      { id: 'review', label: 'Needs a human', outcome: 'Completed after reviewer approval', steps: [
        { node: 'request', log: 'Contract exception requested, trace opened' },
        { node: 'tenant', log: 'Caller resolved, scope applied' },
        { node: 'retrieval', log: 'Two clauses retrieved that conflict' },
        { node: 'orchestrator', log: 'Plan drafted with both readings noted' },
        { node: 'guardrails', log: 'Policy checks passed' },
        { node: 'confidence', log: 'Below threshold, routed to review', state: 'review' },
        { node: 'human', log: 'Reviewer edited the draft and approved', state: 'review' },
        { node: 'action', log: 'Approved response sent', state: 'verified' },
        { node: 'audit', log: 'Trace stored with reviewer edit', state: 'verified' },
      ] },
      { id: 'blocked', label: 'Injection attempt', outcome: 'Blocked before any action', steps: [
        { node: 'request', log: 'Uploaded file contains hidden instructions' },
        { node: 'tenant', log: 'Caller resolved, scope applied' },
        { node: 'retrieval', log: 'File content retrieved as untrusted data' },
        { node: 'orchestrator', log: 'Plan attempts an out-of-scope export' },
        { node: 'guardrails', log: 'Export denied: outside caller permissions', state: 'blocked' },
        { node: 'audit', log: 'Attempt logged with reason, no action taken', state: 'blocked' },
      ] },
    ],
  },

  /* Services: how a change reaches production */
  release: {
    title: 'How a change reaches production',
    columns: [
      { label: 'Change', nodes: [{ id: 'change', label: 'Pull request', sub: 'prompt, model or code' }] },
      { label: 'Verify', nodes: [
        { id: 'tests', label: 'Automated tests', sub: 'unit, contract, tenancy' },
        { id: 'evals', label: 'Eval suite', sub: 'golden set, regressions' },
      ] },
      { label: 'Review', nodes: [{ id: 'review', label: 'Senior review', sub: 'diff and eval report' }] },
      { label: 'Release', nodes: [
        { id: 'staging', label: 'Staging', sub: 'production-like data shape' },
        { id: 'canary', label: 'Canary', sub: 'small share of traffic' },
      ] },
      { label: 'Run', nodes: [
        { id: 'prod', label: 'Production', sub: 'full rollout' },
        { id: 'monitor', label: 'Monitoring', sub: 'quality, cost, latency' },
      ] },
    ],
    edges: [
      ['change', 'tests'], ['tests', 'evals'], ['evals', 'review'], ['review', 'staging'],
      ['staging', 'canary'], ['canary', 'prod'], ['prod', 'monitor'], ['canary', 'monitor'],
    ],
    details: {
      change: { title: 'Pull request', body: 'Prompts and model settings live in version control and change the same way code does.', points: ['No edits in a vendor console', 'Every change has an author and a reason'] },
      tests: { title: 'Automated tests', body: 'Conventional tests cover everything deterministic, including tenant isolation.', points: ['Contract tests for every tool an agent can call', 'Cross-tenant access attempts must fail'] },
      evals: { title: 'Eval suite', body: 'The change is scored against real cases with known good answers before a person looks at it.', points: ['Golden set built from your data in week one', 'A drop on any tracked metric fails the build'] },
      review: { title: 'Senior review', body: 'A senior engineer reads the diff next to the eval report and decides.', points: ['Reviewer is accountable for the release', 'No self-merges'] },
      staging: { title: 'Staging', body: 'The release runs against data shaped like production before customers see it.', points: ['Migrations rehearsed', 'Synthetic traffic replays common requests'] },
      canary: { title: 'Canary', body: 'A small share of real traffic goes to the new version while the rest stays put.', points: ['Automatic rollback on error or quality drop', 'Per-tenant opt-out available'] },
      prod: { title: 'Production', body: 'Rollout completes once the canary holds.', points: ['Previous version kept warm for rollback', 'Release notes sent to your team'] },
      monitor: { title: 'Monitoring', body: 'Answer quality, cost per request and latency are tracked like uptime.', points: ['Sampled production traffic re-scored weekly', 'New failures become new eval cases'] },
    },
    scenarios: [
      { id: 'pass', label: 'Prompt change', outcome: 'Released', steps: [
        { node: 'change', log: 'Prompt revision opened as a pull request' },
        { node: 'tests', log: 'Unit, contract and tenancy tests passed' },
        { node: 'evals', log: 'Golden set scored, no metric dropped' },
        { node: 'review', log: 'Diff and eval report approved' },
        { node: 'staging', log: 'Replay traffic clean' },
        { node: 'canary', log: 'Canary held on a small share of traffic' },
        { node: 'prod', log: 'Rolled out to all tenants', state: 'verified' },
        { node: 'monitor', log: 'Quality, cost and latency within bounds', state: 'verified' },
      ] },
      { id: 'regress', label: 'Model upgrade that regresses', outcome: 'Stopped at the eval gate', steps: [
        { node: 'change', log: 'Model version bumped in config' },
        { node: 'tests', log: 'Unit, contract and tenancy tests passed' },
        { node: 'evals', log: 'Citation accuracy dropped on the golden set, build failed', state: 'blocked' },
      ] },
    ],
  },

  /* Services: a multi-tenant SaaS request */
  saas: {
    title: 'A multi-tenant request, layer by layer',
    columns: [
      { label: 'Client', nodes: [{ id: 'client', label: 'Web or mobile app', sub: 'signed-in user' }] },
      { label: 'Edge', nodes: [
        { id: 'auth', label: 'Auth', sub: 'SSO, roles' },
        { id: 'gateway', label: 'API gateway', sub: 'rate limits, routing' },
      ] },
      { label: 'Services', nodes: [
        { id: 'api', label: 'Application API', sub: 'business rules' },
        { id: 'workers', label: 'Queue and workers', sub: 'async jobs' },
      ] },
      { label: 'Data', nodes: [
        { id: 'db', label: 'Tenant-scoped data', sub: 'row-level security' },
        { id: 'billing', label: 'Usage and billing', sub: 'metered events' },
      ] },
      { label: 'Operate', nodes: [{ id: 'obs', label: 'Observability', sub: 'logs, traces, alerts' }] },
    ],
    edges: [
      ['client', 'auth'], ['auth', 'gateway'], ['gateway', 'api'], ['api', 'workers'],
      ['api', 'db'], ['workers', 'billing'], ['db', 'obs'], ['billing', 'obs'], ['api', 'billing'],
    ],
    details: {
      client: { title: 'Web or mobile app', body: 'One design system across web and mobile, built with the product team in the room.', points: ['Accessible components', 'Feature flags per tenant'] },
      auth: { title: 'Auth', body: 'Identity is handled once, at the edge, with roles your enterprise buyers expect.', points: ['SSO and role-based access', 'Tenant ID carried in a signed token'] },
      gateway: { title: 'API gateway', body: 'A single entry point applies limits and routes traffic.', points: ['Per-tenant rate limits', 'Versioned public API'] },
      api: { title: 'Application API', body: 'Business rules live in one place and are covered by tests.', points: ['Typed contracts between services', 'Idempotent endpoints for payments'] },
      workers: { title: 'Queue and workers', body: 'Slow or failure-prone work runs in the background with retries.', points: ['Dead-letter queues monitored', 'Jobs tagged by tenant'] },
      db: { title: 'Tenant-scoped data', body: 'The database itself refuses to return another tenant’s rows.', points: ['Row-level security policies', 'Isolation tests run on every change'] },
      billing: { title: 'Usage and billing', body: 'Usage is metered as events so pricing can change without a rewrite.', points: ['Reconciled against the payment provider', 'Per-tenant usage reports'] },
      obs: { title: 'Observability', body: 'Logs, traces and alerts are in place before launch, not after the first outage.', points: ['On-call runbooks handed over', 'Dashboards per tenant and per feature'] },
    },
    scenarios: [
      { id: 'read', label: 'Tenant reads its invoices', outcome: 'Served', steps: [
        { node: 'client', log: 'User opens the invoices screen' },
        { node: 'auth', log: 'Session valid, role allows billing access' },
        { node: 'gateway', log: 'Within rate limit, routed to API' },
        { node: 'api', log: 'Invoice query built for caller’s tenant' },
        { node: 'db', log: 'Rows returned for one tenant only', state: 'verified' },
        { node: 'obs', log: 'Request traced', state: 'verified' },
      ] },
      { id: 'cross', label: 'Cross-tenant attempt', outcome: 'Refused by the database', steps: [
        { node: 'client', log: 'Request tampered to ask for another tenant’s ID' },
        { node: 'auth', log: 'Session valid for the caller’s own tenant' },
        { node: 'gateway', log: 'Routed to API' },
        { node: 'api', log: 'Query passed down with caller’s tenant scope' },
        { node: 'db', log: 'Row-level security returned nothing', state: 'blocked' },
        { node: 'obs', log: 'Alert raised for the security channel', state: 'blocked' },
      ] },
    ],
  },

  /* Sprints: legacy modernization behind a facade */
  modernize: {
    title: 'Modernizing without a rewrite',
    columns: [
      { label: 'Traffic', nodes: [{ id: 'users', label: 'Users and integrations', sub: 'unchanged URLs' }] },
      { label: 'Facade', nodes: [{ id: 'facade', label: 'Routing facade', sub: 'route by route' }] },
      { label: 'Systems', nodes: [
        { id: 'legacy', label: 'Legacy application', sub: 'still serving' },
        { id: 'service', label: 'New service', sub: 'tested, documented' },
      ] },
      { label: 'Data', nodes: [
        { id: 'legacydb', label: 'Legacy database', sub: 'source of truth' },
        { id: 'events', label: 'Change stream', sub: 'kept in sync' },
      ] },
      { label: 'AI layer', nodes: [{ id: 'ai', label: 'AI capability', sub: 'search, agents, automation' }] },
    ],
    edges: [
      ['users', 'facade'], ['facade', 'legacy'], ['facade', 'service'], ['legacy', 'legacydb'],
      ['legacydb', 'events'], ['service', 'events'], ['events', 'ai'], ['service', 'ai'],
    ],
    details: {
      users: { title: 'Users and integrations', body: 'Nobody outside the engineering team should notice the migration.', points: ['Same URLs and API contracts', 'No freeze on feature work'] },
      facade: { title: 'Routing facade', body: 'A thin layer in front of the old system decides, route by route, who answers.', points: ['Switch a route back in seconds', 'Old and new responses compared before cutover'] },
      legacy: { title: 'Legacy application', body: 'The old system keeps earning while it shrinks.', points: ['Seams mapped in the first two weeks', 'Riskiest modules get tests first'] },
      service: { title: 'New service', body: 'Each carved-out capability is rebuilt with tests, docs and an owner.', points: ['One bounded capability at a time', 'Deployed through the same release pipeline as new work'] },
      legacydb: { title: 'Legacy database', body: 'The existing database stays the source of truth until a capability has fully moved.', points: ['No big-bang data migration', 'Schema documented as it is, not as remembered'] },
      events: { title: 'Change stream', body: 'Changes are streamed so old and new stay consistent and AI features see fresh data.', points: ['Change data capture from the legacy database', 'Replayable for backfills'] },
      ai: { title: 'AI capability', body: 'With clean interfaces and fresh data, AI features attach to the new services rather than the old tangle.', points: ['Starts with one workflow worth automating', 'Same guardrails and evals as any Techlio build'] },
    },
    scenarios: [
      { id: 'old', label: 'Route still on legacy', outcome: 'Served by the legacy system', steps: [
        { node: 'users', log: 'Request for a route not yet migrated' },
        { node: 'facade', log: 'Routing table says legacy' },
        { node: 'legacy', log: 'Handled by the existing application' },
        { node: 'legacydb', log: 'Read and written as before', state: 'verified' },
        { node: 'events', log: 'Change captured for downstream services', state: 'verified' },
      ] },
      { id: 'new', label: 'Migrated route with AI', outcome: 'Served by the new service', steps: [
        { node: 'users', log: 'Request for a migrated route' },
        { node: 'facade', log: 'Routing table says new service' },
        { node: 'service', log: 'Handled by the rebuilt capability' },
        { node: 'ai', log: 'Document classified and summarized for the user', state: 'verified' },
      ] },
    ],
  },

  /* Workflow automation: an inbound document becomes a posted record */
  workflow: {
    title: 'An inbound invoice, automated',
    columns: [
      { label: 'Trigger', nodes: [{ id: 'inbox', label: 'Shared inbox', sub: 'email with attachment' }] },
      { label: 'Understand', nodes: [
        { id: 'classify', label: 'Classify', sub: 'invoice, PO, other' },
        { id: 'extract', label: 'Extract', sub: 'fields with confidence' },
      ] },
      { label: 'Check', nodes: [
        { id: 'validate', label: 'Validate', sub: 'against PO and vendor' },
        { id: 'approve', label: 'Approver', sub: 'exceptions only' },
      ] },
      { label: 'Act', nodes: [
        { id: 'erp', label: 'Post to ERP', sub: 'idempotent write' },
        { id: 'notify', label: 'Notify', sub: 'requester and finance' },
      ] },
      { label: 'Measure', nodes: [{ id: 'metrics', label: 'Run log', sub: 'time saved, exceptions' }] },
    ],
    edges: [
      ['inbox', 'classify'], ['classify', 'extract'], ['extract', 'validate'], ['validate', 'approve'],
      ['validate', 'erp'], ['approve', 'erp'], ['erp', 'notify'], ['erp', 'metrics'], ['approve', 'metrics'],
    ],
    details: {
      inbox: { title: 'Shared inbox', body: 'Automation starts where the work already arrives, so nobody changes how they send things.', points: ['Email, upload, webhook or schedule', 'Duplicates detected before processing'] },
      classify: { title: 'Classify', body: 'Each document is sorted so the right extraction and rules apply.', points: ['Unknown types go to a person, not a guess', 'Accuracy tracked per document type'] },
      extract: { title: 'Extract', body: 'Fields are pulled with a confidence score per field, not one score per page.', points: ['Low-confidence fields highlighted for review', 'Tested on your real documents'] },
      validate: { title: 'Validate', body: 'Extracted values are checked against the systems that know the truth.', points: ['Matched to purchase order and vendor record', 'Deterministic rules, not model opinion'] },
      approve: { title: 'Approver', body: 'People see only the exceptions, with the reason and the source document side by side.', points: ['One-click approve, edit or reject', 'Corrections improve the next run'] },
      erp: { title: 'Post to ERP', body: 'The record is written once and confirmed.', points: ['Safe to retry', 'Rollback path for every write'] },
      notify: { title: 'Notify', body: 'The people waiting on the outcome hear about it without asking.', points: ['Slack, email or in-app', 'Quiet by default'] },
      metrics: { title: 'Run log', body: 'Every run is recorded so the saving is measured rather than estimated.', points: ['Hours saved and exception rate per week', 'Baseline captured before go-live'] },
    },
    scenarios: [
      { id: 'clean', label: 'Clean invoice', outcome: 'Posted with no human touch', steps: [
        { node: 'inbox', log: 'Invoice PDF received' },
        { node: 'classify', log: 'Classified as invoice' },
        { node: 'extract', log: 'All fields extracted above threshold' },
        { node: 'validate', log: 'Matches purchase order and vendor' },
        { node: 'erp', log: 'Posted and confirmed', state: 'verified' },
        { node: 'notify', log: 'Requester and finance notified', state: 'verified' },
      ] },
      { id: 'mismatch', label: 'Amount mismatch', outcome: 'Posted after approver correction', steps: [
        { node: 'inbox', log: 'Invoice PDF received' },
        { node: 'classify', log: 'Classified as invoice' },
        { node: 'extract', log: 'Total extracted with low confidence' },
        { node: 'validate', log: 'Total differs from purchase order', state: 'review' },
        { node: 'approve', log: 'Approver corrected the total', state: 'review' },
        { node: 'erp', log: 'Posted and confirmed', state: 'verified' },
        { node: 'metrics', log: 'Exception recorded with cause', state: 'verified' },
      ] },
    ],
  },

  /* Agents and knowledge: a grounded answer */
  knowledge: {
    title: 'A grounded answer, with its sources',
    columns: [
      { label: 'Ask', nodes: [{ id: 'question', label: 'Question', sub: 'from an employee' }] },
      { label: 'Find', nodes: [
        { id: 'access', label: 'Access check', sub: 'what may they see?' },
        { id: 'search', label: 'Search', sub: 'docs, database, tickets' },
      ] },
      { label: 'Answer', nodes: [
        { id: 'compose', label: 'Compose', sub: 'only from sources' },
        { id: 'cite', label: 'Cite', sub: 'link every claim' },
      ] },
      { label: 'Decide', nodes: [
        { id: 'grounded', label: 'Grounding check', sub: 'claims match sources' },
        { id: 'handoff', label: 'Hand off', sub: 'to the right person' },
      ] },
      { label: 'Result', nodes: [{ id: 'answer', label: 'Answer delivered', sub: 'with citations' }] },
    ],
    edges: [
      ['question', 'access'], ['access', 'search'], ['search', 'compose'], ['compose', 'cite'],
      ['cite', 'grounded'], ['grounded', 'handoff'], ['grounded', 'answer'], ['handoff', 'answer'],
    ],
    details: {
      question: { title: 'Question', body: 'People ask in their own words, in the tool they already use.', points: ['Slack, Teams, web or API', 'Conversation history kept per user'] },
      access: { title: 'Access check', body: 'The assistant can only retrieve what the person asking is allowed to open.', points: ['Permissions mirrored from the source system', 'No shared index that leaks across teams'] },
      search: { title: 'Search', body: 'Documents, structured data and tickets are searched together.', points: ['Hybrid keyword and vector search', 'Freshness and source weighting'] },
      compose: { title: 'Compose', body: 'The model writes from the retrieved passages and is told to say so when they do not answer the question.', points: ['“I could not find that” is an acceptable answer', 'Tone and format set per audience'] },
      cite: { title: 'Cite', body: 'Each claim links to the passage it came from.', points: ['Readers can verify in one click', 'Missing citations fail the grounding check'] },
      grounded: { title: 'Grounding check', body: 'A second pass confirms the answer is supported by its sources.', points: ['Scored on an eval set of real questions', 'Unsupported answers never reach the user'] },
      handoff: { title: 'Hand off', body: 'Questions the system cannot support go to a named owner with the context attached.', points: ['Routing by topic', 'Gaps reported so the knowledge base improves'] },
      answer: { title: 'Answer delivered', body: 'The person gets an answer they can check.', points: ['Thumbs up or down feeds the eval set', 'Usage and gaps reported monthly'] },
    },
    scenarios: [
      { id: 'known', label: 'Answer exists', outcome: 'Answered with citations', steps: [
        { node: 'question', log: 'Question about the parental leave policy' },
        { node: 'access', log: 'Employee may read HR policies' },
        { node: 'search', log: 'Two current policy passages found' },
        { node: 'compose', log: 'Answer drafted from both passages' },
        { node: 'cite', log: 'Each claim linked to its passage' },
        { node: 'grounded', log: 'All claims supported' },
        { node: 'answer', log: 'Answer delivered with two citations', state: 'verified' },
      ] },
      { id: 'gap', label: 'Knowledge gap', outcome: 'Routed to an owner, gap logged', steps: [
        { node: 'question', log: 'Question about a policy for a new region' },
        { node: 'access', log: 'Employee may read HR policies' },
        { node: 'search', log: 'No passage covers that region' },
        { node: 'compose', log: 'Draft states that no source was found' },
        { node: 'cite', log: 'Nothing to cite' },
        { node: 'grounded', log: 'Cannot be supported, routed', state: 'review' },
        { node: 'handoff', log: 'Sent to HR owner with the question attached', state: 'review' },
      ] },
    ],
  },

  /* Advisory: how an idea becomes a roadmap item */
  roadmap: {
    title: 'How an AI idea earns a place on the roadmap',
    columns: [
      { label: 'Evidence', nodes: [
        { id: 'stack', label: 'Stack review', sub: 'code, infra, data' },
        { id: 'interviews', label: 'Workflow interviews', sub: 'where time goes' },
      ] },
      { label: 'Candidates', nodes: [{ id: 'ideas', label: 'Use-case list', sub: 'every idea, written down' }] },
      { label: 'Score', nodes: [
        { id: 'value', label: 'Value', sub: 'hours, revenue, risk' },
        { id: 'feasible', label: 'Feasibility', sub: 'data and integration' },
      ] },
      { label: 'Decide', nodes: [
        { id: 'now', label: 'Build now', sub: 'ranked shortlist' },
        { id: 'later', label: 'Not yet', sub: 'with prerequisites' },
      ] },
      { label: 'Hand over', nodes: [{ id: 'plan', label: 'Architecture and estimate', sub: 'ready to build' }] },
    ],
    edges: [
      ['stack', 'ideas'], ['interviews', 'ideas'], ['ideas', 'value'], ['value', 'feasible'],
      ['feasible', 'now'], ['feasible', 'later'], ['now', 'plan'],
    ],
    details: {
      stack: { title: 'Stack review', body: 'We read the code, the infrastructure and the data before forming an opinion.', points: ['Read-only access is enough', 'Findings written up, not just presented'] },
      interviews: { title: 'Workflow interviews', body: 'The people doing the work show us where the hours actually go.', points: ['Operators as well as executives', 'Volumes and error rates captured'] },
      ideas: { title: 'Use-case list', body: 'Every candidate is written down in the same format so they can be compared.', points: ['Owner, users and success measure for each', 'Nothing dismissed in the room'] },
      value: { title: 'Value', body: 'Each idea gets an estimate in hours saved, revenue affected or risk removed.', points: ['Assumptions stated', 'Ranges, not single numbers'] },
      feasible: { title: 'Feasibility', body: 'We check whether the data and integrations needed exist today.', points: ['Sample data tested, not assumed', 'Build-versus-buy considered for each'] },
      now: { title: 'Build now', body: 'A short ranked list of things worth building this quarter.', points: ['Usually two or three items', 'First one sized for a fixed-scope sprint'] },
      later: { title: 'Not yet', body: 'Good ideas that are not ready are parked with what would unblock them.', points: ['Prerequisites listed', 'Revisited at the next review'] },
      plan: { title: 'Architecture and estimate', body: 'The top item leaves with a design and a price range your team or ours can build from.', points: ['Architecture decision record', 'Estimate with stated assumptions'] },
    },
    scenarios: [
      { id: 'ready', label: 'Valuable and ready', outcome: 'Ranked first, designed and estimated', steps: [
        { node: 'interviews', log: 'Support team spends most of its day on repeat questions' },
        { node: 'ideas', log: 'Candidate: assistant grounded in the help center' },
        { node: 'value', log: 'High: large share of ticket volume' },
        { node: 'feasible', log: 'Help center and ticket history are clean and accessible' },
        { node: 'now', log: 'Ranked first on the shortlist', state: 'verified' },
        { node: 'plan', log: 'Architecture and estimate delivered', state: 'verified' },
      ] },
      { id: 'notready', label: 'Valuable, data not ready', outcome: 'Parked with prerequisites', steps: [
        { node: 'stack', log: 'Sales data lives in three unreconciled systems' },
        { node: 'ideas', log: 'Candidate: automated deal forecasting' },
        { node: 'value', log: 'High: affects quarterly planning' },
        { node: 'feasible', log: 'No single reliable source for deal history', state: 'review' },
        { node: 'later', log: 'Parked: consolidate deal data first', state: 'review' },
      ] },
    ],
  },
};
