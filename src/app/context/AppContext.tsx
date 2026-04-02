import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type Language = 'en' | 'tr';
export type Theme = 'dark' | 'light';

interface AppContextValue {
  language: Language;
  setLanguage: (lang: Language) => Promise<void>;
  theme: Theme;
  setTheme: (theme: Theme) => Promise<void>;
  toggleTheme: () => Promise<void>;
  t: (key: string) => string;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

/* ─── Theme-aware color tokens ─── */
export function useThemeColors() {
  const { theme } = useApp();
  const L = theme === 'light';
  return {
    isLight: L,
    textPrimary:    L ? '#111827'              : 'rgba(255,255,255,0.9)',
    textSecondary:  L ? '#6B7280'              : 'rgba(255,255,255,0.55)',
    textMuted:      L ? '#9CA3AF'              : 'rgba(255,255,255,0.35)',
    textDim:        L ? '#6B7280'              : 'rgba(255,255,255,0.45)',
    textLink:       L ? 'rgba(255,255,255,0.85)': 'rgba(255,255,255,0.85)',
    tableHeader:    L ? '#9CA3AF'              : 'rgba(255,255,255,0.3)',
    tableHeaderBg:  L ? 'rgba(109,40,217,0.03)': 'rgba(255,255,255,0.02)',
    borderSubtle:   L ? 'rgba(109,40,217,0.08)': 'rgba(255,255,255,0.06)',
    borderMedium:   L ? 'rgba(109,40,217,0.12)': 'rgba(255,255,255,0.08)',
    rowDivider:     L ? 'rgba(109,40,217,0.06)': 'rgba(255,255,255,0.04)',
    sectionDivider: L ? 'rgba(109,40,217,0.08)': 'rgba(255,255,255,0.06)',
    containerBg:    L ? 'rgba(109,40,217,0.03)': 'rgba(255,255,255,0.03)',
    rowHoverBg:     L ? 'rgba(109,40,217,0.04)': 'rgba(255,255,255,0.04)',
    filterBg:       L ? 'rgba(109,40,217,0.04)': 'rgba(255,255,255,0.04)',
    filterBorder:   L ? 'rgba(109,40,217,0.12)': 'rgba(255,255,255,0.07)',
    iconMuted:      L ? '#9CA3AF'              : 'rgba(255,255,255,0.3)',
    iconDim:        L ? '#6B7280'              : 'rgba(255,255,255,0.4)',
    inputBg:        L ? '#f9f9ff'              : 'rgba(255,255,255,0.05)',
    inputBorder:    L ? 'rgba(109,40,217,0.18)': 'rgba(255,255,255,0.1)',
    inputText:      L ? '#1a1a2e'              : 'rgba(255,255,255,0.85)',
    labelText:      L ? '#374151'              : 'rgba(255,255,255,0.55)',
    cardBorder:     L ? 'rgba(109,40,217,0.15)': 'rgba(255,255,255,0.07)',
    cardBg:         L ? 'rgba(255,255,255,0.92)': 'rgba(255,255,255,0.04)',
    dangerBg:       L ? 'rgba(239,68,68,0.06)' : 'rgba(239,68,68,0.05)',
  };
}

/* ─── Translation map ─── */
const translations: Record<Language, Record<string, string>> = {
  en: {
    // TopNav
    'topnav.search': 'Search meetings...',
    'topnav.upload': 'Upload Recording',

    // Sidebar nav
    'nav.dashboard': 'Dashboard',
    'nav.meetings': 'Meetings',
    'nav.intelligence': 'Meeting Intelligence',
    'nav.actionItems': 'Action Items',
    'nav.decisions': 'Decisions',
    'nav.analytics': 'Team Analytics',
    'nav.integrations': 'Integrations',
    'nav.settings': 'Settings',
    'nav.workspace': 'Workspace',
    'nav.billing': 'Billing',

    // Profile dropdown
    'profile.profile': 'Profile Info',
    'profile.email': 'Email Settings',
    'profile.notifications': 'Notifications',
    'profile.privacy': 'Privacy & Security',
    'profile.help': 'Help & Support',
    'profile.signout': 'Sign Out',
    'profile.plan': 'Pro Plan',

    // Dashboard
    'dashboard.subtitle': "Here's your AI meeting intelligence overview for today — Thursday, March 19",
    'dashboard.productivityScore': 'Productivity Score',
    'dashboard.meetingsWeek': 'Meetings This Week',
    'dashboard.decisionsExtracted': 'Decisions Extracted',
    'dashboard.actionItems': 'Action Items Created',
    'dashboard.productivityTrend': 'Meeting Productivity Trend',
    'dashboard.productivityTrendSub': 'Last 6 weeks performance',
    'dashboard.timeDistribution': 'Meeting Time Distribution',
    'dashboard.timeDistributionSub': 'Hours per team this week',
    'dashboard.effectiveness': 'Meeting Effectiveness',
    'dashboard.wasteDetection': 'Waste detection',
    'dashboard.productive': 'productive',
    'dashboard.aiInsights': 'AI Insights',
    'dashboard.aiInsightsSub': 'Powered by GPT-4 Turbo',
    'dashboard.processing': 'Processing',
    'dashboard.recentMeetings': 'Recent Meetings',
    'dashboard.meetingsAnalyzed': 'meetings analyzed',
    'dashboard.viewAll': 'View all →',
    'dashboard.live': 'Live',

    // Table headers
    'table.meeting': 'Meeting',
    'table.date': 'Date',
    'table.platform': 'Platform',
    'table.participants': 'Participants',
    'table.duration': 'Duration',
    'table.score': 'Score',
    'table.decisions': 'Decisions',
    'table.actions': 'Actions',

    // AI insights texts
    'insight.1.title': 'Meeting frequency increased by 18% this week.',
    'insight.1.sub': 'Consider consolidating recurring meetings to reduce fatigue.',
    'insight.2.title': 'Decision rate dropped by 12% vs last week.',
    'insight.2.sub': 'Meetings may need clearer agendas and defined objectives.',
    'insight.3.title': 'Productivity score trending upward (+5 pts).',
    'insight.3.sub': 'Great work on keeping meetings focused and action-oriented!',

    // Alerts
    'alerts.title': 'Productivity Alerts',
    'alerts.1.msg': 'Product team meetings average 63 minutes',
    'alerts.1.hint': 'Consider 45-minute time limits',
    'alerts.2.msg': 'Sales meetings produce few action items',
    'alerts.2.hint': 'Encourage clear next steps in each call',
    'alerts.3.msg': '3 decisions have no assigned owner',
    'alerts.3.hint': 'Assign owners to increase accountability',

    // Upcoming
    'upcoming.title': 'Upcoming Meetings',
    'upcoming.in2h': 'In 2h',
    'upcoming.tomorrow': 'Tomorrow',
    'upcoming.fri': 'Fri',

    // Meetings page
    'meetings.title': 'Meetings',
    'meetings.subtitle': 'View and analyze all your recorded meetings',
    'meetings.totalMeetings': 'Total Meetings',
    'meetings.avgDuration': 'Avg Duration',
    'meetings.avgScore': 'Avg Score',
    'meetings.search': 'Search meetings...',
    'meetings.filter': 'Filter',
    'meetings.date': 'Date',
    'meetings.noResults': 'No meetings found',

    // Action Items
    'actions.title': 'Action Items',
    'actions.subtitle': 'Track and manage action items from your meetings',
    'actions.total': 'Total',
    'actions.pending': 'Pending',
    'actions.inProgress': 'In Progress',
    'actions.completed': 'Completed',
    'actions.search': 'Search tasks or owners...',
    'actions.all': 'All',
    'actions.task': 'Task',
    'actions.owner': 'Owner',
    'actions.dueDate': 'Due Date',
    'actions.status': 'Status',
    'actions.source': 'Meeting Source',
    'actions.noResults': 'No action items found',
    'actions.overdue': 'Overdue',
    'actions.pendingLabel': 'Pending',
    'actions.inProgressLabel': 'In Progress',
    'actions.completedLabel': 'Completed',

    // Decisions
    'decisions.title': 'Decisions Tracker',
    'decisions.subtitle': 'Track and manage decisions extracted from meetings',
    'decisions.total': 'Total',
    'decisions.new': 'New',
    'decisions.inProgress': 'In Progress',
    'decisions.completed': 'Completed',
    'decisions.newDecisions': 'New Decisions',
    'decisions.all': 'All',
    'decisions.due': 'Due',
    'decisions.from': 'From:',
    'decisions.selectAll': 'Select "All" to see more',

    // Intelligence page
    'intelligence.title': 'Meeting Intelligence',
    'intelligence.subtitle': 'AI-powered insights from your meetings',
    'intelligence.totalInsights': 'Total Insights Generated',
    'intelligence.risksDetected': 'Risks Detected',
    'intelligence.opportunities': 'Opportunities Found',
    'intelligence.aiRecommendations': 'AI Recommendations',
    'intelligence.poweredBy': 'Powered by GPT-4 Turbo',
    'intelligence.rec1.title': 'Consolidate recurring meetings',
    'intelligence.rec1.sub': 'Your team has 12 recurring meetings. Consider consolidating similar meetings to save 4 hours per week.',
    'intelligence.rec2.title': 'Use async updates for status meetings',
    'intelligence.rec2.sub': '23% of your meetings could be replaced with async updates in Slack or email, freeing up time for deep work.',
    'intelligence.rec3.title': 'Improve meeting agendas',
    'intelligence.rec3.sub': 'Meetings with clear agendas have 2.3x more decisions. Share agendas 24 hours before meetings.',
    'intelligence.recentTitle': 'Recent Meeting Intelligence',
    'intelligence.recentSub': 'AI-generated insights from your latest meetings',
    'intelligence.keyHighlights': 'Key Highlights',
    'intelligence.risksSection': 'Risks Detected',
    'intelligence.decisionsUnit': 'decisions',
    'intelligence.actionsUnit': 'actions',
    'intelligence.participantsUnit': 'participants',
    'intelligence.wasteTitle': 'Meeting Waste Detection',
    'intelligence.waste1.name': 'Product Roadmap Discussion',
    'intelligence.waste1.badge': 'Low Productivity',
    'intelligence.waste1.issue1': 'This meeting could have been an email',
    'intelligence.waste1.issue2': 'No clear agenda was shared beforehand',
    'intelligence.waste1.issue3': 'Meeting exceeded planned duration by 18 minutes',
    'intelligence.waste2.name': 'Sales Team Sync',
    'intelligence.waste2.badge': 'Moderate Concerns',
    'intelligence.waste2.issue1': 'Participation imbalance — 2 people spoke 80% of the time',
    'intelligence.waste2.issue2': 'Few action items created for meeting duration',

    // Analytics
    'analytics.title': 'Team Analytics',
    'analytics.subtitle': 'Analyze meeting patterns and team productivity across your organization',
    'analytics.avgScore': 'Avg Productivity Score',
    'analytics.meetingsWeek': 'Meetings / Week',
    'analytics.avgDuration': 'Avg Duration',
    'analytics.waste': 'Meeting Waste',
    'analytics.trend': 'Meeting Productivity Trend',
    'analytics.trendSub': '6-week trend across all teams',
    'analytics.performance': 'Team Performance Details',
    'analytics.wasteTitle': 'Meeting Waste Detection',
    'analytics.wasteSub': 'Effectiveness analysis by team',
    'analytics.recommendations': 'AI Recommendations',
    'analytics.recommendationsSub': 'Personalized insights for your team',
    'analytics.meetingsPerWeek': 'Meetings Per Week',
    'analytics.volumeByTeam': 'Volume by team',
    'analytics.decisionRateTitle': 'Decision Rate by Team',
    'analytics.decisionRateSub': '% of meetings with clear decisions',
    'analytics.productive': 'Productive',
    'analytics.neutral': 'Neutral',
    'analytics.wasteful': 'Wasteful',
    'analytics.couldBeAsync': 'could be async',
    'analytics.live': 'Live',
    'analytics.meetingsWkLabel': 'Meetings/week',
    'analytics.decisionRateLabel': 'Decision rate',
    'analytics.avgDurationLabel': 'Avg duration',
    'analytics.deltaFromLastMonth': '+3 from last month',
    'analytics.deltaFromLastWeek': '+8 from last week',
    'analytics.deltaMinImprovement': '-5min improvement',
    'analytics.deltaWaste': '-3% from last month',
    'analytics.rec1.title': 'Sales team has high meeting volume',
    'analytics.rec1.sub': 'Consider consolidating daily check-ins into bi-weekly meetings.',
    'analytics.rec2.title': 'Marketing meetings exceed optimal duration',
    'analytics.rec2.sub': 'Try setting 45-minute limits to improve focus and decision-making.',
    'analytics.rec3.title': 'Product team shows excellent meeting discipline',
    'analytics.rec3.sub': 'Share their best practices with other teams for improved efficiency.',

    // Integrations
    'integrations.title': 'Integrations',
    'integrations.subtitle': 'Connect your tools to automate workflows and sync data',
    'integrations.platforms': 'Meeting Platforms',
    'integrations.platformsSub': 'Connect your video conferencing tools',
    'integrations.productivity': 'Productivity Tools',
    'integrations.productivitySub': 'Sync data with your favorite apps',
    'integrations.help': 'Need help with integrations?',
    'integrations.helpSub': 'Check our documentation or contact support to set up custom workflows.',
    'integrations.viewDocs': 'View Documentation',
    'integrations.contact': 'Contact Support',
    'integrations.connect': 'Connect',
    'integrations.configure': 'Configure',
    'integrations.connected': 'Connected',

    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Manage your account and preferences',
    'settings.profile': 'Profile',
    'settings.workspace': 'Workspace',
    'settings.security': 'Security',
    'settings.billing': 'Billing',
    'settings.privacy': 'Data Privacy',
    'settings.notifications': 'Notifications',
    'settings.profileInfo': 'Profile Information',
    'settings.profileInfoSub': 'Update your personal information',
    'settings.changeAvatar': 'Change Avatar',
    'settings.avatarHint': 'JPG, PNG or GIF. Max size 2MB.',
    'settings.avatarHintCustom': 'JPG, JPEG, or PNG. Max size 2MB.',
    'settings.firstName': 'First Name',
    'settings.lastName': 'Last Name',
    'settings.email': 'Email',
    'settings.jobTitle': 'Job Title',
    'settings.cancel': 'Cancel',
    'settings.save': 'Save Changes',
    'settings.workspaceSettingsTitle': 'Workspace Settings',
    'settings.workspaceSettingsSub': 'Manage your workspace configuration',
    'settings.workspaceName': 'Workspace Name',
    'settings.workspaceUrl': 'Workspace URL',
    'settings.dangerZone': 'Danger Zone',
    'settings.dangerZoneSub': 'Deleting your workspace will permanently remove all meetings, data, and settings. This action cannot be undone.',
    'settings.deleteWorkspace': 'Delete Workspace',
    'settings.securitySettingsTitle': 'Security Settings',
    'settings.securitySettingsSub': 'Manage your account security',
    'settings.currentPassword': 'Current Password',
    'settings.newPassword': 'New Password',
    'settings.confirmPassword': 'Confirm New Password',
    'settings.updatePassword': 'Update Password',
    'settings.securityStatus': 'Security Status',
    'settings.encryptionEnabled': 'Encryption enabled',
    'settings.soc2': 'SOC2 compliant',
    'settings.gdpr': 'GDPR compliant',
    'settings.currentPlan': 'Current Plan',
    'settings.proPlan': 'Pro Plan',
    'settings.active': 'Active',
    'settings.planDetails': '$29 / user / month · Renews Apr 1, 2026',
    'settings.changePlan': 'Change Plan',
    'settings.paymentMethod': 'Payment Method',
    'settings.cardExpiry': 'Expires 12/2026',
    'settings.updateCard': 'Update',
    'settings.billingHistory': 'Billing History',
    'settings.paid': 'Paid',
    'settings.download': 'Download',
    'settings.dataPrivacyTitle': 'Data Privacy',
    'settings.dataPrivacySub': 'Control how your data is used and stored',
    'settings.dataRetention': 'Data Retention',
    'settings.dataRetentionSub': 'Keep meeting data for 90 days',
    'settings.analyticsLabel': 'Analytics',
    'settings.analyticsSub': 'Allow usage analytics for improvement',
    'settings.shareWithTeam': 'Share with Team',
    'settings.shareWithTeamSub': 'Allow team members to view your meetings',
    'settings.exportData': 'Export All Data',
    'settings.exportDataHint': 'Download a copy of all your meeting data',
    'settings.notifPrefsTitle': 'Notification Preferences',
    'settings.notifPrefsSub': 'Choose what notifications you receive',
    'settings.emailNotifs': 'Email Notifications',
    'settings.meetingSummaries': 'Meeting summaries',
    'settings.meetingSummariesSub': 'Receive summary after each meeting',
    'settings.actionReminders': 'Action item reminders',
    'settings.actionRemindersSub': 'Get reminded about pending tasks',
    'settings.decisionUpdates': 'Decision updates',
    'settings.decisionUpdatesSub': 'Notifications when decisions change status',
    'settings.weeklyReports': 'Weekly reports',
    'settings.weeklyReportsSub': 'Weekly productivity and analytics report',
    'settings.savePrefs': 'Save Preferences',
    'settings.profileUpdated': 'Profile information updated.',
    'settings.profileUpdateFailed': 'Profile could not be saved.',
    'settings.workspaceUpdated': 'Workspace updated.',
    'settings.workspaceUpdateFailed': 'Workspace could not be saved.',
    'settings.invalidAvatarType': 'Please choose a JPG, JPEG, or PNG file.',

    // Theme
    'theme.light': 'Light',
    'theme.dark': 'Dark',

    // Common
    'common.filter': 'Filter',
    'common.search': 'Search',
    'common.all': 'All',

    // Meeting Detail
    'detail.insights': 'Insights',
    'detail.transcript': 'Transcript',
    'detail.decisions': 'Decisions',
    'detail.actions': 'Action Items',
    'detail.aiSummary': 'AI Summary',
    'detail.keyHighlights': 'Key Highlights',
    'detail.riskDetection': 'Risk Detection',
    'detail.meetingTranscript': 'Meeting Transcript',
    'detail.transcriptUnavailable': 'Transcript not available for this meeting',
    'detail.decisionsMade': 'Decisions Made',
    'detail.decisionDuring': 'Decision made during discussion',
    'detail.actionItems': 'Action Items',
    'detail.assignedTo': 'Assigned to:',
    'detail.due': 'Due:',
    'detail.meetingScore': 'Meeting Score',
    'detail.participationBalance': 'Participation Balance',
    'detail.decisionRate': 'Decision Rate',
    'detail.actionItemRate': 'Action Item Rate',
    'detail.backToMeetings': 'Back to meetings',
    'detail.meetingNotFound': 'Meeting not found',
  },

  tr: {
    // TopNav
    'topnav.search': 'Toplantı ara...',
    'topnav.upload': 'Kayıt Yükle',

    // Sidebar nav
    'nav.dashboard': 'Kontrol Paneli',
    'nav.meetings': 'Toplantılar',
    'nav.intelligence': 'Toplantı Zekası',
    'nav.actionItems': 'Eylem Öğeleri',
    'nav.decisions': 'Kararlar',
    'nav.analytics': 'Ekip Analitiği',
    'nav.integrations': 'Entegrasyonlar',
    'nav.settings': 'Ayarlar',
    'nav.workspace': 'Çalışma Alanı',
    'nav.billing': 'Faturalama',

    // Profile dropdown
    'profile.profile': 'Profil Bilgileri',
    'profile.email': 'E-posta Ayarları',
    'profile.notifications': 'Bildirimler',
    'profile.privacy': 'Gizlilik & Güvenlik',
    'profile.help': 'Yardım & Destek',
    'profile.signout': 'Çıkış Yap',
    'profile.plan': 'Pro Plan',

    // Dashboard
    'dashboard.subtitle': 'Bugün için AI toplantı zekası özetiniz — 19 Mart, Perşembe',
    'dashboard.productivityScore': 'Verimlilik Puanı',
    'dashboard.meetingsWeek': 'Bu Haftaki Toplantılar',
    'dashboard.decisionsExtracted': 'Alınan Kararlar',
    'dashboard.actionItems': 'Oluşturulan Eylemler',
    'dashboard.productivityTrend': 'Toplantı Verimlilik Trendi',
    'dashboard.productivityTrendSub': 'Son 6 haftalık performans',
    'dashboard.timeDistribution': 'Toplantı Süresi Dağılımı',
    'dashboard.timeDistributionSub': 'Bu hafta ekip başına saat',
    'dashboard.effectiveness': 'Toplantı Etkinliği',
    'dashboard.wasteDetection': 'Verimsizlik analizi',
    'dashboard.productive': 'verimli',
    'dashboard.aiInsights': 'AI Öngörüleri',
    'dashboard.aiInsightsSub': 'GPT-4 Turbo ile güçlendirildi',
    'dashboard.processing': 'İşleniyor',
    'dashboard.recentMeetings': 'Son Toplantılar',
    'dashboard.meetingsAnalyzed': 'toplantı analiz edildi',
    'dashboard.viewAll': 'Tümünü gör →',
    'dashboard.live': 'Canlı',

    // Table headers
    'table.meeting': 'Toplantı',
    'table.date': 'Tarih',
    'table.platform': 'Platform',
    'table.participants': 'Katılımcılar',
    'table.duration': 'Süre',
    'table.score': 'Puan',
    'table.decisions': 'Kararlar',
    'table.actions': 'Eylemler',

    // AI insights texts
    'insight.1.title': 'Bu hafta toplantı sıklığı %18 arttı.',
    'insight.1.sub': 'Yorgunluğu azaltmak için tekrarlayan toplantıları birleştirmeyi düşünün.',
    'insight.2.title': 'Karar alma oranı geçen haftaya göre %12 düştü.',
    'insight.2.sub': 'Toplantıların daha net gündemleri ve hedefleri olması gerekebilir.',
    'insight.3.title': 'Verimlilik puanı yükseliyor (+5 puan).',
    'insight.3.sub': 'Toplantıları odaklı ve eyleme yönelik tuttuğunuz için tebrikler!',

    // Alerts
    'alerts.title': 'Verimlilik Uyarıları',
    'alerts.1.msg': 'Ürün ekibi toplantıları ortalama 63 dakika sürüyor',
    'alerts.1.hint': '45 dakikalık zaman sınırını düşünün',
    'alerts.2.msg': 'Satış toplantıları az eylem öğesi üretiyor',
    'alerts.2.hint': 'Her görüşmede net adımları teşvik edin',
    'alerts.3.msg': '3 kararın atanmış sahibi yok',
    'alerts.3.hint': 'Hesap verebilirliği artırmak için sahip atayın',

    // Upcoming
    'upcoming.title': 'Yaklaşan Toplantılar',
    'upcoming.in2h': '2s sonra',
    'upcoming.tomorrow': 'Yarın',
    'upcoming.fri': 'Cum',

    // Meetings page
    'meetings.title': 'Toplantılar',
    'meetings.subtitle': 'Tüm kayıtlı toplantılarınızı görüntüleyin ve analiz edin',
    'meetings.totalMeetings': 'Toplam Toplantı',
    'meetings.avgDuration': 'Ort. Süre',
    'meetings.avgScore': 'Ort. Puan',
    'meetings.search': 'Toplantı ara...',
    'meetings.filter': 'Filtrele',
    'meetings.date': 'Tarih',
    'meetings.noResults': 'Toplantı bulunamadı',

    // Action Items
    'actions.title': 'Eylem Öğeleri',
    'actions.subtitle': 'Toplantılarınızdan çıkan eylem öğelerini takip edin',
    'actions.total': 'Toplam',
    'actions.pending': 'Bekliyor',
    'actions.inProgress': 'Devam Ediyor',
    'actions.completed': 'Tamamlandı',
    'actions.search': 'Görev veya sorumlu ara...',
    'actions.all': 'Tümü',
    'actions.task': 'Görev',
    'actions.owner': 'Sorumlu',
    'actions.dueDate': 'Son Tarih',
    'actions.status': 'Durum',
    'actions.source': 'Toplantı Kaynağı',
    'actions.noResults': 'Eylem öğesi bulunamadı',
    'actions.overdue': 'Gecikmiş',
    'actions.pendingLabel': 'Bekliyor',
    'actions.inProgressLabel': 'Devam Ediyor',
    'actions.completedLabel': 'Tamamlandı',

    // Decisions
    'decisions.title': 'Karar Takip Sistemi',
    'decisions.subtitle': 'Toplantılardan çıkan kararları takip edin ve yönetin',
    'decisions.total': 'Toplam',
    'decisions.new': 'Yeni',
    'decisions.inProgress': 'Devam Ediyor',
    'decisions.completed': 'Tamamlandı',
    'decisions.newDecisions': 'Yeni Kararlar',
    'decisions.all': 'Tümü',
    'decisions.due': 'Son tarih',
    'decisions.from': 'Kaynak:',
    'decisions.selectAll': '"Tümü" seçeneğini seçerek daha fazlasını görün',

    // Intelligence page
    'intelligence.title': 'Toplantı Zekası',
    'intelligence.subtitle': 'Toplantılarınızdan AI destekli içgörüler',
    'intelligence.totalInsights': 'Oluşturulan Toplam İçgörü',
    'intelligence.risksDetected': 'Tespit Edilen Riskler',
    'intelligence.opportunities': 'Bulunan Fırsatlar',
    'intelligence.aiRecommendations': 'AI Önerileri',
    'intelligence.poweredBy': 'GPT-4 Turbo ile desteklendi',
    'intelligence.rec1.title': 'Tekrarlayan toplantıları birleştirin',
    'intelligence.rec1.sub': 'Ekibinizin 12 tekrarlayan toplantısı var. Benzer toplantıları birleştirerek haftada 4 saat tasarruf edebilirsiniz.',
    'intelligence.rec2.title': 'Durum toplantıları için asenkron güncellemeler kullanın',
    'intelligence.rec2.sub': 'Toplantılar��nızın %23\'ü Slack veya e-posta üzerinden asenkron güncellemelerle değiştirilebilir.',
    'intelligence.rec3.title': 'Toplantı gündemlerini iyileştirin',
    'intelligence.rec3.sub': 'Net gündemlere sahip toplantılarda 2,3 kat daha fazla karar alınıyor. Gündemleri 24 saat önceden paylaşın.',
    'intelligence.recentTitle': 'Son Toplantı Zekası',
    'intelligence.recentSub': 'En son toplantılarınızdan AI tarafından oluşturulan içgörüler',
    'intelligence.keyHighlights': 'Önemli Öne Çıkanlar',
    'intelligence.risksSection': 'Riskler Tespit Edildi',
    'intelligence.decisionsUnit': 'karar',
    'intelligence.actionsUnit': 'eylem',
    'intelligence.participantsUnit': 'katılımcı',
    'intelligence.wasteTitle': 'Toplantı Verimsizlik Tespiti',
    'intelligence.waste1.name': 'Ürün Yol Haritası Tartışması',
    'intelligence.waste1.badge': 'Düşük Verimlilik',
    'intelligence.waste1.issue1': 'Bu toplantı bir e-posta olabilirdi',
    'intelligence.waste1.issue2': 'Önceden net bir gündem paylaşılmadı',
    'intelligence.waste1.issue3': 'Toplantı planlanan süreden 18 dakika fazla sürdü',
    'intelligence.waste2.name': 'Satış Ekibi Senkronizasyonu',
    'intelligence.waste2.badge': 'Orta Düzey Endişeler',
    'intelligence.waste2.issue1': 'Katılım dengesizliği — 2 kişi zamanın %80\'ini konuştu',
    'intelligence.waste2.issue2': 'Toplantı süresine göre az eylem öğesi oluşturuldu',

    // Analytics
    'analytics.title': 'Ekip Analitiği',
    'analytics.subtitle': 'Organizasyonunuzdaki toplantı kalıplarını ve ekip verimliliğini analiz edin',
    'analytics.avgScore': 'Ort. Verimlilik Puanı',
    'analytics.meetingsWeek': 'Toplantı / Hafta',
    'analytics.avgDuration': 'Ort. Süre',
    'analytics.waste': 'Toplantı İsrafı',
    'analytics.trend': 'Toplantı Verimlilik Trendi',
    'analytics.trendSub': 'Tüm ekiplerde 6 haftalık trend',
    'analytics.performance': 'Ekip Performans Detayları',
    'analytics.wasteTitle': 'Toplantı Verimsizlik Tespiti',
    'analytics.wasteSub': 'Ekibe göre etkinlik analizi',
    'analytics.recommendations': 'AI Önerileri',
    'analytics.recommendationsSub': 'Ekibiniz için kişiselleştirilmiş içgörüler',
    'analytics.meetingsPerWeek': 'Haftalık Toplantılar',
    'analytics.volumeByTeam': 'Ekibe göre hacim',
    'analytics.decisionRateTitle': 'Ekibe Göre Karar Oranı',
    'analytics.decisionRateSub': 'Net kararların alındığı toplantı yüzdesi',
    'analytics.productive': 'Verimli',
    'analytics.neutral': 'Nötr',
    'analytics.wasteful': 'Verimsiz',
    'analytics.couldBeAsync': 'asenkron olabilir',
    'analytics.live': 'Canlı',
    'analytics.meetingsWkLabel': 'Toplantı/hafta',
    'analytics.decisionRateLabel': 'Karar oranı',
    'analytics.avgDurationLabel': 'Ort. süre',
    'analytics.deltaFromLastMonth': 'Geçen aydan +3',
    'analytics.deltaFromLastWeek': 'Geçen haftadan +8',
    'analytics.deltaMinImprovement': '-5dk iyileşme',
    'analytics.deltaWaste': 'Geçen aydan -%3',
    'analytics.rec1.title': 'Satış ekibinin toplantı hacmi yüksek',
    'analytics.rec1.sub': 'Günlük kontrolleri iki haftada bir toplantıya dönüştürmeyi düşünün.',
    'analytics.rec2.title': 'Pazarlama toplantıları optimum süreyi aşıyor',
    'analytics.rec2.sub': 'Odaklanmayı ve karar almayı geliştirmek için 45 dakikalık sınır koymayı deneyin.',
    'analytics.rec3.title': 'Ürün ekibi mükemmel toplantı disiplini gösteriyor',
    'analytics.rec3.sub': 'Verimlilik için en iyi uygulamalarını diğer ekiplerle paylaşın.',

    // Integrations
    'integrations.title': 'Entegrasyonlar',
    'integrations.subtitle': 'Araçlarınızı bağlayın ve iş akışlarını otomatikleştirin',
    'integrations.platforms': 'Toplantı Platformları',
    'integrations.platformsSub': 'Video konferans araçlarınızı bağlayın',
    'integrations.productivity': 'Üretkenlik Araçları',
    'integrations.productivitySub': 'Favori uygulamalarınızla veri senkronizasyonu yapın',
    'integrations.help': 'Entegrasyonlarla ilgili yardıma mı ihtiyacınız var?',
    'integrations.helpSub': 'Özel iş akışları kurmak için belgelerimizi inceleyin veya destek ekibimizle iletişime geçin.',
    'integrations.viewDocs': 'Belgeleri İncele',
    'integrations.contact': 'Destek Al',
    'integrations.connect': 'Bağlan',
    'integrations.configure': 'Yapılandır',
    'integrations.connected': 'Bağlandı',

    // Settings
    'settings.title': 'Ayarlar',
    'settings.subtitle': 'Hesabınızı ve tercihlerinizi yönetin',
    'settings.profile': 'Profil',
    'settings.workspace': 'Çalışma Alanı',
    'settings.security': 'Güvenlik',
    'settings.billing': 'Faturalama',
    'settings.privacy': 'Veri Gizliliği',
    'settings.notifications': 'Bildirimler',
    'settings.profileInfo': 'Profil Bilgileri',
    'settings.profileInfoSub': 'Kişisel bilgilerinizi güncelleyin',
    'settings.changeAvatar': 'Avatar Değiştir',
    'settings.avatarHint': 'JPG, PNG veya GIF. Maks. boyut 2MB.',
    'settings.avatarHintCustom': 'JPG, JPEG veya PNG. Maks. boyut 2MB.',
    'settings.firstName': 'Ad',
    'settings.lastName': 'Soyad',
    'settings.email': 'E-posta',
    'settings.jobTitle': 'Unvan',
    'settings.cancel': 'İptal',
    'settings.save': 'Değişiklikleri Kaydet',
    'settings.workspaceSettingsTitle': 'Çalışma Alanı Ayarları',
    'settings.workspaceSettingsSub': 'Çalışma alanı yapılandırmanızı yönetin',
    'settings.workspaceName': 'Çalışma Alanı Adı',
    'settings.workspaceUrl': 'Çalışma Alanı URL\'si',
    'settings.dangerZone': 'Tehlikeli Bölge',
    'settings.dangerZoneSub': 'Çalışma alanınızı silmek tüm toplantıları, verileri ve ayarları kalıcı olarak kaldırır. Bu işlem geri alınamaz.',
    'settings.deleteWorkspace': 'Çalışma Alanını Sil',
    'settings.securitySettingsTitle': 'Güvenlik Ayarları',
    'settings.securitySettingsSub': 'Hesap güvenliğinizi yönetin',
    'settings.currentPassword': 'Mevcut Şifre',
    'settings.newPassword': 'Yeni Şifre',
    'settings.confirmPassword': 'Yeni Şifreyi Onayla',
    'settings.updatePassword': 'Şifreyi Güncelle',
    'settings.securityStatus': 'Güvenlik Durumu',
    'settings.encryptionEnabled': 'Şifreleme etkin',
    'settings.soc2': 'SOC2 uyumlu',
    'settings.gdpr': 'GDPR uyumlu',
    'settings.currentPlan': 'Mevcut Plan',
    'settings.proPlan': 'Pro Plan',
    'settings.active': 'Aktif',
    'settings.planDetails': '$29 / kullanıcı / ay · 1 Nis 2026\'da yenilenir',
    'settings.changePlan': 'Planı Değiştir',
    'settings.paymentMethod': 'Ödeme Yöntemi',
    'settings.cardExpiry': 'Son kullanma 12/2026',
    'settings.updateCard': 'Güncelle',
    'settings.billingHistory': 'Fatura Geçmişi',
    'settings.paid': 'Ödendi',
    'settings.download': 'İndir',
    'settings.dataPrivacyTitle': 'Veri Gizliliği',
    'settings.dataPrivacySub': 'Verilerinizin nasıl kullanıldığını ve saklandığını kontrol edin',
    'settings.dataRetention': 'Veri Saklama',
    'settings.dataRetentionSub': 'Toplantı verilerini 90 gün saklayın',
    'settings.analyticsLabel': 'Analitik',
    'settings.analyticsSub': 'İyileştirme için kullanım analitiğine izin verin',
    'settings.shareWithTeam': 'Ekiple Paylaş',
    'settings.shareWithTeamSub': 'Ekip üyelerinin toplantılarınızı görüntülemesine izin verin',
    'settings.exportData': 'Tüm Verileri Dışa Aktar',
    'settings.exportDataHint': 'Tüm toplantı verilerinizin bir kopyasını indirin',
    'settings.notifPrefsTitle': 'Bildirim Tercihleri',
    'settings.notifPrefsSub': 'Hangi bildirimleri alacağınızı seçin',
    'settings.emailNotifs': 'E-posta Bildirimleri',
    'settings.meetingSummaries': 'Toplantı özetleri',
    'settings.meetingSummariesSub': 'Her toplantıdan sonra özet alın',
    'settings.actionReminders': 'Eylem öğesi hatırlatıcıları',
    'settings.actionRemindersSub': 'Bekleyen görevler için hatırlatıcı alın',
    'settings.decisionUpdates': 'Karar güncellemeleri',
    'settings.decisionUpdatesSub': 'Kararlar durum değiştirdiğinde bildirim alın',
    'settings.weeklyReports': 'Haftalık raporlar',
    'settings.weeklyReportsSub': 'Haftalık verimlilik ve analitik raporu',
    'settings.savePrefs': 'Tercihleri Kaydet',
    'settings.profileUpdated': 'Profil bilgileri güncellendi.',
    'settings.profileUpdateFailed': 'Profil kaydedilemedi.',
    'settings.workspaceUpdated': 'Çalışma alanı güncellendi.',
    'settings.workspaceUpdateFailed': 'Çalışma alanı kaydedilemedi.',
    'settings.invalidAvatarType': 'Lütfen sadece JPG, JPEG veya PNG seçin.',

    // Theme
    'theme.light': 'Açık',
    'theme.dark': 'Koyu',

    // Common
    'common.filter': 'Filtrele',
    'common.search': 'Ara',
    'common.all': 'Tümü',

    // Meeting Detail
    'detail.insights': 'İçgörüler',
    'detail.transcript': 'Transkript',
    'detail.decisions': 'Kararlar',
    'detail.actions': 'Eylem Öğeleri',
    'detail.aiSummary': 'AI Özeti',
    'detail.keyHighlights': 'Öne Çıkanlar',
    'detail.riskDetection': 'Risk Tespiti',
    'detail.meetingTranscript': 'Toplantı Transkripti',
    'detail.transcriptUnavailable': 'Bu toplantı için transkript mevcut değil',
    'detail.decisionsMade': 'Alınan Kararlar',
    'detail.decisionDuring': 'Tartışma sırasında alınan karar',
    'detail.actionItems': 'Eylem Öğeleri',
    'detail.assignedTo': 'Atanan:',
    'detail.due': 'Son tarih:',
    'detail.meetingScore': 'Toplantı Puanı',
    'detail.participationBalance': 'Katılım Dengesi',
    'detail.decisionRate': 'Karar Oranı',
    'detail.actionItemRate': 'Eylem Öğesi Oranı',
    'detail.backToMeetings': 'Toplantılara dön',
    'detail.meetingNotFound': 'Toplantı bulunamadı',
  },
};

export function AppProvider({ children }: { children: ReactNode }) {
  const { appUser, updatePreferences } = useAuth();
  const [language, setLanguageState] = useState<Language>(() => {
    return (localStorage.getItem('meetinsight-lang') as Language) || 'en';
  });
  const [theme, setThemeState] = useState<Theme>(() => {
    return (localStorage.getItem('meetinsight-theme') as Theme) || 'dark';
  });

  const setLanguage = async (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('meetinsight-lang', lang);
    await updatePreferences({ language: lang });
  };

  const setTheme = async (t: Theme) => {
    setThemeState(t);
    localStorage.setItem('meetinsight-theme', t);
    await updatePreferences({ theme: t });
  };

  const toggleTheme = async () => setTheme(theme === 'dark' ? 'light' : 'dark');

  const t = (key: string): string => {
    const val = translations[language][key] ?? translations['en'][key];
    if (val === undefined) {
      return key;
    }
    return val;
  };

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
      root.classList.remove('theme-dark');
    } else {
      root.classList.remove('theme-light');
      root.classList.add('theme-dark');
    }
  }, [theme]);

  useEffect(() => {
    const nextLanguage =
      appUser?.language === 'tr' || appUser?.language === 'en'
        ? appUser.language
        : null;

    if (nextLanguage && nextLanguage !== language) {
      setLanguageState(nextLanguage);
      localStorage.setItem('meetinsight-lang', nextLanguage);
    }
  }, [appUser?.language, language]);

  useEffect(() => {
    const nextTheme =
      appUser?.theme === 'light' || appUser?.theme === 'dark'
        ? appUser.theme
        : null;

    if (nextTheme && nextTheme !== theme) {
      setThemeState(nextTheme);
      localStorage.setItem('meetinsight-theme', nextTheme);
    }
  }, [appUser?.theme, theme]);

  // İlk yüklemede html'e koyu mod sınıfını hemen uygula
  useEffect(() => {
    const saved = localStorage.getItem('meetinsight-theme') as Theme | null;
    const initial = saved || 'dark';
    if (initial === 'light') {
      document.documentElement.classList.add('theme-light');
    } else {
      document.documentElement.classList.remove('theme-light');
      document.documentElement.classList.add('theme-dark');
    }
  }, []);

  return (
    <AppContext.Provider value={{ language, setLanguage, theme, setTheme, toggleTheme, t }}>
      {children}
    </AppContext.Provider>
  );
}
