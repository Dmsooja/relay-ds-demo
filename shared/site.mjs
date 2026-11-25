import { el as h, ui } from './ui.mjs'
import { routes, features, plans, solutionWorkflows, pricingQuestions } from './content.mjs'
import { workflowTemplates, workspaceMetrics, workspaceRequests } from './workspace.mjs'

const paths = {
  intake: '<path d="M4 5h16v14H4z M8 9h8 M8 13h5"/>',
  route: '<path d="M5 18v-4a3 3 0 0 1 3-3h9 M14 8l3 3-3 3 M5 6h3"/>',
  visibility: '<path d="M3 12s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z"/><circle cx="12" cy="12" r="2.5"/>',
  check: '<path d="m5 12 4 4 10-9"/>',
  grid: '<rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/>',
  bars: '<path d="M5 19V9 M12 19V5 M19 19v-7"/>',
  menu: '<path d="M4 7h16 M4 12h16 M4 17h16"/>',
}
const icon = name => h('span', {
  class: 'icon', 'aria-hidden': 'true',
  html: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round">${paths[name]}</svg>`,
})
const container = (...children) => h('div', { class: 'container' }, children)
const title = text => h('h2', {}, text)
const p = text => h('p', {}, text)
const btn = (label, href, variant = 'primary') => ui('button', { href, variant }, label)
const eyebrow = label => h('p', { class: 'eyebrow' }, label)
const mark = () => h('span', { class: 'wordmark' }, h('span', { class: 'brand-mark', 'aria-hidden': 'true' }), 'Relay')
const routeLinks = active => routes.map(route =>
  ui('link', { href: route.path, 'aria-current': active === route.path ? 'page' : undefined }, route.label))

function header(active) {
  return ui('header', {}, container(h('div', { class: 'nav-row' },
    h('a', { class: 'home-brand', href: '/', 'aria-label': 'Relay home' }, mark()),
    h('nav', { id: 'main-navigation', class: 'main-nav', 'aria-label': 'Main navigation' }, routeLinks(active)),
    h('div', { class: 'nav-actions' },
      h('fieldset', { class: 'theme-control' }, h('legend', { class: 'sr-only' }, 'Demo theme'),
        ['red', 'blue'].map(theme => h('button', { type: 'button', 'data-theme-choice': theme, 'aria-pressed': theme === 'red' },
          h('span', { 'aria-hidden': 'true' }), theme === 'red' ? 'Red' : 'Blue'))),
      ui('button', { href: '/contact', variant: 'primary', class: 'header-demo' }, 'Book a demo'),
      ui('button', { href: '/workspace', variant: 'ghost', class: 'header-login' }, 'Log in'),
      h('button', { class: 'menu-toggle', type: 'button', 'data-menu': '', 'aria-controls': 'main-navigation', 'aria-expanded': 'false', 'aria-label': 'Open menu' }, icon('menu'))),
  )))
}

