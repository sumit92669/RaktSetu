import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

export type Role = 'donor' | 'recipient' | 'admin'
export type RequestStatus = 'Matching' | 'Donor accepted' | 'Completed' | 'Cancelled'

export type BloodRequest = {
  id: string
  patient: string
  bloodGroup: string
  units: number
  hospital: string
  city: string
  date: string
  urgency: 'Normal' | 'Urgent' | 'Critical'
  status: RequestStatus
  distance: string
  contact?: string
  notes?: string
}

export type DemoNotification = {
  id: number
  title: string
  body: string
  time: string
  type: 'request' | 'success' | 'alert' | 'reminder'
  read: boolean
}

type Profile = { name: string; email: string; phone: string; city: string; bloodGroup: string }

type Store = {
  role: Role | null
  setRole: (role: Role | null) => void
  available: boolean
  setAvailable: (value: boolean) => void
  requests: BloodRequest[]
  addRequest: (request: Omit<BloodRequest, 'id' | 'status' | 'distance'>) => string
  updateRequest: (id: string, status: RequestStatus) => void
  notifications: DemoNotification[]
  markAllRead: () => void
  markRead: (id: number) => void
  profile: Profile
  updateProfile: (profile: Profile) => void
}

const initialRequests: BloodRequest[] = [
  { id: 'RS-4821', patient: 'A. Sharma', bloodGroup: 'O+', units: 2, hospital: 'Apollo Hospital', city: 'New Delhi', date: 'Today', urgency: 'Critical', status: 'Matching', distance: '2.4 km' },
  { id: 'RS-4798', patient: 'R. Mehta', bloodGroup: 'B+', units: 1, hospital: 'Fortis Healthcare', city: 'New Delhi', date: 'Tomorrow', urgency: 'Urgent', status: 'Donor accepted', distance: '4.8 km' },
  { id: 'RS-4671', patient: 'K. Verma', bloodGroup: 'A+', units: 2, hospital: 'Max Hospital', city: 'New Delhi', date: '12 Jun', urgency: 'Normal', status: 'Completed', distance: '6.2 km' },
]

const initialNotifications: DemoNotification[] = [
  { id: 1, title: 'Critical O+ request nearby', body: 'Apollo Hospital needs 2 units within 4 hours.', time: '8 min', type: 'alert', read: false },
  { id: 2, title: 'A donor accepted your request', body: 'A matched donor responded to request RS-4798.', time: '1 hr', type: 'success', read: false },
  { id: 3, title: 'Donation eligibility reminder', body: 'You may be eligible to donate again from 28 June.', time: 'Yesterday', type: 'reminder', read: true },
]

const StoreContext = createContext<Store | null>(null)

function saved<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(() => saved('raktsetu-role', null))
  const [available, setAvailable] = useState(() => saved('raktsetu-available', true))
  const [requests, setRequests] = useState<BloodRequest[]>(() => saved('raktsetu-requests', initialRequests))
  const [notifications, setNotifications] = useState<DemoNotification[]>(() => saved('raktsetu-notifications', initialNotifications))
  const [profile, setProfile] = useState<Profile>(() => saved('raktsetu-profile', {
    name: 'Aarav Kapoor', email: 'aarav@example.com', phone: '+91 98765 43210', city: 'New Delhi', bloodGroup: 'O+',
  }))

  useEffect(() => localStorage.setItem('raktsetu-available', JSON.stringify(available)), [available])
  useEffect(() => localStorage.setItem('raktsetu-requests', JSON.stringify(requests)), [requests])
  useEffect(() => localStorage.setItem('raktsetu-notifications', JSON.stringify(notifications)), [notifications])
  useEffect(() => localStorage.setItem('raktsetu-profile', JSON.stringify(profile)), [profile])

  const setRole = (next: Role | null) => {
    setRoleState(next)
    if (next) localStorage.setItem('raktsetu-role', JSON.stringify(next))
    else localStorage.removeItem('raktsetu-role')
  }
  const addRequest: Store['addRequest'] = (request) => {
    const id = `RS-${Math.floor(5000 + Math.random() * 4000)}`
    setRequests((all) => [{ ...request, id, status: 'Matching', distance: '—' }, ...all])
    setNotifications((all) => [{ id: Date.now(), title: 'Request submitted', body: `${id} is now finding suitable nearby donors.`, time: 'Now', type: 'success', read: false }, ...all])
    return id
  }
  const updateRequest = (id: string, status: RequestStatus) => {
    setRequests((all) => all.map((request) => request.id === id ? { ...request, status } : request))
    setNotifications((all) => [{ id: Date.now(), title: `Request ${status.toLowerCase()}`, body: `${id} was updated in this demo.`, time: 'Now', type: status === 'Cancelled' ? 'alert' : 'success', read: false }, ...all])
  }

  const value = useMemo<Store>(() => ({
    role, setRole, available, setAvailable, requests, addRequest, updateRequest, notifications,
    markAllRead: () => setNotifications((all) => all.map((item) => ({ ...item, read: true }))),
    markRead: (id) => setNotifications((all) => all.map((item) => item.id === id ? { ...item, read: true } : item)),
    profile, updateProfile: setProfile,
  }), [role, available, requests, notifications, profile])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (!context) throw new Error('useStore must be used within StoreProvider')
  return context
}
