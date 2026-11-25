export const workspaceRequests = [
  { id: 'REQ-1042', name: 'New vendor review', team: 'Procurement', owner: 'Alex Morgan', initials: 'AM', status: 'In review', tone: 'warning', date: 'Today', description: 'Review the proposed supplier and confirm procurement requirements before onboarding.', activity: 'Alex added the supplier assessment and requested a review.' },
  { id: 'REQ-1041', name: 'IT access request', team: 'IT operations', owner: 'Jamie Chen', initials: 'JC', status: 'Approved', tone: 'success', date: 'Today', description: 'Provision access to the project workspace for the new team member.', activity: 'Jamie approved the access request.' },
  { id: 'REQ-1040', name: 'Launch handoff', team: 'Product ops', owner: 'Sam Rivera', initials: 'SR', status: 'Assigned', tone: 'neutral', date: 'Tomorrow', description: 'Coordinate the launch checklist and share the handoff with the support team.', activity: 'Sam was assigned to coordinate the launch handoff.' },
  { id: 'REQ-1039', name: 'Software purchase', team: 'Procurement', owner: 'Alex Morgan', initials: 'AM', status: 'In review', tone: 'warning', date: 'Tomorrow', description: 'Review a software subscription request and confirm the budget owner.', activity: 'The budget owner submitted the purchase for review.' },
  { id: 'REQ-1038', name: 'New starter setup', team: 'IT operations', owner: 'Jamie Chen', initials: 'JC', status: 'Assigned', tone: 'neutral', date: 'Friday', description: 'Prepare equipment and workspace access for the next new starter.', activity: 'Jamie received the onboarding checklist.' },
  { id: 'REQ-1037', name: 'Campaign asset handoff', team: 'Product ops', owner: 'Sam Rivera', initials: 'SR', status: 'Approved', tone: 'success', date: 'Yesterday', description: 'Review final assets and share the approved package with the launch team.', activity: 'Sam confirmed delivery of the approved assets.' },
]

export const workspaceMetrics = [
  { label: 'Open requests', value: '12', note: 'Across your active workflows', icon: 'intake' },
  { label: 'Awaiting review', value: '4', note: 'Ready for a decision', icon: 'visibility' },
  { label: 'Completed', value: '28', note: 'This week', icon: 'check' },
]

export const workflowTemplates = [
  { id: 'vendor-review', title: 'Vendor review', team: 'Procurement', icon: 'visibility', description: 'Bring supplier details, due diligence, and a clear approval decision into one place.', outcome: 'An approved vendor, with the review recorded.', steps: ['Collect supplier details and the proposed contract', 'Assign procurement and security reviewers', 'Record the decision and notify the requester'] },
  { id: 'software-purchase', title: 'Software purchase', team: 'Procurement', icon: 'intake', description: 'Give every subscription request a budget owner and an approval path before purchase.', outcome: 'A purchase decision with an accountable budget owner.', steps: ['Capture the tool, price, and business need', 'Request budget and IT approval', 'Confirm the purchase and share next steps'] },
  { id: 'access-request', title: 'Access request', team: 'IT operations', icon: 'route', description: 'Route application access requests to the right owner with the context they need.', outcome: 'Access provisioned and confirmed with the requester.', steps: ['Collect the application and access level', 'Ask the application owner to approve', 'Provision access and confirm completion'] },
  { id: 'starter-setup', title: 'New starter setup', team: 'IT operations', icon: 'check', description: 'Coordinate devices, accounts, and a ready-to-go workspace before someone’s first day.', outcome: 'A new teammate with the essentials ready for day one.', steps: ['Capture the start date, role, and equipment needs', 'Assign account and device setup tasks', 'Confirm readiness with the hiring manager'] },
  { id: 'launch-handoff', title: 'Launch handoff', team: 'Product ops', icon: 'route', description: 'Pass launch context and responsibilities from product to the teams supporting the release.', outcome: 'A shared launch checklist with clear owners.', steps: ['Gather release notes and launch materials', 'Assign tasks across support and go-to-market teams', 'Confirm each team is ready for launch'] },
  { id: 'asset-review', title: 'Campaign asset review', team: 'Product ops', icon: 'grid', description: 'Keep creative feedback, sign-off, and the final asset handoff on a clear path.', outcome: 'Approved assets delivered to the launch team.', steps: ['Submit the brief and creative assets', 'Collect feedback and final sign-off', 'Share the approved package with the launch owner'] },
]

export function filterRequests(requests, query, status) {
  const term = query.trim().toLowerCase()
  return requests.filter(request => {
    const matchesText = [request.id, request.name, request.team, request.owner].some(value => value.toLowerCase().includes(term))
    const matchesStatus = status === 'all' || (status === 'review' ? request.status === 'In review' : request.status === 'Approved')
    return matchesText && matchesStatus
  })
}