function dashboard(explore = false) {
  return h('div', { class: 'dashboard-shell' },
    h('aside', { class: 'dashboard-sidebar' },
      h('a', { class: 'dashboard-brand', href: '/', 'aria-label': 'Relay home' }, mark()),
      h('div', { class: 'workspace-switcher' }, h('span', { class: 'workspace-avatar', 'aria-hidden': 'true' }, 'R'),
        h('div', {}, h('strong', {}, 'Relay workspace'), h('small', {}, 'Operations team'))),
      h('nav', { 'aria-label': 'Workspace navigation' },
        ui('link', { href: '/workspace', 'aria-current': !explore ? 'page' : undefined }, icon('intake'), 'Request inbox'),
        ui('link', { href: '/workspace/workflows', 'aria-current': explore ? 'page' : undefined }, icon('route'), 'Explore workflows'),
        ui('link', { href: '/contact' }, icon('visibility'), 'Get help')),
      h('div', { class: 'sidebar-bottom' }, ui('link', { href: '/' }, 'Back to website')),
    ),
    h('div', { class: 'dashboard-body' },
      ui('header', { class: 'dashboard-topbar' },
        h('span', { class: 'workspace-location' }, 'Relay workspace'),
        h('div', { class: 'dashboard-top-actions' },
          h('fieldset', { class: 'theme-control' }, h('legend', { class: 'sr-only' }, 'Demo theme'),
            ['red', 'blue'].map(theme => h('button', { type: 'button', 'data-theme-choice': theme, 'aria-pressed': theme === 'red' },
              h('span', { 'aria-hidden': 'true' }), theme === 'red' ? 'Red' : 'Blue'))),
          h('span', { class: 'profile-avatar', 'aria-label': 'Jordan Demo' }, 'JD'))),
      h('main', { id: 'main', class: 'dashboard-main', tabindex: -1 },
        explore ? exploreWorkflows() : h('div', {},
        h('div', { class: 'dashboard-heading' },
          h('div', {}, eyebrow('Operations'), h('h1', {}, 'Request inbox'), p('A shared view of the work moving across your teams.')),
          ui('badge', { variant: 'brand' }, 'This week')),
        h('div', { class: 'dashboard-metrics' }, workspaceMetrics.map(metric => ui('card', {},
          h('div', { class: 'metric-label' }, h('span', {}, metric.label), icon(metric.icon)),
          h('strong', { class: 'metric-value' }, metric.value), h('small', {}, metric.note)))),
        ui('card', { class: 'inbox-card' },
          h('div', { class: 'inbox-heading' }, h('h2', {}, 'Team requests'), ui('badge', {}, '6 recent requests')),
          ui('tabs', {}, h('div', { class: 'tab-list', role: 'tablist', 'aria-label': 'Request status' },
            [['all', 'All requests'], ['review', 'Awaiting review'], ['approved', 'Completed']].map(([id, label], index) =>
              h('button', { id: 'request-tab-' + id, type: 'button', role: 'tab', 'data-request-filter': id,
                'aria-controls': 'request-panel', 'aria-selected': index === 0 ? 'true' : 'false', tabindex: index === 0 ? 0 : -1 }, label)))),
          h('div', { class: 'inbox-toolbar' },
            field('request-search', 'Search requests', ui('input', { id: 'request-search', type: 'search', placeholder: 'Search by name, team or owner', 'data-request-search': '' })),
            h('p', { role: 'status', 'aria-live': 'polite', 'data-request-count': '' }, '6 requests')),
          h('div', { role: 'tabpanel', id: 'request-panel', 'aria-labelledby': 'request-tab-all', tabindex: 0 },
            ui('list', { class: 'inbox-list' }, workspaceRequests.map(request => h('li', {
              'data-request-row': request.id,
              'data-search-text': [request.id, request.name, request.team, request.owner].join(' ').toLowerCase(),
              'data-request-status': request.status,
            },
              h('div', { class: 'request-copy' },
                ui('button', { variant: 'ghost', class: 'request-title', 'data-request-detail': request.id }, request.name),
                h('div', { class: 'request-meta' }, h('span', {}, request.team), h('span', { 'aria-hidden': 'true' }, '·'), h('span', {}, request.id))),
              h('div', { class: 'request-owner' }, h('span', { class: 'owner-avatar', 'aria-hidden': 'true' }, request.initials), h('span', {}, request.owner)),
              h('span', { class: 'request-date' }, request.date),
              ui('badge', { variant: request.tone }, request.status)))),
            h('div', { class: 'inbox-empty', hidden: true, 'data-request-empty': '' },
              h('h3', {}, 'No requests found'), p('Try a different search or request status.'),
              ui('button', { variant: 'secondary', 'data-clear-search': '' }, 'Clear filters')))),
        h('p', { class: 'dashboard-demo-note' }, 'Example workspace · illustrative data'))),
      !explore && ui('modal', { id: 'request-detail', class: 'request-dialog', label: 'Request details' },
        h('div', { class: 'dialog-heading' }, eyebrow('Request details'), ui('button', { variant: 'ghost', 'data-close-request': '', 'aria-label': 'Close request details' }, 'Close')),
        h('h2', { 'data-detail-title': '' }),
        h('p', { class: 'detail-id', 'data-detail-id': '' }),
        h('div', { class: 'detail-summary' }, h('span', { 'data-detail-status': '' })),
        h('p', { 'data-detail-description': '' }),
        h('dl', { class: 'detail-fields' },
          h('div', {}, h('dt', {}, 'Team'), h('dd', { 'data-detail-team': '' })),
          h('div', {}, h('dt', {}, 'Owner'), h('dd', { 'data-detail-owner': '' })),
          h('div', {}, h('dt', {}, 'Due'), h('dd', { 'data-detail-date': '' }))),
        h('div', { class: 'detail-activity' }, h('h3', {}, 'Latest activity'), h('p', { 'data-detail-activity': '' })),
        ui('button', { variant: 'secondary', 'data-close-request': '' }, 'Back to inbox'))),
  )
}

