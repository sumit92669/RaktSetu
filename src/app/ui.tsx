import { type ButtonHTMLAttributes, type InputHTMLAttributes, type ReactNode } from 'react'
import { Bell, Droplets, History, Home, Map, ShieldCheck, UserRound, UsersRound, ClipboardList, Building2, type LucideIcon } from 'lucide-react'
import { Navigate, NavLink, Outlet, useNavigate } from 'react-router'
import { useStore, type Role } from './store'

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="brand">
      <div className="logo-mark"><Droplets size={compact ? 20 : 28} strokeWidth={2.4} /></div>
      <div>
        <div className={compact ? 'brand-name compact' : 'brand-name'}>RaktSetu</div>
        {!compact && <div className="brand-tag">Every Drop Connects a Life.</div>}
      </div>
    </div>
  )
}

export function Button({ className = '', variant = 'primary', children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' }) {
  return <button className={`btn btn-${variant} ${className}`} {...props}>{children}</button>
}

export function IconButton({ label, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string; children: ReactNode }) {
  return <button className="icon-btn" aria-label={label} {...props}>{children}</button>
}

export function Field({ label, error, ...props }: InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string }) {
  return <label className="field"><span>{label}</span><input {...props} />{error && <small>{error}</small>}</label>
}

export function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>
}

export function TextArea({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label className="field"><span>{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} rows={4} /></label>
}

export function Badge({ children, tone = 'rose' }: { children: ReactNode; tone?: 'rose' | 'green' | 'amber' | 'grey' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

export function Card({ children, className = '', onClick }: { children: ReactNode; className?: string; onClick?: () => void }) {
  return <div className={`card ${className}`} onClick={onClick}>{children}</div>
}

export function Avatar({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' | 'lg' }) {
  return <div className={`avatar avatar-${size}`}>{name.split(' ').map((part) => part[0]).slice(0, 2).join('')}</div>
}

export function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return <header className="page-header"><div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>{action}</header>
}

const navByRole: Record<Role, { to: string; label: string; icon: LucideIcon }[]> = {
  donor: [
    { to: '/app/home', label: 'Home', icon: Home }, { to: '/app/requests', label: 'Requests', icon: ClipboardList },
    { to: '/app/map', label: 'Map', icon: Map }, { to: '/app/alerts', label: 'Alerts', icon: Bell }, { to: '/app/profile', label: 'Profile', icon: UserRound },
  ],
  recipient: [
    { to: '/app/home', label: 'Home', icon: Home }, { to: '/app/requests', label: 'Requests', icon: ClipboardList },
    { to: '/app/map', label: 'Map', icon: Map }, { to: '/app/alerts', label: 'Alerts', icon: Bell }, { to: '/app/profile', label: 'Profile', icon: UserRound },
  ],
  admin: [
    { to: '/app/home', label: 'Overview', icon: Home }, { to: '/app/requests', label: 'Requests', icon: ClipboardList },
    { to: '/app/users', label: 'Users', icon: UsersRound }, { to: '/app/facilities', label: 'Facilities', icon: Building2 }, { to: '/app/profile', label: 'Admin', icon: ShieldCheck },
  ],
}

export function AppShell() {
  const { role, notifications } = useStore()
  const navigate = useNavigate()
  if (!role) return <Navigate to="/login" replace />
  const unread = notifications.filter((item) => !item.read).length
  return (
    <div className="phone-shell">
      <div className="status-bar"><span>9:41</span><span className="status-icons">● ᴡɪꜰɪ ▰</span></div>
      <div className="app-topbar">
        <Logo compact />
        <IconButton label="Notifications" onClick={() => navigate('/app/alerts')}><Bell size={20} />{unread > 0 && <i>{unread}</i>}</IconButton>
      </div>
      <main className="app-content"><Outlet /></main>
      <nav className="bottom-nav">
        {navByRole[role].map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} className={({ isActive }) => isActive ? 'active' : ''}>
            <Icon size={21} strokeWidth={2.2} /><span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

export function Stat({ value, label, icon: Icon }: { value: string; label: string; icon?: LucideIcon }) {
  return <Card className="stat-card">{Icon && <Icon size={18} />}<strong>{value}</strong><span>{label}</span></Card>
}

export function SectionTitle({ title, action, onAction }: { title: string; action?: string; onAction?: () => void }) {
  return <div className="section-title"><h2>{title}</h2>{action && <button onClick={onAction}>{action}</button>}</div>
}

export function EmptyState({ icon: Icon = History, title, body }: { icon?: LucideIcon; title: string; body: string }) {
  return <div className="empty"><Icon size={30} /><h3>{title}</h3><p>{body}</p></div>
}
