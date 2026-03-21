import { useState } from 'react';
import { Video, MessageSquare, Users, Hash, FileText, LayoutGrid, TrendingUp, UserCheck, Check, Zap } from 'lucide-react';
import { useApp, useThemeColors } from '../context/AppContext';

const platforms = [
  { name: 'Zoom', icon: Video, descKey: 'integrations.zoom.desc', iconBg: 'linear-gradient(135deg,#1a6fdc,#2D8CFF)', glow: 'rgba(45,140,255,0.4)', connected: true },
  { name: 'Google Meet', icon: MessageSquare, descKey: 'integrations.meet.desc', iconBg: 'linear-gradient(135deg,#137333,#34A853)', glow: 'rgba(52,168,83,0.4)', connected: true },
  { name: 'Microsoft Teams', icon: Users, descKey: 'integrations.teams.desc', iconBg: 'linear-gradient(135deg,#4a4b9e,#5558AF)', glow: 'rgba(85,88,175,0.4)', connected: false },
];

const integrationList = [
  { name: 'Slack', icon: Hash, descKey: 'integrations.slack.desc', iconBg: 'linear-gradient(135deg,#6D28D9,#EC4899)', glow: 'rgba(236,72,153,0.4)', connected: true },
  { name: 'Notion', icon: FileText, descKey: 'integrations.notion.desc', iconBg: 'linear-gradient(135deg,#374151,#6b7280)', glow: 'rgba(107,114,128,0.3)', connected: true },
  { name: 'Jira', icon: LayoutGrid, descKey: 'integrations.jira.desc', iconBg: 'linear-gradient(135deg,#1a56db,#2563eb)', glow: 'rgba(37,99,235,0.4)', connected: false },
  { name: 'Linear', icon: TrendingUp, descKey: 'integrations.linear.desc', iconBg: 'linear-gradient(135deg,#6D28D9,#a855f7)', glow: 'rgba(168,85,247,0.4)', connected: false },
  { name: 'HubSpot', icon: Users, descKey: 'integrations.hubspot.desc', iconBg: 'linear-gradient(135deg,#c2410c,#f97316)', glow: 'rgba(249,115,22,0.4)', connected: false },
  { name: 'Salesforce', icon: UserCheck, descKey: 'integrations.salesforce.desc', iconBg: 'linear-gradient(135deg,#0891b2,#22D3EE)', glow: 'rgba(34,211,238,0.4)', connected: false },
];

const descriptions: Record<string, { en: string; tr: string }> = {
  'integrations.zoom.desc': { en: 'Automatically record and analyze Zoom meetings', tr: 'Zoom toplantılarını otomatik kaydedin ve analiz edin' },
  'integrations.meet.desc': { en: 'Connect Google Meet for seamless meeting analysis', tr: "Sorunsuz toplantı analizi için Google Meet'i bağlayın" },
  'integrations.teams.desc': { en: 'Sync Teams meetings and extract insights', tr: 'Teams toplantılarını senkronize edin ve içgörüler çıkarın' },
  'integrations.slack.desc': { en: 'Send meeting summaries and action items to Slack channels', tr: 'Toplantı özetlerini ve eylem öğelerini Slack kanallarına gönderin' },
  'integrations.notion.desc': { en: 'Sync meeting notes and decisions to Notion workspace', tr: 'Toplantı notlarını ve kararları Notion çalışma alanıyla senkronize edin' },
  'integrations.jira.desc': { en: 'Automatically create Jira tickets from action items', tr: 'Eylem öğelerinden otomatik Jira biletleri oluşturun' },
  'integrations.linear.desc': { en: 'Sync action items with Linear issues', tr: 'Eylem öğelerini Linear sorunlarıyla senkronize edin' },
  'integrations.hubspot.desc': { en: 'Log sales meetings and sync with CRM contacts', tr: 'Satış toplantılarını kaydedin ve CRM kişileriyle senkronize edin' },
  'integrations.salesforce.desc': { en: 'Sync meeting data with Salesforce opportunities', tr: 'Toplantı verilerini Salesforce fırsatlarıyla senkronize edin' },
};