function exploreWorkflows() {
  return [
    h('div', { class: 'dashboard-heading' }, h('div', {},
      eyebrow('Workflow library'), h('h1', {}, 'Explore workflows'),
      p('Start with a proven structure for the work your team handles every day.'))),
    ui('card', { class: 'workflow-intro' },
      h('div', { class: 'feature-icon' }, icon('route')),
      h('div', {}, h('h2', {}, 'From request to done, with a clear next step.'),
        p('Explore the intake, review, and handoff steps in each template. Choose a starting point to discuss with your team.'))),
    h('div', { class: 'workflow-filters' },
      field('workflow-search', 'Search workflows', ui('input', { id: 'workflow-search', type: 'search', placeholder: 'Search templates or teams', 'data-workflow-search': '' })),
      field('workflow-team', 'Team', ui('select', { id: 'workflow-team', 'data-workflow-team': '' },
        ['All teams', 'Procurement', 'IT operations', 'Product ops'].map(team => h('option', { value: team }, team))))),
    h('p', { class: 'workflow-count', role: 'status', 'aria-live': 'polite', 'data-workflow-count': '' }, '6 templates'),
    h('div', { class: 'workflow-template-grid' }, workflowTemplates.map(template => ui('card', {
      class: 'workflow-template', 'data-workflow-card': template.id,
      'data-workflow-team-name': template.team,
      'data-workflow-text': [template.title, template.team, template.description].join(' ').toLowerCase(),
    },
      h('div', { class: 'workflow-card-top' }, h('div', { class: 'feature-icon' }, icon(template.icon)), ui('badge', { variant: 'brand' }, template.team)),
      h('h2', {}, template.title), p(template.description),
      h('p', { class: 'workflow-step-count' }, '3 steps · Request, review, complete'),
      ui('button', { variant: 'secondary', 'data-workflow-preview': template.id }, 'View ' + template.title.toLowerCase())))),
    h('div', { class: 'inbox-empty', hidden: true, 'data-workflow-empty': '' },
      h('h2', {}, 'No workflows found'), p('Try another search or choose a different team.'),
      ui('button', { variant: 'secondary', 'data-workflow-clear': '' }, 'Clear filters')),
    h('p', { class: 'dashboard-demo-note' }, 'Example templates · adapt each process to your team’s needs'),
    ui('modal', { class: 'workflow-dialog request-dialog', label: 'Workflow template' },
      h('div', { class: 'dialog-heading' }, eyebrow('Template preview'),
        ui('button', { variant: 'ghost', 'data-workflow-close': '', 'aria-label': 'Close workflow template' }, 'Close')),
      h('h2', { 'data-workflow-title': '' }),
      h('div', { class: 'detail-summary' }, ui('badge', { variant: 'brand', 'data-workflow-team-label': '' })),
      h('p', { 'data-workflow-description': '' }),
      h('h3', { class: 'workflow-steps-heading' }, 'How it works'),
      ui('list', { variant: 'ordered', class: 'workflow-preview-steps' }, [0, 1, 2].map(index => h('li', { 'data-workflow-step': index }))),
      h('div', { class: 'detail-activity' }, h('h3', {}, 'Expected outcome'), h('p', { 'data-workflow-outcome': '' })),
      ui('button', { variant: 'secondary', 'data-workflow-close': '' }, 'Back to workflows')),
  ]
}

function footer() {
  return ui('footer', {}, container(
    h('div', { class: 'footer-row' }, h('a', { class: 'home-brand', href: '/' }, mark()),
      h('nav', { 'aria-label': 'Footer navigation' }, routeLinks()), h('p', {}, 'Fictional SaaS · Relay DS Demo')),
  ))
}

