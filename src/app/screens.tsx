import { useState, type FormEvent, type ReactNode } from 'react'
import { useNavigate } from 'react-router'
import {
  Activity, ArrowLeft, Bell, Building2, CalendarDays, Check, CheckCircle2, ChevronRight, CircleHelp,
  Clock3, Droplet, Eye, EyeOff, FileText, HeartHandshake, History, LockKeyhole, MapPin, MessageCircle,
  Phone, Plus, Search, Settings, ShieldCheck, Sparkles, TriangleAlert, UserRound, UsersRound,
} from 'lucide-react'
import { Avatar, Badge, Button, Card, EmptyState, Field, IconButton, Logo, PageHeader, SectionTitle, SelectField, Stat, TextArea } from './ui'
import { type BloodRequest, type Role, useStore } from './store'

export function Splash() {
  const navigate = useNavigate()
  return <div className="auth-shell splash">
    <div className="splash-glow one" /><div className="splash-glow two" />
    <div className="splash-content"><div className="splash-logo"><Droplet fill="currentColor" size={45} /></div><Logo />
      <p>Connecting donors with people in need—quickly, privately and compassionately.</p>
    </div>
    <div className="splash-footer"><div className="trust-line"><ShieldCheck size={16} /> Privacy-first demo experience</div><Button className="full" onClick={() => navigate('/login')}>Get Started <ChevronRight size={18} /></Button><small>Frontend prototype · Sample data only</small></div>
  </div>
}

export function Login() {
  const navigate = useNavigate()
  const { setRole } = useStore()
  const [email, setEmail] = useState('aarav@example.com')
  const [password, setPassword] = useState('demo123')
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!email || password.length < 6) return setError('Enter a valid email or phone and at least 6 password characters.')
    const role: Role = email.toLowerCase() === 'admin@raktsetu.demo' ? 'admin' : email.toLowerCase().includes('recipient') ? 'recipient' : 'donor'
    setRole(role); navigate('/app/home')
  }
  return <div className="auth-shell auth-page"><div className="auth-top"><IconButton label="Back" onClick={() => navigate('/')}><ArrowLeft size={20} /></IconButton><Logo compact /></div>
    <div className="auth-copy"><Badge>Welcome back</Badge><h1>Continue saving lives.</h1><p>Sign in to your secure RaktSetu demo account.</p></div>
    <form onSubmit={submit} className="auth-form">
      <Field label="Email or phone number" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
      <div className="password-field"><Field label="Password" value={password} onChange={(e) => setPassword(e.target.value)} type={show ? 'text' : 'password'} /><button type="button" onClick={() => setShow(!show)}>{show ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
      <div className="form-meta"><label><input type="checkbox" defaultChecked /> Remember me</label><button type="button" onClick={() => setError('Password reset is simulated. Check your demo inbox.')}>Forgot password?</button></div>
      {error && <div className="form-error">{error}</div>}
      <Button type="submit" className="full">Sign in</Button>
      <div className="demo-accounts"><strong>Demo access</strong><button type="button" onClick={() => setEmail('recipient@example.com')}>Recipient</button><button type="button" onClick={() => setEmail('admin@raktsetu.demo')}>Admin</button></div>
    </form>
    <p className="auth-switch">New to RaktSetu? <button onClick={() => navigate('/signup')}>Create account</button></p>
  </div>
}

