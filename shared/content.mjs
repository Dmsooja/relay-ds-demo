export const routes = [
  { path: '/', label: 'Home', title: 'The work between teams, in sync!' },
  { path: '/solutions', label: 'Solutions', title: 'Build around the way work moves.' },
  { path: '/pricing', label: 'Pricing', title: 'A plan for the way you work.' },
  { path: '/contact', label: 'Contact', title: 'Let’s talk about your workflow.' },
]

export const features = [
  { symbol: 'intake', title: 'One way in', body: 'Give every request a clear starting point, with the details your team needs up front.' },
  { symbol: 'route', title: 'The right next step', body: 'Route work to the right owner and set approval rules everyone can understand.' },
  { symbol: 'visibility', title: 'A shared view', body: 'See who owns the next step and where work is waiting, in one place.' },
]

export const solutionWorkflows = [
  { title: 'Request intake', category: 'Intake', description: 'Replace scattered requests with a shared queue. Capture what’s needed once and route each request by team, type, or priority.', steps: ['Collect a request', 'Route to a team', 'Assign an owner'] },
  { title: 'Cross-team approvals', category: 'Approvals', description: 'Keep purchase, policy, and launch approvals moving with a visible owner at every step.', steps: ['Check request details', 'Send for approval', 'Record the decision'] },
  { title: 'Team handoffs', category: 'Handoffs', description: 'Pass context, decisions, and next steps between teams without rewriting the work each time.', steps: ['Gather the context', 'Hand off with an owner', 'Confirm receipt'] },
]

export const plans = [
  { id: 'starter', name: 'Starter', description: 'For a team replacing its shared inbox.', monthly: 19, annual: 15, features: ['Unlimited requests', '3 active workflows', 'Shared request inbox'], cta: 'Talk about Starter' },
  { id: 'team', name: 'Team', description: 'For teams coordinating work together.', monthly: 39, annual: 32, features: ['Everything in Starter', 'Unlimited workflows', 'Approval rules and reporting'], cta: 'Talk about Team' },
  { id: 'enterprise', name: 'Enterprise', description: 'For operations at organization scale.', monthly: null, annual: null, features: ['Everything in Team', 'Single sign-on and access controls', 'Dedicated onboarding'], cta: 'Contact sales' },
]

export const pricingQuestions = [
  { question: 'What counts as a seat?', answer: 'A seat is a teammate who builds, manages, or reviews workflows. People who only submit a request do not need a seat.' },
  { question: 'Can I switch plans later?', answer: 'Yes. Start with the workflows you need today and change plans as more teams join.' },
  { question: 'How does annual billing work?', answer: 'Annual prices are shown per seat per month. The total for the year is billed upfront.' },
]

export const requestRows = [
  { name: 'New vendor review', team: 'Procurement', status: 'In review', tone: 'warning' },
  { name: 'IT access request', team: 'IT operations', status: 'Approved', tone: 'success' },
  { name: 'Launch handoff', team: 'Product ops', status: 'Assigned', tone: 'neutral' },
]
