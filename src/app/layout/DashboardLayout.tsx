import { Outlet } from 'react-router';
import { Sidebar } from '../components/Sidebar';
import { TopNav } from '../components/TopNav';
import { useApp } from '../context/AppContext';

export function DashboardLayout() {
  const { theme } = useApp();
  const isLight = theme === 'light';

  const layoutBg = isLight ? '#F4F4FB' : '#0B0B0F';

  return (
    <div
      className="flex h-screen overflow-hidden layout-bg"
      style={{
        background: layoutBg,
        fontFamily: 'Inter, sans-serif',
        transition: 'background 0.35s ease',
      }}
    >
      {/* Animated plasma gradient background (subtle in light mode) */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="plasma-orb"
          style={{
            position: 'absolute',
            width: '700px',
            height: '700px',
            top: '-200px',
            left: '-100px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #6D28D9 0%, transparent 70%)',
            opacity: isLight ? 0.06 : 0.25,
            animation: 'plasma1 18s ease-in-out infinite',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="plasma-orb"
          style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            bottom: '-100px',
            right: '10%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)',
            opacity: isLight ? 0.05 : 0.15,
            animation: 'plasma2 22s ease-in-out infinite',
            transition: 'opacity 0.4s ease',
          }}
        />
        <div
          className="plasma-orb"
          style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            top: '40%',
            right: '25%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)',
            opacity: isLight ? 0.04 : 0.10,
            animation: 'plasma3 26s ease-in-out infinite',
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>

      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