export function Signup() {
  const navigate = useNavigate()
  const { setRole, updateProfile } = useStore()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirm: '', city: 'New Delhi', role: 'donor' as 'donor' | 'recipient', bloodGroup: 'O+', terms: false })
  const [error, setError] = useState('')
  const update = (key: string, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }))
  const next = () => {
    if (!form.name || !form.email || !form.phone) return setError('Please complete all personal details.')
    setError(''); setStep(2)
  }
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (form.password.length < 6 || form.password !== form.confirm) return setError('Passwords must match and contain at least 6 characters.')
    if (!form.terms) return setError('Please accept the terms to continue.')
    updateProfile({ name: form.name, email: form.email, phone: form.phone, city: form.city, bloodGroup: form.bloodGroup })
    setRole(form.role); navigate('/app/home')
  }
  return <div className="auth-shell auth-page"><div className="auth-top"><IconButton label="Back" onClick={() => step === 2 ? setStep(1) : navigate('/login')}><ArrowLeft size={20} /></IconButton><span className="step-label">Step {step} of 2</span></div>
    <div className="auth-copy"><h1>{step === 1 ? 'Create your account.' : 'Make it secure.'}</h1><p>{step === 1 ? 'Tell us who you are and how you want to help.' : 'Set your password and review your details.'}</p></div>
    <form onSubmit={submit} className="auth-form">
      {step === 1 ? <><Field label="Full name" value={form.name} onChange={(e) => update('name', e.target.value)} placeholder="Your full name" /><Field label="Email" type="email" value={form.email} onChange={(e) => update('email', e.target.value)} placeholder="you@example.com" /><Field label="Phone number" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="+91 98765 43210" /><Field label="City" value={form.city} onChange={(e) => update('city', e.target.value)} />
        <div className="role-select"><span>I want to join as</span><div><button type="button" className={form.role === 'donor' ? 'active' : ''} onClick={() => update('role', 'donor')}><Droplet size={21} /> Donor</button><button type="button" className={form.role === 'recipient' ? 'active' : ''} onClick={() => update('role', 'recipient')}><HeartHandshake size={21} /> Recipient</button></div></div>
        {form.role === 'donor' && <SelectField label="Blood group" value={form.bloodGroup} onChange={(value) => update('bloodGroup', value)}>{['O+', 'O−', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−'].map((group) => <option key={group}>{group}</option>)}</SelectField>}
        {error && <div className="form-error">{error}</div>}<Button type="button" className="full" onClick={next}>Continue</Button>
      </> : <><Field label="Password" type="password" value={form.password} onChange={(e) => update('password', e.target.value)} placeholder="Minimum 6 characters" /><Field label="Confirm password" type="password" value={form.confirm} onChange={(e) => update('confirm', e.target.value)} /><label className="terms"><input type="checkbox" checked={form.terms} onChange={(e) => update('terms', e.target.checked)} /><span>I agree to the Terms and Privacy Policy. This is a frontend demo with sample data.</span></label>{error && <div className="form-error">{error}</div>}<Button type="submit" className="full">Create account</Button></>}
    </form>
  </div>
}

export function Home() {
  const { role } = useStore()
  if (role === 'admin') return <AdminHome />
  return role === 'recipient' ? <RecipientHome /> : <DonorHome />
}

function DonorHome() {
  const navigate = useNavigate()
  const { profile, available, setAvailable, requests } = useStore()
  return <div className="screen">
    <div className="greeting"><div><span>Good morning,</span><h1>{profile.name.split(' ')[0]}</h1></div><Avatar name={profile.name} /></div>
    <Card className="hero-card"><div className="hero-art"><Droplet fill="currentColor" /></div><Badge tone="rose">Ready to make an impact?</Badge><h2>Your kindness can save a life.</h2><p>Three verified requests near you match your blood group.</p><Button variant="secondary" onClick={() => navigate('/app/requests')}>Explore Blood Requests <ChevronRight size={17} /></Button></Card>
    <Card className="availability"><div><div className="availability-title"><i className={available ? 'online' : ''} /> Donor availability</div><p>{available ? 'Visible to nearby recipients' : 'Your profile is temporarily hidden'}</p></div><button className={available ? 'switch on' : 'switch'} onClick={() => setAvailable(!available)} aria-label="Toggle donor availability"><span /></button></Card>
    <div className="stat-grid three"><Stat value={profile.bloodGroup} label="Blood group" icon={Droplet} /><Stat value="08" label="Donations" icon={HeartHandshake} /><Stat value="12" label="Lives helped" icon={Sparkles} /></div>
    <SectionTitle title="Quick actions" />
    <div className="quick-grid">{[
      [MapPin, 'Nearby', '/app/map'], [History, 'History', '/app/history'], [UserRound, 'My profile', '/app/profile'], [Bell, 'Alerts', '/app/alerts'],
    ].map(([Icon, label, to]) => <button key={label as string} onClick={() => navigate(to as string)}><span><Icon size={21} /></span>{label as string}</button>)}</div>
    <SectionTitle title="Urgent near you" action="See all" onAction={() => navigate('/app/requests')} />
    <RequestCard request={requests[0]} onAction={() => navigate('/app/requests')} />
    <div className="demo-note"><ShieldCheck size={17} /><span>Locations, donors and requests shown are sample demo data—not live services.</span></div>
  </div>
}

function RecipientHome() {
  const navigate = useNavigate()
  const { profile, requests } = useStore()
  const active = requests.filter((request) => !['Completed', 'Cancelled'].includes(request.status))
  return <div className="screen">
    <div className="greeting"><div><span>Good morning,</span><h1>{profile.name.split(' ')[0]}</h1></div><Avatar name={profile.name} /></div>
    <Card className="emergency-card"><div className="emergency-icon"><Droplet fill="currentColor" /></div><div><Badge>Need blood?</Badge><h2>Create an emergency request</h2><p>Share private details with suitable nearby demo donors.</p></div><Button onClick={() => navigate('/app/new-request')}>Create Blood Request <Plus size={18} /></Button></Card>
    <div className="stat-grid"><Stat value={String(active.length)} label="Active requests" /><Stat value="07" label="Matched donors" /><Stat value="03" label="Responses" /></div>
    <SectionTitle title="Active request" action="View all" onAction={() => navigate('/app/requests')} />
    {active[0] ? <Card className="tracking-card"><div className="tracking-top"><div><Badge tone={active[0].urgency === 'Critical' ? 'rose' : 'amber'}>{active[0].urgency}</Badge><h3>{active[0].bloodGroup} blood · {active[0].units} units</h3><p>{active[0].hospital}</p></div><div className="match-ring">7<span>matches</span></div></div><div className="progress-track"><i /><i /><i /><i /></div><div className="progress-labels"><span>Created</span><span>Matching</span><span>Accepted</span><span>Complete</span></div><Button variant="secondary" className="full" onClick={() => navigate('/app/requests')}>Track request</Button></Card> : <EmptyState title="No active requests" body="Create a request when blood is needed." />}
    <SectionTitle title="Nearby available donors" action="View map" onAction={() => navigate('/app/map')} />
    <div className="donor-strip">{[['PS', 'O+', '1.2 km'], ['RM', 'B+', '2.7 km'], ['AK', 'O+', '3.1 km']].map(([name, group, distance]) => <Card key={name} className="mini-donor"><Avatar name={name} size="sm" /><strong>{group}</strong><span>{distance}</span><i /></Card>)}</div>
    <div className="disclaimer">Donor matching is preliminary discovery only. Medical compatibility must be confirmed by qualified professionals.</div>
  </div>
}

function AdminHome() {
  const navigate = useNavigate()
  return <div className="screen">
    <PageHeader title="Platform overview" subtitle="Demo administration · Today" action={<Avatar name="Platform Admin" />} />
    <Card className="admin-hero"><div><Badge tone="green">All systems normal</Badge><h2>Community impact</h2><p>RaktSetu demo network activity in the last 30 days.</p></div><div className="impact-number">328<span>connections</span></div></Card>
    <div className="stat-grid admin-stats"><Stat value="2,480" label="Total users" icon={UsersRound} /><Stat value="1,642" label="Donors" icon={Droplet} /><Stat value="838" label="Recipients" icon={UserRound} /><Stat value="46" label="Active requests" icon={Activity} /></div>
    <SectionTitle title="Request activity" />
    <Card className="chart-card"><div className="chart-legend"><span><i /> Requests</span><strong>+18.4%</strong></div><div className="bars">{[45, 66, 52, 84, 72, 94, 76].map((height, index) => <i key={index} style={{ height: `${height}%` }} />)}</div><div className="axis"><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span></div></Card>
    <SectionTitle title="Needs attention" />
    <div className="admin-actions"><button onClick={() => navigate('/app/users')}><span><UserRound size={20} /></span><div><strong>Donor reviews</strong><small>12 profiles pending</small></div><Badge tone="amber">12</Badge></button><button onClick={() => navigate('/app/requests')}><span><TriangleAlert size={20} /></span><div><strong>Emergency requests</strong><small>8 currently active</small></div><Badge>8</Badge></button><button onClick={() => navigate('/app/facilities')}><span><Building2 size={20} /></span><div><strong>Facility directory</strong><small>3 changes to review</small></div><ChevronRight size={18} /></button></div>
  </div>
}

function RequestCard({ request, onAction, actions }: { request: BloodRequest; onAction?: () => void; actions?: ReactNode }) {
  if (!request) return null
  return <Card className="request-card"><div className="request-top"><div className="blood-orb">{request.bloodGroup}</div><div><div className="request-badges"><Badge tone={request.urgency === 'Critical' ? 'rose' : request.urgency === 'Urgent' ? 'amber' : 'grey'}>{request.urgency}</Badge><span>{request.distance}</span></div><h3>{request.hospital}</h3><p>{request.city} · {request.units} unit{request.units > 1 ? 's' : ''} · {request.date}</p></div></div><div className="request-bottom"><span>ID {request.id} · {request.status}</span>{actions || <Button variant="secondary" onClick={onAction}>View details</Button>}</div></Card>
}

export function Requests() {
  const { role, requests, updateRequest } = useStore()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('Active')
  const shown = filter === 'All' ? requests : filter === 'History' ? requests.filter((r) => ['Completed', 'Cancelled'].includes(r.status)) : requests.filter((r) => !['Completed', 'Cancelled'].includes(r.status))
  return <div className="screen">
    <PageHeader title={role === 'donor' ? 'Blood requests' : 'My requests'} subtitle={role === 'admin' ? 'Review and monitor demo requests' : 'Sample data · Updated moments ago'} action={role === 'recipient' ? <IconButton label="Create request" onClick={() => navigate('/app/new-request')}><Plus size={20} /></IconButton> : undefined} />
    <div className="segmented">{['Active', 'History', 'All'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
    {shown.length ? <div className="request-list">{shown.map((request) => <RequestCard key={request.id} request={request} actions={
      role === 'donor' && request.status === 'Matching' ? <div className="inline-actions"><Button variant="ghost" onClick={() => updateRequest(request.id, 'Cancelled')}>Decline</Button><Button onClick={() => updateRequest(request.id, 'Donor accepted')}>Accept</Button></div> :
      role === 'recipient' && !['Completed', 'Cancelled'].includes(request.status) ? <Button variant="ghost" onClick={() => updateRequest(request.id, 'Cancelled')}>Cancel</Button> :
      <Badge tone={request.status === 'Completed' ? 'green' : 'grey'}>{request.status}</Badge>
    } />)}</div> : <EmptyState title="Nothing here yet" body="Requests in this category will appear here." />}
  </div>
}

export function NewRequest() {
  const navigate = useNavigate()
  const { addRequest } = useStore()
  const [confirmation, setConfirmation] = useState('')
  const [error, setError] = useState('')
  const [form, setForm] = useState({ patient: '', bloodGroup: 'O+', units: '1', hospital: '', address: '', city: 'New Delhi', date: '', urgency: 'Urgent' as 'Normal' | 'Urgent' | 'Critical', contact: '', notes: '' })
  const update = (key: string, value: string) => setForm((current) => ({ ...current, [key]: value }))
  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.patient || !form.hospital || !form.address || !form.date || !form.contact) return setError('Please complete all required fields.')
    const id = addRequest({ patient: form.patient, bloodGroup: form.bloodGroup, units: Number(form.units), hospital: form.hospital, city: form.city, date: form.date, urgency: form.urgency, contact: form.contact, notes: form.notes })
    setConfirmation(id)
  }
  if (confirmation) return <div className="screen confirmation"><div className="success-icon"><Check size={34} /></div><Badge tone="green">Request created</Badge><h1>We’re finding suitable donors.</h1><p>Your private demo request has been shared with preliminary matches.</p><Card><span>Demo request ID</span><strong>{confirmation}</strong><div className="detail-row"><span>Status</span><Badge tone="amber">Matching</Badge></div></Card><div className="disclaimer">This prototype does not send real alerts or contact live donors. Contact emergency services or your hospital for urgent medical help.</div><Button className="full" onClick={() => navigate('/app/requests')}>Track request</Button><Button variant="ghost" onClick={() => navigate('/app/home')}>Back to home</Button></div>
  return <div className="screen form-screen"><div className="back-title"><IconButton label="Back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></IconButton><div><h1>Blood request</h1><p>Patient details remain private</p></div></div>
    <form onSubmit={submit}><SectionTitle title="Patient & requirement" /><Field label="Patient name *" value={form.patient} onChange={(e) => update('patient', e.target.value)} placeholder="Full name" /><div className="form-row"><SelectField label="Blood group *" value={form.bloodGroup} onChange={(value) => update('bloodGroup', value)}>{['O+', 'O−', 'A+', 'A−', 'B+', 'B−', 'AB+', 'AB−'].map((group) => <option key={group}>{group}</option>)}</SelectField><SelectField label="Units *" value={form.units} onChange={(value) => update('units', value)}>{['1', '2', '3', '4', '5'].map((unit) => <option key={unit}>{unit}</option>)}</SelectField></div>
      <SectionTitle title="Hospital details" /><Field label="Hospital name *" value={form.hospital} onChange={(e) => update('hospital', e.target.value)} /><Field label="Hospital address *" value={form.address} onChange={(e) => update('address', e.target.value)} /><Field label="City *" value={form.city} onChange={(e) => update('city', e.target.value)} /><Button type="button" variant="secondary" className="full" onClick={() => navigate('/app/map')}><MapPin size={18} /> Select approximate location on map</Button>
      <SectionTitle title="Timing & contact" /><Field label="Required date *" type="date" value={form.date} onChange={(e) => update('date', e.target.value)} /><SelectField label="Urgency *" value={form.urgency} onChange={(value) => update('urgency', value)}>{['Normal', 'Urgent', 'Critical'].map((urgency) => <option key={urgency}>{urgency}</option>)}</SelectField><Field label="Contact number *" value={form.contact} onChange={(e) => update('contact', e.target.value)} /><TextArea label="Additional notes" value={form.notes} onChange={(value) => update('notes', value)} placeholder="Optional care-team instructions" />
      {error && <div className="form-error">{error}</div>}<div className="privacy-callout"><LockKeyhole size={18} /><span>Only essential details are shown to matched donors.</span></div><Button type="submit" className="full">Submit demo request</Button></form>
  </div>
}

export function Alerts() {
  const { notifications, markAllRead, markRead } = useStore()
  return <div className="screen"><PageHeader title="Notifications" subtitle="Demo alerts—not push notifications" action={<Button variant="ghost" onClick={markAllRead}>Mark all read</Button>} />
    <div className="notification-list">{notifications.map((item) => <button key={item.id} className={item.read ? 'notification read' : 'notification'} onClick={() => markRead(item.id)}><span className={`notification-icon ${item.type}`}>{item.type === 'success' ? <CheckCircle2 size={19} /> : item.type === 'alert' ? <TriangleAlert size={19} /> : item.type === 'reminder' ? <Clock3 size={19} /> : <Droplet size={19} />}</span><div><strong>{item.title}</strong><p>{item.body}</p><small>{item.time} ago</small></div>{!item.read && <i />}</button>)}</div>
  </div>
}

export function HistoryScreen() {
  return <div className="screen"><PageHeader title="Donation history" subtitle="Your impact over time" /><Card className="history-summary"><HeartHandshake size={25} /><div><strong>8 donations</strong><span>Up to 24 lives positively impacted</span></div></Card><div className="stat-grid"><Stat value="2.8 L" label="Blood donated" /><Stat value="04" label="This year" /><Stat value="Gold" label="Donor level" /></div><SectionTitle title="Timeline" /><div className="timeline">{[['18 Mar 2025', 'O+', 'Rotary Blood Centre', 'Completed'], ['02 Nov 2024', 'O+', 'Apollo Hospital', 'Completed'], ['20 Jul 2024', 'O+', 'Red Cross Camp', 'Completed']].map((item) => <div className="timeline-item" key={item[0]}><i /><Card><div><strong>{item[2]}</strong><span>{item[0]} · {item[1]}</span></div><Badge tone="green">{item[3]}</Badge></Card></div>)}</div></div>
}

export function Profile() {
  const navigate = useNavigate()
  const { role, profile, updateProfile, setRole, available, setAvailable } = useStore()
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(profile)
  const save = () => { updateProfile(draft); setEditing(false) }
  return <div className="screen profile-screen"><PageHeader title={role === 'admin' ? 'Admin profile' : 'My profile'} action={<IconButton label="Settings" onClick={() => navigate('/app/settings')}><Settings size={20} /></IconButton>} />
    <div className="profile-hero"><Avatar name={profile.name} size="lg" /><h2>{profile.name}</h2><p>{role === 'admin' ? 'Authorized demo administrator' : `${profile.city} · Member since 2023`}</p>{role === 'donor' && <Badge tone="green"><ShieldCheck size={13} /> Demo verified donor</Badge>}</div>
    {editing ? <Card className="edit-form"><Field label="Full name" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /><Field label="Email" value={draft.email} onChange={(e) => setDraft({ ...draft, email: e.target.value })} /><Field label="Phone" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /><Field label="City" value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /><div className="button-pair"><Button variant="ghost" onClick={() => setEditing(false)}>Cancel</Button><Button onClick={save}>Save profile</Button></div></Card> : <>
      {role === 'donor' && <div className="stat-grid"><Stat value={profile.bloodGroup} label="Blood group" /><Stat value="18 Mar" label="Last donation" /><Stat value={available ? 'On' : 'Off'} label="Available" /></div>}
      <Card className="profile-details"><div><span>Email</span><strong>{profile.email}</strong></div><div><span>Phone</span><strong>{profile.phone}</strong></div><div><span>City</span><strong>{profile.city}</strong></div></Card><Button variant="secondary" className="full" onClick={() => setEditing(true)}>Edit profile</Button>
    </>}
    <div className="settings-list"><button onClick={() => navigate('/app/history')}><History size={19} /><span>Donation & request history</span><ChevronRight size={18} /></button><button onClick={() => navigate('/app/settings')}><LockKeyhole size={19} /><span>Account & privacy</span><ChevronRight size={18} /></button><button onClick={() => navigate('/app/help')}><CircleHelp size={19} /><span>Help & support</span><ChevronRight size={18} /></button><button className="logout" onClick={() => { setRole(null); navigate('/login') }}><ArrowLeft size={19} /><span>Log out</span></button></div>
  </div>
}

export function SettingsScreen() {
  const navigate = useNavigate()
  const [toggles, setToggles] = useState({ requests: true, updates: true, reminders: false, biometric: false })
  const toggle = (key: keyof typeof toggles) => setToggles((all) => ({ ...all, [key]: !all[key] }))
  return <div className="screen"><div className="back-title"><IconButton label="Back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></IconButton><div><h1>Settings</h1><p>Privacy and preferences</p></div></div><SectionTitle title="Demo notifications" /><Card className="toggle-list">{Object.entries(toggles).map(([key, value]) => <div key={key}><span>{key === 'requests' ? 'Nearby blood requests' : key === 'updates' ? 'Request status updates' : key === 'reminders' ? 'Donation reminders' : 'Biometric sign-in demo'}</span><button className={value ? 'switch on' : 'switch'} onClick={() => toggle(key as keyof typeof toggles)}><span /></button></div>)}</Card><SectionTitle title="Information" /><div className="settings-list standalone">{[['About RaktSetu', 'Connecting Donors. Saving Lives.'], ['Privacy policy', 'How this demo protects data'], ['Terms & conditions', 'Prototype usage terms'], ['Emergency information', 'When to contact emergency services']].map(([title, subtitle]) => <button key={title} onClick={() => navigate(`/app/info?section=${encodeURIComponent(title)}`)}><FileText size={19} /><span>{title}<small>{subtitle}</small></span><ChevronRight size={18} /></button>)}</div><Button variant="secondary" className="full" onClick={() => window.alert('Demo password change flow opened. No account credentials are changed.')}>Change password demo</Button></div>
}

export function HelpScreen() {
  const [open, setOpen] = useState(0)
  return <div className="screen"><PageHeader title="Help & support" subtitle="Answers for the RaktSetu demo" /><div className="support-card"><MessageCircle size={25} /><h2>How can we help?</h2><p>Browse common questions or contact the demo support team.</p><Button onClick={() => window.alert('Support message created locally. No message was sent.')}>Contact support</Button></div><SectionTitle title="Frequently asked questions" /><div className="faq">{['Is donor matching medically approved?', 'Are map locations live?', 'How is patient privacy protected?', 'Can I use RaktSetu in an emergency?'].map((question, index) => <button key={question} onClick={() => setOpen(open === index ? -1 : index)}><strong>{question}</strong><ChevronRight className={open === index ? 'rotate' : ''} size={18} />{open === index && <span>{index === 0 ? 'No. Matching is preliminary discovery; qualified medical professionals must confirm compatibility and eligibility.' : index === 1 ? 'No. All current locations are clearly labelled sample coordinates for this frontend prototype.' : index === 2 ? 'The prototype displays privacy-safe names and approximate locations rather than exact donor home addresses.' : 'Always contact local emergency services and the treating hospital for urgent medical assistance.'}</span>}</button>)}</div><div className="emergency-info"><Phone size={19} /><div><strong>Medical emergency?</strong><span>Contact local emergency services immediately. Do not rely on this prototype.</span></div></div></div>
}

export function InfoScreen() {
  const params = new URLSearchParams(location.search)
  const section = params.get('section') || 'About RaktSetu'
  const navigate = useNavigate()
  return <div className="screen info-screen"><div className="back-title"><IconButton label="Back" onClick={() => navigate(-1)}><ArrowLeft size={20} /></IconButton><div><h1>{section}</h1><p>RaktSetu demo information</p></div></div><Logo /><Card><h2>Connecting Donors. Saving Lives.</h2><p>RaktSetu is a frontend concept for responsibly connecting blood donors with recipients through privacy-aware discovery and transparent request tracking.</p><p>This prototype uses sample records, simulated notifications, approximate Indian coordinates and local browser storage. It does not provide medical advice or emergency services.</p></Card><SectionTitle title="Important principles" /><div className="principle-list"><div><ShieldCheck /><span><strong>Privacy first</strong>Exact donor home addresses are never shown.</span></div><div><HeartHandshake /><span><strong>Human centered</strong>Clear, calm workflows support stressful moments.</span></div><div><Activity /><span><strong>Clinically responsible</strong>Final eligibility and compatibility require medical confirmation.</span></div></div></div>
}

export function UsersScreen() {
  const [query, setQuery] = useState('')
  const users = [['Priya Sharma', 'Donor · O+', 'Verified'], ['Rohan Mehta', 'Donor · B+', 'Pending'], ['Anika Verma', 'Recipient', 'Active'], ['Kabir Joshi', 'Donor · A−', 'Reported']]
  return <div className="screen"><PageHeader title="Manage users" subtitle="Admin demo directory" /><div className="map-search"><Search size={18} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" /></div><div className="user-list">{users.filter((user) => user[0].toLowerCase().includes(query.toLowerCase())).map((user) => <Card key={user[0]}><Avatar name={user[0]} size="sm" /><div><strong>{user[0]}</strong><span>{user[1]}</span></div><Badge tone={user[2] === 'Verified' || user[2] === 'Active' ? 'green' : user[2] === 'Reported' ? 'rose' : 'amber'}>{user[2]}</Badge></Card>)}</div></div>
}

export function FacilitiesScreen() {
  return <div className="screen"><PageHeader title="Facilities" subtitle="Hospitals & blood banks · Sample data" action={<IconButton label="Add facility" onClick={() => window.alert('Demo facility form opened.')}><Plus size={20} /></IconButton>} /><div className="facility-list">{[['Apollo Hospital', 'Sarita Vihar, New Delhi', 'Hospital'], ['LifeLine Blood Bank', 'Karol Bagh, New Delhi', 'Blood bank'], ['City Care Hospital', 'Connaught Place, New Delhi', 'Hospital']].map((item) => <Card key={item[0]}><div className="place-icon"><Building2 size={20} /></div><div><strong>{item[0]}</strong><span>{item[1]}</span><Badge tone="green">Verified {item[2]}</Badge></div><ChevronRight size={18} /></Card>)}</div></div>
}