function productPreview() {
  return h('figure', { class: 'product-preview' },
    h('img', { class: 'product-window', src: '/assets/relay-workspace-red.png',
      alt: 'Relay workspace dashboard with request metrics and the team request inbox',
      width: 1440, height: 1220, 'data-product-preview': '', decoding: 'async' }),
  )
}

function callout(heading, body, label = 'Book a demo') {
  return ui('cta-banner', {}, h('div', {}, title(heading), p(body)), btn(label, '/contact', 'secondary'))
}

function home() {
  return [
    ui('hero', { class: 'home-hero' }, container(h('div', { class: 'hero-grid' },
      h('div', { class: 'hero-copy' }, eyebrow('Workflow software for operations teams'),
        h('h1', {}, routes[0].title),
        p('Relay gives requests, approvals, and handoffs one clear path across your organization.'),
        h('div', { class: 'actions' }, btn('Book a demo', '/contact'), btn('Explore solutions', '/solutions', 'secondary'))),
      productPreview(),
    ))),
    h('section', { class: 'section' }, container(
      h('div', { class: 'section-heading' }, eyebrow('How Relay works'), title('A clearer path from request to done.')),
      ui('feature-grid', { class: 'three-col' }, features.map(feature => ui('card', {},
        h('div', { class: 'feature-icon' }, icon(feature.symbol)), h('h3', {}, feature.title), p(feature.body)))),
    )),
    h('section', { class: 'last-section' }, container(callout('Give your next workflow a home.', 'Bring one real process to the demo. We’ll walk through it together.'))),
  ]
}

function pageTitle(index, summary) {
  return ui('hero', { class: 'page-hero' }, container(
    ui('breadcrumb', { 'aria-label': 'Breadcrumb' }, ui('link', { href: '/' }, 'Home'),
      h('span', { 'aria-hidden': 'true' }, '/'), h('span', { 'aria-current': 'page' }, routes[index].label)),
    h('h1', {}, routes[index].title), p(summary),
  ))
}

function solutions() {
  return [
    pageTitle(1, 'Start with a process that crosses teams. Give each step a clear owner, then see it through to completion.'),
    h('section', { class: 'section' }, container(
      h('div', { class: 'section-heading' }, eyebrow('Workflow examples'), title('Make each handoff clear.')),
      ui('tabs', {}, h('div', { class: 'tab-list', role: 'tablist', 'aria-label': 'Workflow examples' },
        solutionWorkflows.map((workflow, index) => h('button', { id: `tab-${index}`, type: 'button', role: 'tab',
          'aria-controls': `workflow-${index}`, 'aria-selected': index === 0 ? 'true' : 'false', tabindex: index === 0 ? 0 : -1 }, workflow.category))),
        solutionWorkflows.map((workflow, index) => h('div', { id: `workflow-${index}`, role: 'tabpanel',
          tabindex: 0, 'aria-labelledby': `tab-${index}`, hidden: index !== 0 },
        ui('card', { class: 'workflow-card' }, h('div', {}, h('h3', {}, workflow.title), p(workflow.description)),
          h('ol', { class: 'workflow-steps' }, workflow.steps.map((step, position) => h('li', {},
            h('span', { 'aria-hidden': 'true' }, position + 1), step))))))),
    )),
    h('section', { class: 'last-section' }, container(callout('Which process would you start with?', 'See what a Relay workflow could look like for your team.'))),
  ]
}

function pricing() {
  return [
    pageTitle(2, 'Use Relay for one team or standardize operations across your organization.'),
    h('section', { class: 'section' }, container(
      h('div', { class: 'pricing-top' }, title('Compare plans'),
        h('fieldset', { class: 'billing-control' }, h('legend', { class: 'sr-only' }, 'Billing frequency'),
          ['Monthly', 'Annual'].map((period, index) => h('button', { type: 'button', 'data-billing': period.toLowerCase(),
            'aria-pressed': index === 0 ? 'true' : 'false' }, period)))),
      h('div', { class: 'three-col plan-grid' }, plans.map(plan =>
        ui('card', { class: plan.id === 'team' ? 'plan-card featured' : 'plan-card' },
          h('div', { class: 'plan-name' }, h('h3', {}, plan.name), plan.id === 'team' && ui('badge', { variant: 'brand' }, 'For growing teams')),
          p(plan.description),
          h('p', { class: 'plan-price' }, h('strong', { 'data-monthly': plan.monthly, 'data-annual': plan.annual },
            plan.monthly === null ? 'Custom' : `$${plan.monthly}`),
            plan.monthly !== null && h('span', {}, ' / seat / month')),
          ui('list', { class: 'feature-list' }, plan.features.map(item => h('li', {}, icon('check'), item))),
          btn(plan.cta, `/contact?plan=${plan.id}`, plan.id === 'team' ? 'primary' : 'secondary')))),
      h('p', { class: 'billing-note', 'aria-live': 'polite', 'data-billing-note': '' }, 'Billed monthly. Prices are illustrative.'),
      h('div', { class: 'faq' }, title('Frequently asked questions'),
        ui('accordion', {}, pricingQuestions.map(item => h('details', {}, h('summary', {}, item.question), p(item.answer))))),
    )),
  ]
}

