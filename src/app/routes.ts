import { createBrowserRouter } from 'react-router';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { Blog } from './pages/Blog';
import { Connect } from './pages/Connect';
import { Dashboard } from './pages/Dashboard';
import { Meetings } from './pages/Meetings';
import { MeetingDetail } from './pages/MeetingDetail';
import { Intelligence } from './pages/Intelligence';
import { Decisions } from './pages/Decisions';
import { ActionItems } from './pages/ActionItems';
import { Analytics } from './pages/Analytics';
import { Integrations } from './pages/Integrations';
import { Settings } from './pages/Settings';
import { DashboardLayout } from './layout/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: Login,
  },
  {
    path: '/connect',
    Component: Connect,
  },
  {
    path: '/blog',
    Component: Blog,
  },
  {
    path: '/',
    Component: DashboardLayout,
    children: [
      {
        path: 'dashboard',
        Component: Dashboard,
      },
      {
        path: 'meetings',
        Component: Meetings,
      },
      {
        path: 'meetings/:id',
        Component: MeetingDetail,
      },
      {
        path: 'intelligence',
        Component: Intelligence,
      },
      {
        path: 'decisions',
        Component: Decisions,
      },
      {
        path: 'action-items',
        Component: ActionItems,
      },
      {
        path: 'analytics',
        Component: Analytics,
      },
      {
        path: 'integrations',
        Component: Integrations,
      },
      {
        path: 'settings',
        Component: Settings,
      },
    ],
  },
]);
