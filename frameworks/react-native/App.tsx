import { useContext, useRef, useState } from 'react'
import { Image, Pressable, ScrollView, Text, View } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'
import { features, plans, pricingQuestions, routes, solutionWorkflows } from '../../shared/content.mjs'
import { filterRequests, workflowTemplates, workspaceMetrics, workspaceRequests } from '../../shared/workspace.mjs'
import { Alert, Badge, Body, Button, Card, CTABanner, Heading, Hero, Input, ThemeContext, useTokens, type Theme } from './components'

type Screen = 0 | 1 | 2 | 3 | 4 | 5
type Plan = string
type Navigate = (page: Screen, plan?: Plan) => void

function Home({ go }: { go: Navigate }) {
  const theme = useContext(ThemeContext)
  return <>
    <Hero eyebrow="Workflow software for operations teams" title={routes[0].title}
      subtitle="Relay gives requests, approvals, and handoffs one clear path across your organization.">
      <Button onPress={() => go(3)}>Book a demo</Button>
      <Button variant="secondary" onPress={() => go(1)}>Explore solutions</Button>
    </Hero>
    <Image source={theme === 'blue'
      ? require('../../shared/public/assets/relay-workspace-blue.png')
      : require('../../shared/public/assets/relay-workspace-red.png')}
      accessibilityLabel="Relay workspace dashboard with request metrics and the team request inbox"
      resizeMode="contain" style={{ width: '100%', aspectRatio: 1440 / 1220, borderRadius: 20 }} />
    <Heading>A clearer path from request to done.</Heading>
    {features.map(feature => <Card key={feature.title} header={feature.title}><Body>{feature.body}</Body></Card>)}
  </>
}

function Solutions({ go }: { go: Navigate }) {
  const [tab, setTab] = useState(0)
  const current = solutionWorkflows[tab]
  return <>
    <Hero title={routes[1].title} subtitle="Give each step a clear owner, then see it through to completion." />
    <Segment options={solutionWorkflows.map(workflow => workflow.category)} index={tab} select={setTab} />
    <Card header={current.title}>
      <Body>{current.description}</Body>
      {current.steps.map((step, index) => <Body key={step}>{index + 1}. {step}</Body>)}
    </Card>
    <CTABanner title="Which process would you start with?" subtitle="See what a Relay workflow could look like for your team.">
      <Button onPress={() => go(3)} variant="secondary">Book a demo</Button>
    </CTABanner>
  </>
}

function Pricing({ go }: { go: Navigate }) {
  const [billing, setBilling] = useState(0)
  const [expanded, setExpanded] = useState<number | null>(null)
  return <>
    <Hero title={routes[2].title} subtitle="Use Relay for one team or across your organization." />
    <Segment options={['Monthly', 'Annual']} index={billing} select={setBilling} />
    {plans.map(plan => <Card key={plan.id} header={plan.name} variant={plan.id === 'team' ? 'bordered' : 'default'}>
      <Body>{plan.description}</Body>
      <Heading>{plan.monthly === null ? 'Custom' : `$${billing === 0 ? plan.monthly : plan.annual} / seat / month`}</Heading>
      {plan.features.map(feature => <Body key={feature}>✓  {feature}</Body>)}
      <Button onPress={() => go(3, plan.id)} variant={plan.id === 'team' ? 'primary' : 'secondary'}>{plan.cta}</Button>
    </Card>)}
    <Body>{billing ? 'Billed annually. Prices are illustrative.' : 'Billed monthly. Prices are illustrative.'}</Body>
    <Heading>Frequently asked questions</Heading>
    {pricingQuestions.map(({ question, answer }, index) => <Card key={question}>
      <Pressable accessibilityRole="button" accessibilityState={{ expanded: expanded === index }}
        onPress={() => setExpanded(expanded === index ? null : index)} style={{ minHeight: 44, justifyContent: 'center' }}>
        <Heading>{question}</Heading>
      </Pressable>
      {expanded === index && <Body>{answer}</Body>}
    </Card>)}
  </>
}

