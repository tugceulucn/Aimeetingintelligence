import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
  Home, Calendar, Brain, CheckSquare, Flag, BarChart3,
  Plug, Settings, Building2, CreditCard, ChevronUp,
  User, Mail, Shield, LogOut, Bell, HelpCircle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../lib/userProfile';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Meetings', href: '/meetings', icon: Calendar },
  { name: 'Meeting Intelligence', href: '/intelligence', icon: Brain },
  { name: 'Action Items', href: '/action-items', icon: CheckSquare },
  { name: 'Decisions', href: '/decisions', icon: Flag },
  { name: 'Team Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Integrations', href: '/integrations', icon: Plug },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, theme } = useApp();
  const { user, signOut } = useAuth();
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isLight = theme === 'light';
  const sidebarBg = isLight ? 'rgba(255,255,255,0.97)' : 'rgba(11,11,15,0.85)';
  const sidebarBorder = isLight ? 'rgba(109,40,217,0.1)' : 'rgba(255,255,255,0.06)';
  const textMuted = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.45)';
  const textSub   = isLight ? 'rgba(0,0,0,0.3)'  : 'rgba(255,255,255,0.35)';
  const activeText = isLight ? '#6D28D9' : '#c4b5fd';
  const activeIcon = isLight ? '#6D28D9' : '#a78bfa';
  const dropdownBg = isLight ? '#fff' : 'rgba(20,20,30,0.97)';
  const dropdownItemColor = isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.55)';
  const dropdownItemHoverBg = isLight ? 'rgba(109,40,217,0.06)' : 'rgba(255,255,255,0.05)';
  const dropdownItemHoverColor = isLight ? '#1a1a2e' : 'rgba(255,255,255,0.85)';
  const nameColor = isLight ? '#1a1a2e' : '#ffffff';
  const emailColor = isLight ? 'rgba(0,0,0,0.45)' : 'rgba(255,255,255,0.4)';

  const profileItems = [
    { icon: User,        label: t('profile.profile') },
    { icon: Mail,        label: t('profile.email') },
    { icon: Bell,        label: t('profile.notifications') },
    { icon: Shield,      label: t('profile.privacy') },
    { icon: HelpCircle,  label: t('profile.help') },
  ];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const profile = getUserProfile(user);

  async function handleSignOut() {
    setProfileOpen(false);
    await signOut();
    navigate('/');
  }

  return (
    <div
      className="sidebar-root flex h-screen w-64 flex-col shrink-0"
      style={{
        background: sidebarBg,
        backdropFilter: 'blur(24px)',
        borderRight: `1px solid ${sidebarBorder}`,
        transition: 'background 0.3s ease, border-color 0.3s ease',
      }}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5" style={{ borderBottom: `1px solid ${sidebarBorder}` }}>
        <div
          className="flex h-8 w-8 items-center justify-center rounded-lg"
          style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 16px rgba(109,40,217,0.5)' }}
        >
          <Brain className="h-4 w-4 text-white" />
        </div>
        <span className="text-sm" style={{ fontWeight: 700, letterSpacing: '-0.02em', color: nameColor }}>
          MeetInsight{' '}
          <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            AI
          </span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0.5 px-3 py-4 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`sidebar-item flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm ${isActive ? 'sidebar-item-active' : ''}`}
              style={{ color: isActive ? activeText : textMuted, fontWeight: isActive ? 600 : 500 }}
            >
              <item.icon className="h-4 w-4 shrink-0" style={{ color: isActive ? activeIcon : isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.35)' }} />
              {item.name}
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full" style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 6px rgba(109,40,217,0.8)' }} />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="p-3 space-y-0.5" style={{ borderTop: `1px solid ${sidebarBorder}` }}>
        <button className="sidebar-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm" style={{ color: textMuted, fontWeight: 500 }}>
          <Building2 className="h-4 w-4" style={{ color: isLight ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.3)' }} />
          {t('nav.workspace')}
        </button>
        <button className="sidebar-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm" style={{ color: textMuted, fontWeight: 500 }}>
          <CreditCard className="h-4 w-4" style={{ color: isLight ? 'rgba(0,0,0,0.28)' : 'rgba(255,255,255,0.3)' }} />
          {t('nav.billing')}
        </button>

        {/* Profile */}
        <div className="relative" ref={dropdownRef}>
          {profileOpen && (
            <div
              className="absolute bottom-full left-0 right-0 mb-2 rounded-2xl overflow-hidden z-50"
              style={{
                background: dropdownBg,
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(109,40,217,0.3)',
                boxShadow: '0 -8px 40px rgba(109,40,217,0.2)',
              }}
            >
              {/* User info */}
              <div
                className="flex items-center gap-3 px-4 py-4"
                style={{
                  background: 'linear-gradient(135deg, rgba(109,40,217,0.12), rgba(236,72,153,0.06))',
                  borderBottom: `1px solid rgba(109,40,217,0.1)`,
                }}
              >
                <div
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white text-sm"
                  style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', fontWeight: 700, boxShadow: '0 0 16px rgba(109,40,217,0.5)' }}
                >
                  {profile.initials}
                </div>
                <div className="min-w-0">
                  <p className="text-sm truncate" style={{ color: nameColor, fontWeight: 600 }}>{profile.fullName}</p>
                  <p className="text-xs truncate" style={{ color: emailColor }}>{profile.email}</p>
                  <span
                    className="inline-flex items-center mt-1 rounded-full px-2 py-0.5 text-xs"
                    style={{ background: 'rgba(109,40,217,0.15)', color: '#a78bfa', fontWeight: 600, border: '1px solid rgba(109,40,217,0.3)' }}
                  >
                    {t('profile.plan')}
                  </span>
                </div>
              </div>

              <div className="py-1.5">
                {profileItems.map(({ icon: Icon, label }) => (
                  <button
                    key={label}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                    style={{ color: dropdownItemColor, fontWeight: 500 }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.background = dropdownItemHoverBg;
                      (e.currentTarget as HTMLElement).style.color = dropdownItemHoverColor;
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                      (e.currentTarget as HTMLElement).style.color = dropdownItemColor;
                    }}
                  >
                    <Icon className="h-4 w-4 opacity-50" />
                    {label}
                  </button>
                ))}
              </div>

              <div style={{ borderTop: `1px solid rgba(109,40,217,0.1)` }} className="py-1.5">
                <button
                  onClick={handleSignOut}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm transition-colors"
                  style={{ color: '#f87171', fontWeight: 600 }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                >
                  <LogOut className="h-4 w-4" />
                  {t('profile.signout')}
                </button>
              </div>
            </div>
          )}

          {/* Profile row */}
          <button
            onClick={() => setProfileOpen((p) => !p)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200"
            style={{
              background: profileOpen ? 'rgba(109,40,217,0.1)' : 'transparent',
              border: profileOpen ? '1px solid rgba(109,40,217,0.3)' : '1px solid transparent',
            }}
            onMouseEnter={(e) => { if (!profileOpen) (e.currentTarget as HTMLElement).style.background = isLight ? 'rgba(109,40,217,0.06)' : 'rgba(255,255,255,0.04)'; }}
            onMouseLeave={(e) => { if (!profileOpen) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <div
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs"
              style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', fontWeight: 700, boxShadow: '0 0 10px rgba(109,40,217,0.4)' }}
            >
              {profile.initials}
            </div>
            <div className="flex-1 min-w-0 text-left">
              <p className="text-sm truncate" style={{ color: nameColor, fontWeight: 600 }}>{profile.fullName}</p>
              <p className="text-xs truncate" style={{ color: textSub }}>{profile.email}</p>
            </div>
            <ChevronUp
              className="h-3.5 w-3.5 shrink-0 transition-transform duration-200"
              style={{ color: textSub, transform: profileOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
