import { createBrowserRouter, Navigate } from 'react-router'
import { AppShell } from './ui'
import { Alerts, FacilitiesScreen, HelpScreen, HistoryScreen, Home, InfoScreen, Login, NewRequest, Profile, Requests, SettingsScreen, Signup, Splash, UsersScreen } from './screens'
import MapScreen from './MapScreen'

export const router = createBrowserRouter([
  { path: '/', Component: Splash },
  { path: '/login', Component: Login },
  { path: '/signup', Component: Signup },
  {
    path: '/app',
    Component: AppShell,
    children: [
      { index: true, element: <Navigate to="home" replace /> },
      { path: 'home', Component: Home },
      { path: 'requests', Component: Requests },
      { path: 'new-request', Component: NewRequest },
      { path: 'map', Component: MapScreen },
      { path: 'alerts', Component: Alerts },
      { path: 'profile', Component: Profile },
      { path: 'history', Component: HistoryScreen },
      { path: 'settings', Component: SettingsScreen },
      { path: 'help', Component: HelpScreen },
      { path: 'info', Component: InfoScreen },
      { path: 'users', Component: UsersScreen },
      { path: 'facilities', Component: FacilitiesScreen },
    ],
  },
  { path: '*', element: <Navigate to="/" replace /> },
])
