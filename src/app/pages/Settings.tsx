import { useState } from 'react';
import { User, Building2, Shield, CreditCard, Database, Bell, Check } from 'lucide-react';
import { useApp, useThemeColors } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { getUserProfile } from '../lib/userProfile';

type Tab = 'profile' | 'workspace' | 'security' | 'billing' | 'privacy' | 'notifications';

function DarkInput({ label, tc, ...props }: { label: string; tc: ReturnType<typeof useThemeColors> } & React.InputHTMLAttributes<HTMLInputElement>) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: tc.labelText, fontWeight: 600, marginBottom: 6 }}>{label}</label>
      <input
        {...props}
        style={{
          background: tc.inputBg,
          border: `1px solid ${focused ? 'rgba(109,40,217,0.6)' : tc.inputBorder}`,
          color: tc.inputText,
          borderRadius: 12,
          padding: '10px 14px',
          width: '100%',
          outline: 'none',
          fontSize: 14,
          transition: 'all 0.25s ease',
          boxShadow: focused ? '0 0 20px rgba(109,40,217,0.2)' : 'none',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  );
}

function DarkToggle({ defaultChecked = true }: { defaultChecked?: boolean }) {
  const [on, setOn] = useState(defaultChecked);
  return (
    <button
      onClick={() => setOn(!on)}
      className="relative shrink-0 h-6 w-11 rounded-full transition-all duration-300"
      style={{
        background: on ? 'linear-gradient(135deg, #6D28D9, #EC4899)' : 'rgba(255,255,255,0.12)',
        boxShadow: on ? '0 0 12px rgba(109,40,217,0.5)' : 'none',
      }}
    >
      <span
        className="absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all duration-300"
        style={{ left: on ? '22px' : '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
      />
    </button>
  );
}

function SectionCard({ title, subtitle, children, tc }: { title: string; subtitle?: string; children: React.ReactNode; tc: ReturnType<typeof useThemeColors> }) {
  return (
    <div className="glass-card rounded-2xl p-6">
      <h2 style={{ fontSize: '16px', fontWeight: 700, color: tc.textPrimary }}>{title}</h2>
      {subtitle && <p className="mt-0.5 text-sm" style={{ color: tc.textDim }}>{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </div>
  );
}

function ProfileSettings({
  t,
  tc,
  firstName,
  lastName,
  email,
  initials,
}: {
  t: (k: string) => string;
  tc: ReturnType<typeof useThemeColors>;
  firstName: string;
  lastName: string;
  email: string;
  initials: string;
}) {
  return (
    <SectionCard title={t('settings.profileInfo')} subtitle={t('settings.profileInfoSub')} tc={tc}>
      <div className="space-y-5">
        <div className="flex items-center gap-5">
          <div
            className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-2xl text-white"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', fontWeight: 800, boxShadow: '0 0 24px rgba(109,40,217,0.5)' }}
          >
            {initials}
          </div>
          <div>
            <button className="btn-secondary px-4 py-2 text-sm rounded-xl">{t('settings.changeAvatar')}</button>
            <p className="mt-2 text-xs" style={{ color: tc.textMuted }}>{t('settings.avatarHint')}</p>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <DarkInput label={t('settings.firstName')} type="text" defaultValue={firstName} tc={tc} />
          <DarkInput label={t('settings.lastName')} type="text" defaultValue={lastName} tc={tc} />
        </div>
        <DarkInput label={t('settings.email')} type="email" defaultValue={email} tc={tc} />
        <DarkInput label={t('settings.jobTitle')} type="text" defaultValue="Product Manager" tc={tc} />
        <div className="flex justify-end gap-3 pt-5" style={{ borderTop: `1px solid ${tc.sectionDivider}` }}>
          <button className="btn-secondary px-4 py-2.5 text-sm rounded-xl">{t('settings.cancel')}</button>
          <button className="btn-primary px-5 py-2.5 text-sm rounded-xl">{t('settings.save')}</button>
        </div>
      </div>
    </SectionCard>
  );
}

function WorkspaceSettings({ t, tc }: { t: (k: string) => string; tc: ReturnType<typeof useThemeColors> }) {
  return (
    <div className="space-y-4">
      <SectionCard title={t('settings.workspaceSettingsTitle')} subtitle={t('settings.workspaceSettingsSub')} tc={tc}>
        <div className="space-y-5">
          <DarkInput label={t('settings.workspaceName')} type="text" defaultValue="Sarah's Workspace" tc={tc} />
          <div>
            <label style={{ display: 'block', fontSize: '13px', color: tc.labelText, fontWeight: 600, marginBottom: 6 }}>{t('settings.workspaceUrl')}</label>
            <div className="flex rounded-xl overflow-hidden" style={{ border: `1px solid ${tc.inputBorder}`, background: tc.inputBg }}>
              <span className="flex items-center px-3 text-sm border-r" style={{ color: tc.textMuted, borderColor: tc.borderSubtle }}>
                meetinsight.ai/
              </span>
              <input
                type="text"
                defaultValue="sarahs-workspace"
                style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', padding: '10px 14px', color: tc.inputText, fontSize: 14 }}
              />
            </div>
          </div>
          <div className="flex justify-end pt-4" style={{ borderTop: `1px solid ${tc.sectionDivider}` }}>
            <button className="btn-primary px-5 py-2.5 text-sm rounded-xl">{t('settings.save')}</button>
          </div>
        </div>
      </SectionCard>

      <div className="glass-card rounded-2xl p-6" style={{ borderColor: 'rgba(239,68,68,0.25)', background: tc.dangerBg }}>
        <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('settings.dangerZone')}</h3>
        <p className="mt-2 text-sm" style={{ color: tc.textDim, lineHeight: 1.6 }}>
          {t('settings.dangerZoneSub')}
        </p>
        <button
          className="mt-4 rounded-xl px-4 py-2.5 text-sm"
          style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600 }}
        >
          {t('settings.deleteWorkspace')}
        </button>
      </div>
    </div>
  );
}

function SecuritySettings({ t, tc }: { t: (k: string) => string; tc: ReturnType<typeof useThemeColors> }) {
  return (
    <div className="space-y-4">
      <SectionCard title={t('settings.securitySettingsTitle')} subtitle={t('settings.securitySettingsSub')} tc={tc}>
        <div className="space-y-5">
          <DarkInput label={t('settings.currentPassword')} type="password" placeholder="••••••••" tc={tc} />
          <DarkInput label={t('settings.newPassword')} type="password" placeholder="••••••••" tc={tc} />
          <DarkInput label={t('settings.confirmPassword')} type="password" placeholder="••••••••" tc={tc} />
          <div className="flex justify-end pt-4" style={{ borderTop: `1px solid ${tc.sectionDivider}` }}>
            <button className="btn-primary px-5 py-2.5 text-sm rounded-xl">{t('settings.updatePassword')}</button>
          </div>
        </div>
      </SectionCard>

      <div className="glass-card rounded-2xl p-6" style={{ borderColor: 'rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.05)' }}>
        <div className="flex items-start gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)' }}>
            <Shield className="h-4 w-4" style={{ color: '#34d399' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('settings.securityStatus')}</h3>
            <ul className="mt-3 space-y-2">
              {[
                t('settings.encryptionEnabled'),
                t('settings.soc2'),
                t('settings.gdpr'),
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <Check className="h-3.5 w-3.5" style={{ color: '#34d399' }} />
                  <span className="text-sm" style={{ color: tc.textSecondary }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function BillingSettings({ t, tc }: { t: (k: string) => string; tc: ReturnType<typeof useThemeColors> }) {
  return (
    <div className="space-y-4">
      <SectionCard title={t('settings.currentPlan')} tc={tc}>
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <p className="gradient-text" style={{ fontSize: '24px', fontWeight: 800 }}>{t('settings.proPlan')}</p>
              <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: 'rgba(109,40,217,0.2)', color: '#a78bfa', fontWeight: 700, border: '1px solid rgba(109,40,217,0.3)' }}>{t('settings.active')}</span>
            </div>
            <p className="text-sm" style={{ color: tc.textDim }}>{t('settings.planDetails')}</p>
          </div>
          <button className="btn-secondary px-4 py-2.5 text-sm rounded-xl">{t('settings.changePlan')}</button>
        </div>
      </SectionCard>

      <SectionCard title={t('settings.paymentMethod')} tc={tc}>
        <div className="flex items-center justify-between rounded-xl p-4" style={{ background: tc.containerBg, border: `1px solid ${tc.cardBorder}` }}>
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-14 items-center justify-center rounded-lg text-xs" style={{ background: tc.filterBg, color: tc.textSecondary, fontWeight: 800 }}>VISA</div>
            <div>
              <p className="text-sm" style={{ fontWeight: 600, color: tc.textPrimary }}>•••• •••• •••• 4242</p>
              <p className="text-xs" style={{ color: tc.textDim }}>{t('settings.cardExpiry')}</p>
            </div>
          </div>
          <button style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>{t('settings.updateCard')}</button>
        </div>
      </SectionCard>

      <SectionCard title={t('settings.billingHistory')} tc={tc}>
        <div className="space-y-2">
          {[
            { date: 'Mar 1, 2026', amount: '$29.00' },
            { date: 'Feb 1, 2026', amount: '$29.00' },
            { date: 'Jan 1, 2026', amount: '$29.00' },
          ].map((inv) => (
            <div key={inv.date} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: tc.containerBg, border: `1px solid ${tc.cardBorder}` }}>
              <div>
                <p className="text-sm" style={{ fontWeight: 600, color: tc.textPrimary }}>{inv.date}</p>
                <p className="text-xs" style={{ color: tc.textDim }}>{inv.amount}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="rounded-full px-2.5 py-0.5 text-xs" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', fontWeight: 700, border: '1px solid rgba(52,211,153,0.25)' }}>{t('settings.paid')}</span>
                <button style={{ color: '#a78bfa', fontSize: '13px', fontWeight: 600 }}>{t('settings.download')}</button>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}

function PrivacySettings({ t, tc }: { t: (k: string) => string; tc: ReturnType<typeof useThemeColors> }) {
  return (
    <SectionCard title={t('settings.dataPrivacyTitle')} subtitle={t('settings.dataPrivacySub')} tc={tc}>
      <div className="space-y-5">
        {[
          { labelKey: 'settings.dataRetention', subKey: 'settings.dataRetentionSub' },
          { labelKey: 'settings.analyticsLabel', subKey: 'settings.analyticsSub' },
          { labelKey: 'settings.shareWithTeam', subKey: 'settings.shareWithTeamSub' },
        ].map(({ labelKey, subKey }) => (
          <div key={labelKey} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm" style={{ fontWeight: 600, color: tc.textPrimary }}>{t(labelKey)}</p>
              <p className="text-xs mt-0.5" style={{ color: tc.textDim }}>{t(subKey)}</p>
            </div>
            <DarkToggle />
          </div>
        ))}
        <div className="pt-5" style={{ borderTop: `1px solid ${tc.sectionDivider}` }}>
          <button className="btn-secondary px-4 py-2.5 text-sm rounded-xl" style={{ color: '#f87171', borderColor: 'rgba(239,68,68,0.3)' }}>
            {t('settings.exportData')}
          </button>
          <p className="mt-2 text-xs" style={{ color: tc.textMuted }}>{t('settings.exportDataHint')}</p>
        </div>
      </div>
    </SectionCard>
  );
}

function NotificationSettings({ t, tc }: { t: (k: string) => string; tc: ReturnType<typeof useThemeColors> }) {
  return (
    <SectionCard title={t('settings.notifPrefsTitle')} subtitle={t('settings.notifPrefsSub')} tc={tc}>
      <div className="space-y-5">
        <h4 className="text-sm" style={{ color: tc.textSecondary, fontWeight: 700 }}>{t('settings.emailNotifs')}</h4>
        {[
          { labelKey: 'settings.meetingSummaries', subKey: 'settings.meetingSummariesSub' },
          { labelKey: 'settings.actionReminders', subKey: 'settings.actionRemindersSub' },
          { labelKey: 'settings.decisionUpdates', subKey: 'settings.decisionUpdatesSub' },
          { labelKey: 'settings.weeklyReports', subKey: 'settings.weeklyReportsSub' },
        ].map(({ labelKey, subKey }) => (
          <div key={labelKey} className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm" style={{ fontWeight: 600, color: tc.textPrimary }}>{t(labelKey)}</p>
              <p className="text-xs mt-0.5" style={{ color: tc.textDim }}>{t(subKey)}</p>
            </div>
            <DarkToggle />
          </div>
        ))}
        <div className="flex justify-end pt-4" style={{ borderTop: `1px solid ${tc.sectionDivider}` }}>
          <button className="btn-primary px-5 py-2.5 text-sm rounded-xl">{t('settings.savePrefs')}</button>
        </div>
      </div>
    </SectionCard>
  );
}

export function Settings() {
  const { t } = useApp();
  const { user } = useAuth();
  const tc = useThemeColors();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const profile = getUserProfile(user);

  const tabs: { id: Tab; labelKey: string; icon: React.ElementType }[] = [
    { id: 'profile', labelKey: 'settings.profile', icon: User },
    { id: 'workspace', labelKey: 'settings.workspace', icon: Building2 },
    { id: 'security', labelKey: 'settings.security', icon: Shield },
    { id: 'billing', labelKey: 'settings.billing', icon: CreditCard },
    { id: 'privacy', labelKey: 'settings.privacy', icon: Database },
    { id: 'notifications', labelKey: 'settings.notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="card-anim card-anim-1">
        <h1 className="page-title">{t('settings.title')}</h1>
        <p className="page-subtitle">{t('settings.subtitle')}</p>
      </div>

      <div className="flex gap-6 card-anim card-anim-2">
        {/* Sidebar nav */}
        <div className="w-56 shrink-0">
          <nav className="space-y-0.5">
            {tabs.map(({ id, labelKey, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="sidebar-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all"
                style={{
                  color: activeTab === id ? '#c4b5fd' : tc.textDim,
                  fontWeight: activeTab === id ? 600 : 500,
                  background: activeTab === id ? 'linear-gradient(135deg, rgba(109,40,217,0.25), rgba(236,72,153,0.12))' : 'transparent',
                  border: activeTab === id ? '1px solid rgba(109,40,217,0.35)' : '1px solid transparent',
                }}
              >
                <Icon className="h-4 w-4 shrink-0" style={{ color: activeTab === id ? '#a78bfa' : tc.iconMuted }} />
                {t(labelKey)}
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'profile' && (
            <ProfileSettings
              t={t}
              tc={tc}
              firstName={profile.firstName}
              lastName={profile.lastName}
              email={profile.email}
              initials={profile.initials}
            />
          )}
          {activeTab === 'workspace' && <WorkspaceSettings t={t} tc={tc} />}
          {activeTab === 'security' && <SecuritySettings t={t} tc={tc} />}
          {activeTab === 'billing' && <BillingSettings t={t} tc={tc} />}
          {activeTab === 'privacy' && <PrivacySettings t={t} tc={tc} />}
          {activeTab === 'notifications' && <NotificationSettings t={t} tc={tc} />}
        </div>
      </div>
    </div>
  );
}