const field = (key, label, control, helper) => ui('form-field', {},
  h('label', { for: key }, label), control, helper && h('small', { id: `${key}-help` }, helper))

function contact(initialPlan) {
  return [
    pageTitle(3, 'Tell us what your team is trying to get done. We’ll show you where Relay could fit.'),
    h('section', { class: 'section' }, container(h('div', { class: 'contact-grid' },
      h('div', { class: 'contact-intro' }, title('What we’ll cover'),
        ui('list', { class: 'feature-list' }, ['Your current process and where work waits', 'How to model it as a Relay workflow', 'A plan that fits your team'].map(item => h('li', {}, icon('check'), item))),
        ui('alert', { variant: 'info' }, 'This is a demo. Form entries stay in your browser and are never sent.')),
      ui('card', { class: 'contact-card' }, h('h2', {}, 'Request a demo'),
        h('form', { 'data-contact-form': '' },
          h('div', { class: 'form-columns' },
            field('full-name', 'Full name', ui('input', { id: 'full-name', name: 'name', autocomplete: 'name', required: true })),
            field('company', 'Company', ui('input', { id: 'company', name: 'company', autocomplete: 'organization', required: true }))),
          field('email', 'Work email', ui('input', { id: 'email', name: 'email', type: 'email', autocomplete: 'email', required: true })),
          field('plan', 'Plan of interest', ui('select', { id: 'plan', name: 'plan', value: initialPlan },
            h('option', { value: '' }, 'Help me choose'), plans.map(plan => h('option', { value: plan.id }, plan.name)))),
          field('message', 'What would you like to improve?',
            h('textarea', { class: 'rd-input', id: 'message', name: 'message', rows: 4, maxlength: 500, 'aria-describedby': 'message-help' }),
            'Optional. Please use fictional details.'),
          ui('button', { variant: 'primary', type: 'submit' }, 'Submit demo request')),
        ui('alert', { variant: 'success', role: 'status', hidden: true, tabindex: -1, 'data-contact-success': '' },
          h('strong', {}, 'Demo request complete.'), p('Nothing was sent. You can try the form again.'),
          h('button', { type: 'button', class: 'rd-link', 'data-contact-reset': '' }, 'Start again'))),
    ))),
  ]
}

export function site(pathname = '/', search = '') {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/workspace' || path === '/workspace/workflows') return [
    h('a', { href: '#main', class: 'skip-link' }, 'Skip to content'),
    dashboard(path === '/workspace/workflows'),
    h('span', { hidden: true, 'data-document-title': (path === '/workspace' ? 'Request inbox' : 'Explore workflows') + ' | Relay workspace' }),
  ]
  const active = routes.find(route => route.path === path)
  const plan = new URLSearchParams(search).get('plan')
  const page = { '/': home, '/solutions': solutions, '/pricing': pricing, '/contact': () => contact(plans.some(item => item.id === plan) ? plan : '') }[path]
  return [
    h('a', { href: '#main', class: 'skip-link' }, 'Skip to content'),
    header(path),
    h('main', { id: 'main', tabindex: -1 }, page ? page() : container(
      h('div', { class: 'section' }, h('h1', {}, 'Page not found'), p('Check the address or return to the home page.'), btn('Back to home', '/')))),
    footer(),
    h('span', { hidden: true, 'data-document-title': active?.label ? `${active.label} | Relay` : 'Page not found | Relay' }),
  ]
}