function Contact({ plan }: { plan: Plan }) {
  const fields = [
    { key: 'name', label: 'Full name' }, { key: 'company', label: 'Company' }, { key: 'email', label: 'Work email' },
  ] as const
  const [values, setValues] = useState({ name: '', company: '', email: '', message: '' })
  const [errors, setErrors] = useState<Partial<Record<typeof fields[number]['key'], string>>>({})
  const [sent, setSent] = useState(false)
  const [selected, setSelected] = useState(Math.max(0, plans.findIndex(item => item.id === plan) + 1))
  const submit = () => {
    const next: typeof errors = {}
    if (!values.name.trim()) next.name = 'Enter a full name.'
    if (!values.company.trim()) next.company = 'Enter a company.'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) next.email = 'Enter a valid work email.'
    setErrors(next)
    if (Object.keys(next).length) return
    setValues({ name: '', company: '', email: '', message: '' })
    setSent(true)
  }
  return <>
    <Hero title={routes[3].title} subtitle="Tell us what your team is trying to get done." />
    <Alert>This is a demo. Form entries stay on this device and are never sent.</Alert>
    {sent ? <Card header="Demo request complete."><Body>Nothing was sent.</Body>
      <Button onPress={() => setSent(false)}>Start again</Button></Card> :
      <Card header="Request a demo">
        {fields.map(field => <Input key={field.key} label={field.label} value={values[field.key]}
          email={field.key === 'email'} error={errors[field.key]} onChangeText={value => setValues({ ...values, [field.key]: value })} />)}
        <Body>Plan of interest</Body>
        <Segment options={['Any', ...plans.map(item => item.name)]} index={selected} select={setSelected} />
        <Input label="What would you like to improve?" multiline value={values.message}
          onChangeText={message => setValues({ ...values, message })} />
        <Button onPress={submit}>Submit demo request</Button>
      </Card>}
  </>
}

function Segment({ options, index, select }: { options: string[]; index: number; select: (index: number) => void }) {
  const t = useTokens()
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
    {options.map((label, position) => <Pressable key={label} accessibilityRole="button" accessibilityState={{ selected: position === index }}
      onPress={() => select(position)} style={{ minHeight: 44, justifyContent: 'center', paddingHorizontal: 10,
        borderRadius: 18, backgroundColor: position === index ? t.tint : t.surface }}>
      <Text style={{ color: position === index ? t.hover : t.muted, fontWeight: '700', fontSize: 13 }}>{label}</Text>
    </Pressable>)}
  </View>
}

function Workspace() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState(0)
  const [detail, setDetail] = useState<string | null>(null)
  const filtered = filterRequests(workspaceRequests, query, ['all', 'review', 'approved'][status])
  const selected = workspaceRequests.find(request => request.id === detail)
  if (selected) return <>
    <Button variant="secondary" onPress={() => setDetail(null)}>Back to inbox</Button>
    <Card header={selected.name}>
      <Badge variant={selected.tone}>{selected.status}</Badge>
      <Body>{selected.id}</Body>
      <Body>{selected.description}</Body>
      <Body>Team · {selected.team}</Body>
      <Body>Owner · {selected.owner}</Body>
      <Body>Due · {selected.date}</Body>
    </Card>
    <Card header="Latest activity"><Body>{selected.activity}</Body></Card>
  </>
  return <>
    <Heading large>Request inbox</Heading>
    <Body>A shared view of the work moving across your teams.</Body>
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {workspaceMetrics.map(metric => <View key={metric.label} style={{ flex: 1 }}>
        <Card><Body>{metric.label}</Body><Heading>{metric.value}</Heading></Card>
      </View>)}
    </View>
    <Segment options={['All requests', 'Awaiting review', 'Completed']} index={status} select={setStatus} />
    <Input label="Search requests" value={query} onChangeText={setQuery} placeholder="Search name, team or owner" />
    <Body>{filtered.length} {filtered.length === 1 ? 'request' : 'requests'}</Body>
    {filtered.map((request: typeof workspaceRequests[number]) => <Card key={request.id} header={request.name}>
      <Badge variant={request.tone}>{request.status}</Badge>
      <Body>{request.team} · {request.id}</Body>
      <Button variant="secondary" onPress={() => setDetail(request.id)}>View request</Button>
    </Card>)}
    {filtered.length === 0 && <Card header="No requests found">
      <Body>Try a different search or request status.</Body>
      <Button variant="secondary" onPress={() => { setQuery(''); setStatus(0) }}>Clear filters</Button>
    </Card>}
    <Body>Example workspace · illustrative data</Body>
  </>
}