function IntegrationCard({
  name, icon: Icon, descKey, iconBg, glow, connected, t, tc,
}: {
  name: string;
  icon: any;
  descKey: string;
  iconBg: string;
  glow: string;
  connected: boolean;
  t: (key: string) => string;
  tc: ReturnType<typeof useThemeColors>;
}) {
  const [isConnected, setIsConnected] = useState(connected);
  const { language } = useApp();
  const desc = descriptions[descKey]?.[language] ?? descriptions[descKey]?.en ?? '';

  return (
    <div
      className="glass-card rounded-2xl p-6 flex flex-col"
      style={{ transition: 'all 0.3s ease' }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${glow}`;
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '';
        (e.currentTarget as HTMLElement).style.transform = '';
      }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="flex h-12 w-12 items-center justify-center rounded-xl"
          style={{ background: iconBg, boxShadow: `0 0 16px ${glow}` }}
        >
          <Icon className="h-6 w-6 text-white" />
        </div>
        {isConnected && (
          <div
            className="flex items-center gap-1 rounded-full px-2.5 py-1 text-xs"
            style={{
              background: 'rgba(52,211,153,0.12)',
              color: '#34d399',
              border: '1px solid rgba(52,211,153,0.3)',
              fontWeight: 600,
              boxShadow: '0 0 8px rgba(52,211,153,0.3)',
            }}
          >
            <Check className="h-3 w-3" />
            {t('integrations.connected')}
          </div>
        )}
      </div>
      <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary, marginBottom: 4 }}>{name}</h3>
      <p className="text-sm flex-1 mb-5" style={{ color: tc.textDim, lineHeight: 1.6 }}>{desc}</p>
      <button
        onClick={() => setIsConnected(!isConnected)}
        className="w-full rounded-xl py-2.5 text-sm transition-all duration-200"
        style={
          isConnected
            ? {
                background: tc.filterBg,
                color: tc.textSecondary,
                border: `1px solid ${tc.filterBorder}`,
                fontWeight: 600,
              }
            : {
                background: iconBg,
                color: '#fff',
                border: 'none',
                fontWeight: 700,
                boxShadow: `0 0 16px ${glow}`,
              }
        }
        onMouseEnter={(e) => {
          if (isConnected) {
            (e.currentTarget as HTMLElement).style.background = tc.rowHoverBg;
          } else {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 28px ${glow}`;
            (e.currentTarget as HTMLElement).style.transform = 'scale(1.02)';
          }
        }}
        onMouseLeave={(e) => {
          if (isConnected) {
            (e.currentTarget as HTMLElement).style.background = tc.filterBg;
          } else {
            (e.currentTarget as HTMLElement).style.boxShadow = `0 0 16px ${glow}`;
            (e.currentTarget as HTMLElement).style.transform = '';
          }
        }}
      >
        {isConnected ? t('integrations.configure') : t('integrations.connect')}
      </button>
    </div>
  );
}

export function Integrations() {
  const { t } = useApp();
  const tc = useThemeColors();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card-anim card-anim-1">
        <h1 className="page-title">{t('integrations.title')}</h1>
        <p className="page-subtitle">{t('integrations.subtitle')}</p>
      </div>

      {/* Meeting Platforms */}
      <div className="card-anim card-anim-2">
        <div className="mb-4">
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('integrations.platforms')}</h2>
          <p className="mt-0.5 text-sm" style={{ color: tc.textDim }}>{t('integrations.platformsSub')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {platforms.map((p) => (
            <IntegrationCard key={p.name} {...p} t={t} tc={tc} />
          ))}
        </div>
      </div>

      {/* Productivity Tools */}
      <div className="card-anim card-anim-3">
        <div className="mb-4">
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('integrations.productivity')}</h2>
          <p className="mt-0.5 text-sm" style={{ color: tc.textDim }}>{t('integrations.productivitySub')}</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {integrationList.map((item) => (
            <IntegrationCard key={item.name} {...item} t={t} tc={tc} />
          ))}
        </div>
      </div>

      {/* Help */}
      <div
        className="glass-card rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 card-anim card-anim-4"
        style={{ borderColor: 'rgba(109,40,217,0.25)', background: 'rgba(109,40,217,0.06)' }}
      >
        <div className="flex items-center gap-4">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 16px rgba(109,40,217,0.5)' }}
          >
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h3 style={{ fontSize: '15px', fontWeight: 700, color: tc.textPrimary }}>{t('integrations.help')}</h3>
            <p className="text-sm mt-0.5" style={{ color: tc.textDim }}>
              {t('integrations.helpSub')}
            </p>
          </div>
        </div>
        <div className="flex gap-3 shrink-0">
          <button className="btn-primary px-4 py-2.5 text-sm rounded-xl">{t('integrations.viewDocs')}</button>
          <button className="btn-secondary px-4 py-2.5 text-sm rounded-xl">{t('integrations.contact')}</button>
        </div>
      </div>
    </div>
  );
}
