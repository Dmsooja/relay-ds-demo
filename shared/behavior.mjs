import { workflowTemplates, workspaceRequests } from './workspace.mjs'

export function mountBehavior(root) {
  const document = root.ownerDocument
  const window = document.defaultView
  const listeners = new window.AbortController()
  const options = { signal: listeners.signal }
  const parent = document.documentElement
  const selectTheme = theme => {
    parent.dataset.theme = theme
    root.querySelectorAll('[data-product-preview]').forEach(image =>
      image.setAttribute('src', '/assets/relay-workspace-' + theme + '.png'))
    root.querySelectorAll('[data-theme-choice]').forEach(button =>
      button.setAttribute('aria-pressed', String(button.dataset.themeChoice === theme)))
  }
  let stored
  try { stored = window.localStorage.getItem('relay-demo-theme') } catch { /* optional storage */ }
  selectTheme(stored === 'blue' ? 'blue' : 'red')
  const pageTitle = root.querySelector('[data-document-title]')?.dataset.documentTitle
  if (pageTitle) document.title = pageTitle

  function setMenu(open, toggle) {
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
    document.getElementById('main-navigation')?.classList.toggle('is-open', open)
  }

  function selectTab(tab) {
    tab.closest('[role="tablist"]').querySelectorAll('[role="tab"]').forEach(button => {
      const selected = button === tab
      button.setAttribute('aria-selected', String(selected))
      button.tabIndex = selected ? 0 : -1
      const panel = document.getElementById(button.getAttribute('aria-controls'))
      if (panel && !tab.dataset.requestFilter) panel.hidden = !selected
    })
    if (tab.dataset.requestFilter) {
      document.getElementById('request-panel').setAttribute('aria-labelledby', tab.id)
      updateRequests()
    }
  }

  function updateRequests() {
    const query = root.querySelector('[data-request-search]')?.value.trim().toLowerCase() ?? ''
    const status = root.querySelector('[data-request-filter][aria-selected="true"]')?.dataset.requestFilter ?? 'all'
    let count = 0
    root.querySelectorAll('[data-request-row]').forEach(row => {
      const statusMatch = status === 'all' || row.dataset.requestStatus === (status === 'review' ? 'In review' : 'Approved')
      row.hidden = !statusMatch || !row.dataset.searchText.includes(query)
      if (!row.hidden) count++
    })
    const counter = root.querySelector('[data-request-count]')
    if (counter) counter.textContent = count + (count === 1 ? ' request' : ' requests')
    const empty = root.querySelector('[data-request-empty]')
    if (empty) empty.hidden = count > 0
  }

  root.addEventListener('input', event => {
    if (event.target.matches('[data-request-search]')) updateRequests()
    if (event.target.matches('[data-workflow-search]')) updateWorkflows()
  }, options)

  function updateWorkflows() {
    const search = root.querySelector('[data-workflow-search]').value.trim().toLowerCase()
    const team = root.querySelector('[data-workflow-team]').value
    let count = 0
    root.querySelectorAll('[data-workflow-card]').forEach(card => {
      card.hidden = !card.dataset.workflowText.includes(search)
        || (team !== 'All teams' && card.dataset.workflowTeamName !== team)
      if (!card.hidden) count++
    })
    root.querySelector('[data-workflow-count]').textContent = count + (count === 1 ? ' template' : ' templates')
    root.querySelector('[data-workflow-empty]').hidden = count > 0
  }

  root.addEventListener('change', event => {
    if (event.target.matches('[data-workflow-team]')) updateWorkflows()
  }, options)

  root.addEventListener('click', event => {
    const button = event.target.closest?.('button')
    if (!button) return
    if (button.dataset.themeChoice) {
      const theme = button.dataset.themeChoice
      selectTheme(theme)
      try { window.localStorage.setItem('relay-demo-theme', theme) } catch { /* optional storage */ }
    }
    if (button.hasAttribute('data-menu')) setMenu(button.getAttribute('aria-expanded') !== 'true', button)
    if (button.matches('[role="tab"]')) selectTab(button)
    if (button.hasAttribute('data-workflow-clear')) {
      root.querySelector('[data-workflow-search]').value = ''
      root.querySelector('[data-workflow-team]').value = 'All teams'
      updateWorkflows()
      root.querySelector('[data-workflow-search]').focus()
    }
    if (button.dataset.workflowPreview) {
      const template = workflowTemplates.find(item => item.id === button.dataset.workflowPreview)
      if (template) {
        for (const key of ['title', 'description', 'outcome']) root.querySelector('[data-workflow-' + key + ']').textContent = template[key]
        root.querySelector('[data-workflow-team-label]').textContent = template.team
        root.querySelectorAll('[data-workflow-step]').forEach((step, index) => { step.textContent = template.steps[index] })
        root.querySelector('.workflow-dialog').showModal()
      }
    }
    if (button.hasAttribute('data-workflow-close')) root.querySelector('.workflow-dialog').close()
    if (button.hasAttribute('data-clear-search')) {
      const search = root.querySelector('[data-request-search]')
      search.value = ''
      selectTab(root.querySelector('[data-request-filter="all"]'))
      search.focus()
    }
    if (button.dataset.requestDetail) {
      const request = workspaceRequests.find(item => item.id === button.dataset.requestDetail)
      if (request) {
        for (const key of ['title', 'id', 'description', 'team', 'owner', 'date', 'activity']) {
          root.querySelector('[data-detail-' + key + ']').textContent = request[key === 'title' ? 'name' : key]
        }
        const status = root.querySelector('[data-detail-status]')
        status.textContent = request.status
        status.className = 'rd-badge is-' + request.tone
        root.querySelector('.request-dialog').showModal()
      }
    }
    if (button.hasAttribute('data-close-request')) root.querySelector('.request-dialog').close()
    if (button.dataset.billing) {
      const period = button.dataset.billing
      root.querySelectorAll('[data-billing]').forEach(item =>
        item.setAttribute('aria-pressed', String(item === button)))
      root.querySelectorAll('[data-monthly][data-annual]').forEach(item => {
        item.textContent = `$${item.dataset[period]}`
      })
      root.querySelector('[data-billing-note]').textContent = period === 'annual'
        ? 'Billed annually. Prices are illustrative.' : 'Billed monthly. Prices are illustrative.'
    }
    if (button.hasAttribute('data-contact-reset')) {
      const form = root.querySelector('[data-contact-form]')
      root.querySelector('[data-contact-success]').hidden = true
      form.hidden = false
      form.elements.namedItem('name').focus()
    }
  }, options)

  root.addEventListener('keydown', event => {
    const button = event.target.closest?.('[role="tab"]')
    if (event.key === 'Escape') {
      const menu = root.querySelector('[data-menu][aria-expanded="true"]')
      if (menu) { setMenu(false, menu); menu.focus() }
    }
    if (!button) return
    const tabs = [...button.closest('[role="tablist"]').querySelectorAll('[role="tab"]')]
    const index = tabs.indexOf(button)
    const target = { Home: 0, End: tabs.length - 1, ArrowRight: (index + 1) % tabs.length, ArrowLeft: (index + tabs.length - 1) % tabs.length }[event.key]
    if (target === undefined) return
    event.preventDefault()
    selectTab(tabs[target])
    tabs[target].focus()
  }, options)

  root.addEventListener('submit', event => {
    const form = event.target
    if (!form.matches('[data-contact-form]')) return
    event.preventDefault()
    if (!form.reportValidity()) return
    form.reset()
    form.hidden = true
    const result = root.querySelector('[data-contact-success]')
    result.hidden = false
    result.focus()
  }, options)
  return () => listeners.abort()
}