function Workflows() {
  const [search, setSearch] = useState('')
  const [team, setTeam] = useState(0)
  const [preview, setPreview] = useState<string | null>(null)
  const teams = ['All teams', 'Procurement', 'IT operations', 'Product ops']
  const selected = workflowTemplates.find(template => template.id === preview)
  const visible = workflowTemplates.filter(template =>
    [template.title, template.description, template.team].join(' ').toLowerCase().includes(search.trim().toLowerCase())
    && (team === 0 || template.team === teams[team]))
  if (selected) return <>
    <Button variant="secondary" onPress={() => setPreview(null)}>Back to workflows</Button>
    <Card header={selected.title}>
      <Badge variant="brand">{selected.team}</Badge>
      <Body>{selected.description}</Body>
      <Heading>How it works</Heading>
      {selected.steps.map((step, index) => <Body key={step}>{index + 1}. {step}</Body>)}
    </Card>
    <Card header="Expected outcome"><Body>{selected.outcome}</Body></Card>
  </>
  return <>
    <Heading large>Explore workflows</Heading>
    <Body>Start with a proven structure for the work your team handles every day.</Body>
    <Input label="Search workflows" value={search} onChangeText={setSearch} placeholder="Search templates or teams" />
    <Segment options={teams} index={team} select={setTeam} />
    <Body>{visible.length} {visible.length === 1 ? 'template' : 'templates'}</Body>
    {visible.map(template => <Card key={template.id} header={template.title}>
      <Badge variant="brand">{template.team}</Badge>
      <Body>{template.description}</Body>
      <Body>3 steps · Request, review, complete</Body>
      <Button variant="secondary" onPress={() => setPreview(template.id)}>View {template.title.toLowerCase()}</Button>
    </Card>)}
    {visible.length === 0 && <Card header="No workflows found">
      <Body>Try another search or choose a different team.</Body>
      <Button variant="secondary" onPress={() => { setSearch(''); setTeam(0) }}>Clear filters</Button>
    </Card>}
  </>
}

function Demo({ theme, setTheme }: { theme: Theme; setTheme: (theme: Theme) => void }) {
  const t = useTokens()
  const [screen, setScreen] = useState<Screen>(0)
  const [plan, setPlan] = useState<Plan>('')
  const scroll = useRef<ScrollView>(null)
  const go: Navigate = (page, choice = '') => {
    setPlan(choice)
    setScreen(page)
    scroll.current?.scrollTo({ y: 0, animated: false })
  }
  return <SafeAreaView style={{ flex: 1, backgroundColor: t.paper }} edges={['top', 'bottom', 'left', 'right']}>
    <View style={{ alignItems: 'center', justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 6 }}>
      <Text style={{ fontSize: 25, fontWeight: '900', color: t.hover }}>Relay</Text>
      <Segment options={['Red', 'Blue']} index={theme === 'red' ? 0 : 1} select={index => setTheme(index === 0 ? 'red' : 'blue')} />
      <Button variant="ghost" size="sm" onPress={() => go(screen >= 4 ? 0 : 4)}>{screen >= 4 ? 'Website' : 'Log in'}</Button>
    </View>
    <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
      {screen >= 4
        ? <Segment options={['Request inbox', 'Explore workflows']} index={screen - 4} select={index => go((index + 4) as Screen)} />
        : <Segment options={routes.map(route => route.label)} index={screen} select={index => go(index as Screen)} />}
    </View>
    <ScrollView ref={scroll} keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}>
      {screen === 0 && <Home go={go} />}
      {screen === 1 && <Solutions go={go} />}
      {screen === 2 && <Pricing go={go} />}
      {screen === 3 && <Contact key={plan} plan={plan} />}
      {screen === 4 && <Workspace />}
      {screen === 5 && <Workflows />}
    </ScrollView>
  </SafeAreaView>
}

export default function App() {
  const [theme, setTheme] = useState<Theme>('red')
  return <SafeAreaProvider><ThemeContext.Provider value={theme}>
    <Demo theme={theme} setTheme={setTheme} />
  </ThemeContext.Provider></SafeAreaProvider>
}
