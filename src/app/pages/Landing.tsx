import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import {
  Brain,
  Play,
  Check,
  ArrowRight,
  X,
  Mic,
  Zap,
  BarChart3,
  Users,
  Target,
  Star,
  ChevronRight,
  Sparkles,
  Shield,
  Lock,
  Globe,
  TrendingUp,
  MessageSquare,
  CheckCircle2,
  Activity,
  Layers,
  Menu,
  ChevronDown,
} from 'lucide-react';

/* ─────────────────────────────────────────── tiny helpers ── */

function cn(...classes: (string | false | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

/* ──────────────────────────────── Pricing Card ── */
function PricingCard({
  children,
  isPro = false,
  accentColor = 'rgba(99,102,241,',
}: {
  children: React.ReactNode;
  isPro?: boolean;
  accentColor?: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="relative rounded-2xl p-8 cursor-default"
      style={{
        background: isPro
          ? hovered
            ? 'linear-gradient(135deg, rgba(99,102,241,0.18) 0%, rgba(168,85,247,0.12) 100%)'
            : 'linear-gradient(135deg, rgba(99,102,241,0.10) 0%, rgba(168,85,247,0.05) 100%)'
          : hovered
          ? 'rgba(255,255,255,0.06)'
          : 'rgba(255,255,255,0.03)',
        border: isPro
          ? `1px solid ${hovered ? 'rgba(99,102,241,0.7)' : 'rgba(99,102,241,0.4)'}`
          : `1px solid ${hovered ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.1)'}`,
        boxShadow: hovered
          ? isPro
            ? `0 0 0 1px rgba(99,102,241,0.3), 0 24px 60px rgba(99,102,241,0.25), 0 0 80px ${accentColor}0.12)`
            : `0 24px 60px rgba(0,0,0,0.4), 0 0 40px ${accentColor}0.15)`
          : isPro
          ? '0 8px 32px rgba(99,102,241,0.10)'
          : 'none',
        transform: hovered ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Glow orbs */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl overflow-hidden"
        style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.5s ease' }}
      >
        <div style={{
          position: 'absolute', width: 200, height: 200, top: -70, right: -50, borderRadius: '50%',
          background: isPro
            ? 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)'
            : `radial-gradient(circle, ${accentColor}0.15) 0%, transparent 70%)`,
          filter: 'blur(24px)',
        }} />
        <div style={{
          position: 'absolute', width: 130, height: 130, bottom: -30, left: -20, borderRadius: '50%',
          background: isPro
            ? 'radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 70%)'
            : `radial-gradient(circle, ${accentColor}0.10) 0%, transparent 70%)`,
          filter: 'blur(18px)',
        }} />
      </div>

      {/* Shimmer top line */}
      <div
        className="absolute top-0 left-0 right-0 h-px rounded-t-2xl"
        style={{
          background: isPro
            ? 'linear-gradient(90deg, transparent, rgba(99,102,241,0.9), rgba(168,85,247,0.9), transparent)'
            : `linear-gradient(90deg, transparent, ${accentColor}0.6), transparent)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />

      {/* Bottom shimmer */}
      <div
        className="absolute bottom-0 left-8 right-8 h-px"
        style={{
          background: isPro
            ? 'linear-gradient(90deg, transparent, rgba(168,85,247,0.5), transparent)'
            : `linear-gradient(90deg, transparent, ${accentColor}0.3), transparent)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.5s ease 0.1s',
        }}
      />

      {children}
    </div>
  );
}

/* ──────────────────────────────────────── animated counter ── */

function AnimatedNumber({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          let start = 0;
          const step = target / 60;
          const timer = setInterval(() => {
            start += step;
            if (start >= target) { setCount(target); clearInterval(timer); }
            else setCount(Math.floor(start));
          }, 16);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

/* ────────────────────────────────────── dashboard mockup ── */

function DashboardMockup() {
  return (
    <div
      className="relative w-full max-w-2xl mx-auto"
      style={{ perspective: '1200px' }}
    >
      {/* glow behind */}
      <div className="absolute inset-0 -z-10 rounded-3xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-blue-500/30 blur-3xl scale-110" />
      {/* browser chrome */}
      <div
        className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
        style={{ transform: 'rotateY(-8deg) rotateX(4deg)', transformStyle: 'preserve-3d' }}
      >
        {/* title bar */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0f0f1a] border-b border-white/10">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-red-500/80" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
            <div className="w-3 h-3 rounded-full bg-green-500/80" />
          </div>
          <div className="flex-1 mx-4">
            <div className="bg-white/10 rounded-md px-3 py-1 text-xs text-white/40 max-w-xs">
              app.meetinsight.ai/dashboard
            </div>
          </div>
        </div>
        {/* dashboard body */}
        <div className="bg-[#0d0d1e] flex h-96">
          {/* sidebar */}
          <div className="w-14 bg-[#080814] flex flex-col items-center py-4 gap-3 border-r border-white/5">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mb-2">
              <Brain className="w-4 h-4 text-white" />
            </div>
            {[BarChart3, MessageSquare, Target, Users, Layers, Shield].map((Icon, i) => (
              <div key={i} className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-colors',
                i === 0 ? 'bg-indigo-600/30 text-indigo-400' : 'text-white/30 hover:text-white/60'
              )}>
                <Icon className="w-4 h-4" />
              </div>
            ))}
          </div>
          {/* main content */}
          <div className="flex-1 overflow-hidden p-4 space-y-3">
            {/* top row */}
            <div className="flex items-center justify-between mb-1">
              <div className="text-white/80 text-sm" style={{ fontSize: '11px' }}>Dashboard</div>
              <div className="flex items-center gap-1">
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600" />
                <div className="w-16 h-2 bg-white/10 rounded-full" style={{ fontSize: '11px' }} />
              </div>
            </div>
            {/* stat cards */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Meetings', val: '48', color: 'from-indigo-600/30 to-purple-600/20', icon: '📅' },
                { label: 'Avg Score', val: '84', color: 'from-emerald-600/20 to-teal-600/10', icon: '⚡' },
                { label: 'Actions', val: '127', color: 'from-orange-600/20 to-amber-600/10', icon: '✅' },
              ].map(({ label, val, color, icon }) => (
                <div key={label} className={cn('rounded-xl p-2 bg-gradient-to-br border border-white/5', color)}>
                  <div style={{ fontSize: '14px' }}>{icon}</div>
                  <div className="text-white" style={{ fontSize: '13px', fontWeight: 700 }}>{val}</div>
                  <div className="text-white/40" style={{ fontSize: '9px' }}>{label}</div>
                </div>
              ))}
            </div>
            {/* meeting list */}
            <div className="rounded-xl bg-white/5 border border-white/5 p-2 space-y-1.5">
              <div className="text-white/50" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Recent Meetings</div>
              {[
                { name: 'Q2 Sprint Planning', score: 92, dur: '48m', color: 'bg-emerald-500' },
                { name: 'Sales Kickoff', score: 76, dur: '62m', color: 'bg-indigo-500' },
                { name: 'Design Review', score: 88, dur: '31m', color: 'bg-purple-500' },
              ].map(({ name, score, dur, color }) => (
                <div key={name} className="flex items-center gap-2 py-1">
                  <div className={cn('w-1.5 h-1.5 rounded-full', color)} />
                  <div className="flex-1 text-white/70" style={{ fontSize: '10px' }}>{name}</div>
                  <div className="text-white/40" style={{ fontSize: '9px' }}>{dur}</div>
                  <div className="text-xs font-bold" style={{ fontSize: '10px', color: score >= 85 ? '#34d399' : '#a78bfa' }}>{score}</div>
                </div>
              ))}
            </div>
            {/* mini chart */}
            <div className="rounded-xl bg-white/5 border border-white/5 p-2">
              <div className="text-white/50 mb-2" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Meeting Score Trend</div>
              <div className="flex items-end gap-1 h-12">
                {[65, 72, 68, 81, 79, 88, 84, 92, 87, 95, 89, 94].map((v, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-sm"
                    style={{
                      height: `${(v / 100) * 100}%`,
                      background: `linear-gradient(to top, #6366f1, #a855f7)`,
                      opacity: 0.6 + i * 0.03,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
          {/* right panel */}
          <div className="w-44 bg-[#0a0a18] border-l border-white/5 p-3 space-y-3 hidden lg:block">
            <div className="text-white/50" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>AI Summary</div>
            <div className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 p-2">
              <div className="flex items-center gap-1 mb-1">
                <Sparkles className="w-2.5 h-2.5 text-indigo-400" />
                <span className="text-indigo-300" style={{ fontSize: '9px' }}>Last Meeting</span>
              </div>
              <div className="space-y-1">
                {['Launched Q2 roadmap', 'Budget approved $240k', 'Sarah leads design sprint'].map((t, i) => (
                  <div key={i} className="flex gap-1">
                    <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span className="text-white/60" style={{ fontSize: '8px', lineHeight: 1.3 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-1.5">
              <div className="text-white/50" style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Talk Time</div>
              {[
                { name: 'Sarah', pct: 35, color: '#6366f1' },
                { name: 'John', pct: 28, color: '#a855f7' },
                { name: 'Emma', pct: 22, color: '#22d3ee' },
                { name: 'Others', pct: 15, color: '#f59e0b' },
              ].map(({ name, pct, color }) => (
                <div key={name}>
                  <div className="flex justify-between" style={{ fontSize: '8px' }}>
                    <span className="text-white/50">{name}</span>
                    <span className="text-white/40">{pct}%</span>
                  </div>
                  <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* floating cards */}
      <div className="absolute -top-4 -right-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 shadow-xl hidden xl:flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center">
          <Zap className="w-3.5 h-3.5 text-emerald-400" />
        </div>
        <div>
          <div className="text-white text-xs font-semibold">Meeting Score</div>
          <div className="text-emerald-400 text-xs">94 / 100 ⬆ +6</div>
        </div>
      </div>
      <div className="absolute -bottom-4 -left-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2.5 shadow-xl hidden xl:flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-indigo-500/20 flex items-center justify-center">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400" />
        </div>
        <div>
          <div className="text-white text-xs font-semibold">3 Actions Generated</div>
          <div className="text-indigo-300 text-xs">Auto-synced to Notion</div>
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────── main ── */

export function Landing() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly');
  const [activeUseCase, setActiveUseCase] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const prices = {
    free: { monthly: 0, yearly: 0 },
    pro: { monthly: 29, yearly: 19 },
    team: { monthly: 99, yearly: 69 },
  };

  const useCases = [
    {
      label: 'Sales',
      icon: TrendingUp,
      color: 'from-orange-500 to-amber-500',
      title: 'Close More Deals Faster',
      description:
        'Capture every customer objection, commitment, and follow-up automatically. MeetInsight AI syncs action items directly to HubSpot and Salesforce so your reps can focus on selling.',
      features: ['CRM auto-sync', 'Objection tracking', 'Competitor mentions', 'Deal stage signals'],
      image: 'https://images.unsplash.com/photo-1758691736591-5bf31a5d0dea?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYWxlcyUyMHRlYW0lMjB2aWRlbyUyMGNhbGwlMjBtZWV0aW5nfGVufDF8fHx8MTc3MzkxMTQzOXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      label: 'Product',
      icon: Layers,
      color: 'from-indigo-500 to-purple-600',
      title: 'Ship With Alignment',
      description:
        'Never lose a product decision again. Every sprint planning, design review, and stakeholder call is captured, summarized, and linked to your Notion workspace automatically.',
      features: ['Decision history', 'Feature request tracking', 'Stakeholder alignment', 'Sprint summaries'],
      image: 'https://images.unsplash.com/photo-1758873272445-433c7a832584?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9kdWN0JTIwdGVhbSUyMGNvbGxhYm9yYXRpb24lMjBvZmZpY2V8ZW58MXx8fHwxNzczOTExNDM5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      label: 'Recruiting',
      icon: Users,
      color: 'from-teal-500 to-cyan-500',
      title: 'Hire Smarter, Move Faster',
      description:
        'Score every candidate interview with AI-powered evaluation. Get structured summaries, compare candidates objectively, and make data-driven hiring decisions with your whole team.',
      features: ['Candidate scoring', 'Interview templates', 'Bias detection', 'Team consensus'],
      image: 'https://images.unsplash.com/photo-1758518730162-09a142505bfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZWNydWl0aW5nJTIwaGlyaW5nJTIwaW50ZXJ2aWV3JTIwcHJvZmVzc2lvbmFsfGVufDF8fHx8MTc3MzkxMTQ0MHww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      label: 'Agencies',
      icon: Globe,
      color: 'from-fuchsia-500 to-pink-600',
      title: 'Deliver Without the Overhead',
      description:
        'Run client meetings that actually lead to outcomes. MeetInsight AI captures deliverables, timelines, and client feedback automatically so your team can spend more time creating.',
      features: ['Client-ready reports', 'Deliverable tracking', 'Multi-project view', 'White-label exports'],
      image: 'https://images.unsplash.com/photo-1758873268631-fa944fc5cad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZ2VuY3klMjBjcmVhdGl2ZSUyMHRlYW0lMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzczOTExNDQwfDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
  ];

  return (
    <div className="min-h-screen bg-[#06060f] text-white overflow-x-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ───────── Navbar ───────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-[#06060f]/80 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            {/* logo */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
                <Brain className="h-4.5 w-4.5 text-white" />
              </div>
              <span className="text-base text-white" style={{ fontWeight: 700, letterSpacing: '-0.02em' }}>
                MeetInsight <span className="text-indigo-400">AI</span>
              </span>
            </div>
            {/* links */}
            <div className="hidden md:flex items-center gap-8">
              {[
                { label: 'Product', href: '#product' },
                { label: 'Features', href: '#features' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Blog', href: '/blog' },
              ].map((item) =>
                item.href.startsWith('/') ? (
                  <Link key={item.label} to={item.href} className="text-sm text-white/60 hover:text-white transition-colors" style={{ fontWeight: 500 }}>
                    {item.label}
                  </Link>
                ) : (
                  <a key={item.label} href={item.href} className="text-sm text-white/60 hover:text-white transition-colors" style={{ fontWeight: 500 }}>
                    {item.label}
                  </a>
                )
              )}
            </div>
            {/* cta */}
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-sm text-white/60 hover:text-white transition-colors" style={{ fontWeight: 500 }}>
                Sign In
              </Link>
              <Link
                to="/dashboard"
                className="group flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-105"
                style={{ fontWeight: 600 }}
              >
                Start Free Trial
                <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            {/* mobile menu */}
            <button
              className="md:hidden text-white/60 hover:text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        {/* mobile dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-white/5 bg-[#06060f] px-6 py-4 space-y-3">
            {[
              { label: 'Product', href: '#product' },
              { label: 'Features', href: '#features' },
              { label: 'Pricing', href: '#pricing' },
              { label: 'Blog', href: '/blog' },
            ].map((item) =>
              item.href.startsWith('/') ? (
                <Link key={item.label} to={item.href} className="block text-sm text-white/60 hover:text-white py-1">{item.label}</Link>
              ) : (
                <a key={item.label} href={item.href} className="block text-sm text-white/60 hover:text-white py-1">{item.label}</a>
              )
            )}
            <Link to="/dashboard" className="block w-full mt-2 text-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm text-white" style={{ fontWeight: 600 }}>
              Start Free Trial
            </Link>
          </div>
        )}
      </nav>

      {/* ───────── Hero ───────── */}
      <section className="relative min-h-screen flex items-center pt-20 pb-16 overflow-hidden">
        {/* background effects */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl" />
          <div className="absolute top-20 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-[600px] h-64 bg-blue-600/10 rounded-full blur-3xl" />
          {/* grid overlay */}
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-6 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* left */}
            <div className="space-y-8">
              {/* badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span className="text-xs text-indigo-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>
                  POWERED BY GPT-4 TURBO
                </span>
              </div>

              {/* headline */}
              <div>
                <h1
                  className="text-white"
                  style={{ fontSize: 'clamp(2.4rem, 5vw, 3.75rem)', fontWeight: 800, lineHeight: 1.08, letterSpacing: '-0.03em' }}
                >
                  Turn Every Meeting<br />
                  <span
                    style={{
                      background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 40%, #c084fc 70%, #e879f9 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    Into Decisions
                  </span>
                </h1>
                <p className="mt-6 text-lg text-white/60 max-w-lg" style={{ lineHeight: 1.65 }}>
                  AI that records, analyzes, and converts your meetings into insights, action items, and decisions — automatically.
                </p>
              </div>

              {/* cta */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  to="/dashboard"
                  className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-7 py-3.5 text-white shadow-xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                  style={{ fontSize: '15px', fontWeight: 700 }}
                >
                  Start Free Trial
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <button
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 py-3.5 text-white/80 hover:bg-white/10 hover:text-white transition-all backdrop-blur-sm"
                  style={{ fontSize: '15px', fontWeight: 600 }}
                >
                  <div className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center">
                    <Play className="w-3 h-3 text-white ml-0.5" />
                  </div>
                  Watch Demo
                </button>
              </div>

              {/* social proof mini */}
              <div className="flex items-center gap-4 pt-2">
                <div className="flex -space-x-2">
                  {['bg-indigo-500', 'bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-teal-500'].map((c, i) => (
                    <div key={i} className={cn('w-8 h-8 rounded-full border-2 border-[#06060f]', c)} />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs text-white/40 mt-0.5">Trusted by <span className="text-white/70">5,000+</span> teams</p>
                </div>
              </div>
            </div>

            {/* right — dashboard mockup */}
            <div className="hidden lg:block">
              <DashboardMockup />
            </div>
          </div>
        </div>

        {/* scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce">
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-white/20" />
          <ChevronDown className="w-4 h-4 text-white/20" />
        </div>
      </section>

      {/* ───────── Social Proof Strip ───────── */}
      <section className="border-y border-white/5 py-12 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <p className="text-center text-xs text-white/30 mb-8 uppercase tracking-widest" style={{ fontWeight: 600 }}>
            Trusted by teams at
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {['Airbnb', 'Stripe', 'Notion', 'Linear', 'Vercel', 'Figma', 'Shopify', 'Atlassian'].map((name) => (
              <span
                key={name}
                className="text-white/25 hover:text-white/50 transition-colors cursor-default"
                style={{ fontSize: '16px', fontWeight: 700, letterSpacing: '-0.02em' }}
              >
                {name}
              </span>
            ))}
          </div>
          {/* stats */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 border-t border-white/5 pt-12">
            {[
              { val: 5000, suffix: '+', label: 'Teams using MeetInsight' },
              { val: 2400000, suffix: '+', label: 'Meetings analyzed' },
              { val: 98, suffix: '%', label: 'Transcription accuracy' },
              { val: 12, suffix: 'min', label: 'Average time saved / meeting' },
            ].map(({ val, suffix, label }) => (
              <div key={label} className="text-center">
                <div
                  className="text-white"
                  style={{
                    fontSize: '2rem',
                    fontWeight: 800,
                    letterSpacing: '-0.03em',
                    background: 'linear-gradient(135deg, #818cf8, #c084fc)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  <AnimatedNumber target={val} suffix={suffix} />
                </div>
                <div className="mt-1 text-sm text-white/40">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Features — 3-step story ───────── */}
      <section id="features" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-xs text-purple-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>HOW IT WORKS</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Three steps to smarter meetings
            </h2>
            <p className="mt-4 text-white/50 max-w-lg mx-auto" style={{ fontSize: '17px' }}>
              From raw recording to actionable intelligence — in minutes, not hours.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                icon: Mic,
                color: 'from-indigo-600 to-blue-600',
                glow: 'group-hover:shadow-indigo-500/30',
                borderGlow: 'group-hover:border-indigo-500/40',
                title: 'Capture',
                subtitle: 'Auto-join every meeting',
                features: [
                  'Auto-join Zoom, Meet & Teams',
                  'Real-time live transcription',
                  'Speaker diarization & ID',
                  'Noise cancellation',
                ],
                desc: 'MeetInsight AI silently joins your calls, captures every word with 98% accuracy, and identifies each speaker automatically.',
              },
              {
                step: '02',
                icon: Brain,
                color: 'from-purple-600 to-violet-600',
                glow: 'group-hover:shadow-purple-500/30',
                borderGlow: 'group-hover:border-purple-500/40',
                title: 'Understand',
                subtitle: 'AI dissects your discussion',
                features: [
                  'GPT-4 powered summaries',
                  'Decision detection',
                  'Risk & blocker flagging',
                  'Sentiment analysis',
                ],
                desc: 'Our AI reads between the lines — surfacing decisions, spotting blockers, and measuring discussion quality in real time.',
              },
              {
                step: '03',
                icon: Zap,
                color: 'from-emerald-600 to-teal-600',
                glow: 'group-hover:shadow-emerald-500/30',
                borderGlow: 'group-hover:border-emerald-500/40',
                title: 'Act',
                subtitle: 'Insights become outcomes',
                features: [
                  'Auto-created action items',
                  'CRM & Notion sync',
                  'Slack digest summaries',
                  'Meeting score & coaching',
                ],
                desc: 'Action items are auto-assigned, synced to your tools, and tracked to completion — so nothing falls through the cracks.',
              },
            ].map(({ step, icon: Icon, color, glow, borderGlow, title, subtitle, features, desc }) => (
              <div
                key={step}
                className={cn(
                  'group relative rounded-2xl border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.06] transition-all duration-300 hover:shadow-2xl cursor-default',
                  glow, borderGlow
                )}
              >
                {/* step number */}
                <div
                  className="absolute top-6 right-6 text-5xl select-none"
                  style={{ fontWeight: 900, opacity: 0.06, color: 'white', lineHeight: 1 }}
                >
                  {step}
                </div>
                {/* icon */}
                <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center mb-6 shadow-lg', color)}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-white mb-1" style={{ fontSize: '22px', fontWeight: 700 }}>{title}</h3>
                <p className="text-white/40 text-sm mb-4" style={{ fontWeight: 500 }}>{subtitle}</p>
                <p className="text-white/55 text-sm mb-6" style={{ lineHeight: 1.7 }}>{desc}</p>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-white/60">
                      <div className={cn('w-4 h-4 rounded-full bg-gradient-to-br flex items-center justify-center shrink-0', color)}>
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── AI Insights showcase ───────── */}
      <section id="product" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-indigo-600/8 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 mb-6">
              <Activity className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-indigo-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>AI INSIGHTS</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.15 }}>
              Intelligence your competitors<br />don't have
            </h2>
            <p className="mt-4 text-white/50 max-w-lg mx-auto" style={{ fontSize: '17px' }}>
              Go beyond transcription. MeetInsight AI gives you a complete picture of every conversation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Meeting Score */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.05] transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Meeting Score</h3>
                  <p className="text-white/40 text-sm mt-1">Measure every session quality</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <Star className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              {/* score ring */}
              <div className="flex items-center gap-8">
                <div className="relative w-28 h-28 shrink-0">
                  <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                    <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="10" />
                    <circle
                      cx="50" cy="50" r="40" fill="none"
                      stroke="url(#scoreGrad)" strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 40}`}
                      strokeDashoffset={`${2 * Math.PI * 40 * (1 - 0.88)}`}
                    />
                    <defs>
                      <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop stopColor="#34d399" />
                        <stop offset="1" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white" style={{ fontSize: '24px', fontWeight: 800 }}>88</span>
                    <span className="text-white/40" style={{ fontSize: '10px' }}>/ 100</span>
                  </div>
                </div>
                <div className="space-y-3 flex-1">
                  {[
                    { label: 'Engagement', pct: 92, color: '#6366f1' },
                    { label: 'Decisiveness', pct: 85, color: '#a855f7' },
                    { label: 'Action Rate', pct: 78, color: '#34d399' },
                    { label: 'Time on Task', pct: 95, color: '#f59e0b' },
                  ].map(({ label, pct, color }) => (
                    <div key={label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/50">{label}</span>
                        <span className="text-white/70" style={{ fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Talk-Time Ratio */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.05] transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Talk-Time Analytics</h3>
                  <p className="text-white/40 text-sm mt-1">Know who dominates the room</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                  <Mic className="w-5 h-5 text-purple-400" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { name: 'Sarah Chen', role: 'Product Lead', pct: 32, color: '#6366f1' },
                  { name: 'John Martinez', role: 'Engineering', pct: 26, color: '#a855f7' },
                  { name: 'Emma Wilson', role: 'Design', pct: 21, color: '#22d3ee' },
                  { name: 'David Park', role: 'Marketing', pct: 14, color: '#f59e0b' },
                  { name: 'Others', role: '', pct: 7, color: '#374151' },
                ].map(({ name, role, pct, color }) => (
                  <div key={name} className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full shrink-0" style={{ backgroundColor: color, opacity: 0.7 }} />
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-white/70 truncate" style={{ fontWeight: 500 }}>{name}{role && <span className="text-white/30 ml-1">· {role}</span>}</span>
                        <span className="text-white/60 shrink-0 ml-2" style={{ fontWeight: 600 }}>{pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Tracking */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.05] transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Decision Tracking</h3>
                  <p className="text-white/40 text-sm mt-1">Never lose a key decision again</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-400" />
                </div>
              </div>
              <div className="space-y-3">
                {[
                  { text: 'Launch v2.4 on March 28th', owner: 'Sarah', status: 'confirmed', tag: 'Release' },
                  { text: 'Increase Q2 marketing budget by 20%', owner: 'David', status: 'confirmed', tag: 'Budget' },
                  { text: 'Hire 2 senior engineers by April', owner: 'HR', status: 'pending', tag: 'Hiring' },
                  { text: 'Migrate to new infra before Q3', owner: 'John', status: 'confirmed', tag: 'Tech' },
                ].map(({ text, owner, status, tag }) => (
                  <div key={text} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5">
                    <div className={cn(
                      'mt-0.5 w-2 h-2 rounded-full shrink-0',
                      status === 'confirmed' ? 'bg-emerald-400' : 'bg-amber-400'
                    )} />
                    <div className="flex-1 min-w-0">
                      <p className="text-white/70 text-sm" style={{ lineHeight: 1.4 }}>{text}</p>
                      <p className="text-white/30 text-xs mt-0.5">Owner: {owner}</p>
                    </div>
                    <span className="shrink-0 text-xs rounded-md px-2 py-0.5 bg-white/5 text-white/40" style={{ fontWeight: 500 }}>{tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Analytics */}
            <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-8 hover:bg-white/[0.05] transition-all">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>Team Analytics</h3>
                  <p className="text-white/40 text-sm mt-1">Measure team meeting health</p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-cyan-400" />
                </div>
              </div>
              {/* chart bars */}
              <div className="flex items-end gap-2 h-32 mb-3">
                {[
                  { label: 'Mon', score: 72, color: '#6366f1' },
                  { label: 'Tue', score: 85, color: '#6366f1' },
                  { label: 'Wed', score: 68, color: '#6366f1' },
                  { label: 'Thu', score: 91, color: '#a855f7' },
                  { label: 'Fri', score: 88, color: '#a855f7' },
                  { label: 'Sat', score: 55, color: '#374151' },
                  { label: 'Sun', score: 60, color: '#374151' },
                ].map(({ label, score, color }) => (
                  <div key={label} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-lg transition-all"
                      style={{ height: `${score}%`, backgroundColor: color, opacity: 0.8 }}
                    />
                    <span className="text-white/30" style={{ fontSize: '9px' }}>{label}</span>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/5">
                {[
                  { label: 'Avg Score', val: '82', delta: '+4%' },
                  { label: 'Meetings/wk', val: '24', delta: '+2' },
                  { label: 'Actions done', val: '89%', delta: '+6%' },
                ].map(({ label, val, delta }) => (
                  <div key={label} className="text-center">
                    <div className="text-white" style={{ fontSize: '18px', fontWeight: 700 }}>{val}</div>
                    <div className="text-white/30 text-xs">{label}</div>
                    <div className="text-emerald-400 text-xs" style={{ fontWeight: 600 }}>{delta}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Integrations ───────── */}
      <section id="integrations" className="py-28 border-y border-white/5 bg-white/[0.02]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1.5 mb-6">
              <Layers className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-xs text-teal-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>INTEGRATIONS</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Works with your stack
            </h2>
            <p className="mt-4 text-white/50 max-w-md mx-auto" style={{ fontSize: '17px' }}>
              Connect in one click. No engineering required.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Zoom', emoji: '📹', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-300' },
              { name: 'Google Meet', emoji: '🎥', color: 'from-green-600/20 to-green-600/5', border: 'border-green-500/20', text: 'text-green-300' },
              { name: 'Teams', emoji: '💼', color: 'from-indigo-600/20 to-indigo-600/5', border: 'border-indigo-500/20', text: 'text-indigo-300' },
              { name: 'Slack', emoji: '💬', color: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-300' },
              { name: 'Notion', emoji: '📓', color: 'from-gray-600/20 to-gray-600/5', border: 'border-gray-500/20', text: 'text-gray-300' },
              { name: 'HubSpot', emoji: '🧡', color: 'from-orange-600/20 to-orange-600/5', border: 'border-orange-500/20', text: 'text-orange-300' },
              { name: 'Salesforce', emoji: '☁️', color: 'from-cyan-600/20 to-cyan-600/5', border: 'border-cyan-500/20', text: 'text-cyan-300' },
              { name: 'Jira', emoji: '🎯', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-300' },
              { name: 'Linear', emoji: '⚡', color: 'from-violet-600/20 to-violet-600/5', border: 'border-violet-500/20', text: 'text-violet-300' },
              { name: 'Asana', emoji: '✅', color: 'from-pink-600/20 to-pink-600/5', border: 'border-pink-500/20', text: 'text-pink-300' },
              { name: 'Webex', emoji: '🔵', color: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-300' },
              { name: 'Zapier', emoji: '⚙️', color: 'from-amber-600/20 to-amber-600/5', border: 'border-amber-500/20', text: 'text-amber-300' },
            ].map(({ name, emoji, color, border, text }) => (
              <div
                key={name}
                className={cn(
                  'group flex flex-col items-center gap-2 rounded-2xl border p-5 bg-gradient-to-b cursor-default hover:scale-105 transition-transform',
                  color, border
                )}
              >
                <span style={{ fontSize: '28px' }}>{emoji}</span>
                <span className={cn('text-xs', text)} style={{ fontWeight: 600 }}>{name}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/30 text-sm">
              + 50 more integrations available via <span className="text-white/50">Zapier</span> and native API
            </p>
          </div>
        </div>
      </section>

      {/* ───────── Use Cases ───────── */}
      <section id="use-cases" className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 mb-6">
              <Users className="w-3.5 h-3.5 text-orange-400" />
              <span className="text-xs text-orange-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>USE CASES</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Built for every team
            </h2>
            <p className="mt-4 text-white/50 max-w-lg mx-auto" style={{ fontSize: '17px' }}>
              From sales calls to hiring interviews, MeetInsight AI adapts to how your team works.
            </p>
          </div>

          {/* tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {useCases.map((uc, i) => {
              const Icon = uc.icon;
              return (
                <button
                  key={uc.label}
                  onClick={() => setActiveUseCase(i)}
                  className={cn(
                    'flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm transition-all',
                    activeUseCase === i
                      ? 'bg-gradient-to-r text-white shadow-lg ' + uc.color
                      : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5'
                  )}
                  style={{ fontWeight: 600 }}
                >
                  <Icon className="w-4 h-4" />
                  {uc.label}
                </button>
              );
            })}
          </div>

          {/* active case */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h3 className="text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, letterSpacing: '-0.025em' }}>
                {useCases[activeUseCase].title}
              </h3>
              <p className="text-white/55" style={{ fontSize: '16px', lineHeight: 1.75 }}>
                {useCases[activeUseCase].description}
              </p>
              <ul className="space-y-3">
                {useCases[activeUseCase].features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-white/70">
                    <div className={cn('w-5 h-5 rounded-lg bg-gradient-to-br flex items-center justify-center', useCases[activeUseCase].color)}>
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <span style={{ fontSize: '15px' }}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to="/dashboard"
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl bg-gradient-to-r px-6 py-3 text-white shadow-lg hover:scale-105 transition-transform',
                  useCases[activeUseCase].color
                )}
                style={{ fontSize: '14px', fontWeight: 700 }}
              >
                Try for {useCases[activeUseCase].label}
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="relative rounded-2xl overflow-hidden h-80 lg:h-96 border border-white/10">
              <img
                src={useCases[activeUseCase].image}
                alt={useCases[activeUseCase].label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#06060f] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="rounded-xl bg-black/50 backdrop-blur-md border border-white/10 p-3 flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center', useCases[activeUseCase].color)}>
                    {(() => { const Icon = useCases[activeUseCase].icon; return <Icon className="w-4 h-4 text-white" />; })()}
                  </div>
                  <div>
                    <div className="text-white text-xs" style={{ fontWeight: 700 }}>MeetInsight AI — {useCases[activeUseCase].label}</div>
                    <div className="text-white/40 text-xs">{useCases[activeUseCase].title}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Comparison Table ───────── */}
      <section className="py-28 border-t border-white/5 bg-white/[0.015]">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 mb-6">
              <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs text-rose-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>WHY WE'RE BETTER</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              The clear choice for<br />AI meeting intelligence
            </h2>
            <p className="mt-4 text-white/50 max-w-md mx-auto" style={{ fontSize: '17px' }}>
              Compare MeetInsight AI against every alternative.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="px-6 py-5 text-left text-sm text-white/40" style={{ fontWeight: 600, width: '35%' }}>Feature</th>
                  <th className="px-6 py-5 text-center" style={{ width: '16.25%' }}>
                    <div className="inline-flex flex-col items-center gap-1">
                      <div className="flex items-center gap-1.5">
                        <div className="w-5 h-5 rounded-md bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                          <Brain className="w-3 h-3 text-white" />
                        </div>
                        <span className="text-white" style={{ fontSize: '13px', fontWeight: 800 }}>MeetInsight</span>
                      </div>
                      <span className="text-indigo-400 text-xs" style={{ fontWeight: 500 }}>← You</span>
                    </div>
                  </th>
                  {['Fireflies', 'Otter.ai', 'Fathom'].map((c) => (
                    <th key={c} className="px-6 py-5 text-center text-sm text-white/40" style={{ fontWeight: 600 }}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: 'AI Meeting Transcription', us: true, fireflies: true, otter: true, fathom: true },
                  { feature: 'Meeting Intelligence Score', us: true, fireflies: false, otter: false, fathom: false },
                  { feature: 'Decision Tracking', us: true, fireflies: false, otter: false, fathom: false },
                  { feature: 'Team Analytics Dashboard', us: true, fireflies: true, otter: false, fathom: false },
                  { feature: 'Talk-Time Ratio Analysis', us: true, fireflies: false, otter: false, fathom: false },
                  { feature: 'Auto CRM Sync', us: true, fireflies: true, otter: false, fathom: false },
                  { feature: 'Sentiment Analysis', us: true, fireflies: false, otter: false, fathom: false },
                  { feature: 'Meeting Coaching', us: true, fireflies: false, otter: false, fathom: false },
                  { feature: 'Slack Digest Summaries', us: true, fireflies: true, otter: false, fathom: true },
                ].map(({ feature, us, fireflies, otter, fathom }, i) => (
                  <tr key={feature} className={cn(
                    'border-b border-white/5 transition-colors',
                    i % 2 === 0 ? 'bg-white/[0.01]' : '',
                    'hover:bg-white/[0.03]'
                  )}>
                    <td className="px-6 py-4 text-sm text-white/70">{feature}</td>
                    <td className="px-6 py-4 text-center bg-indigo-500/5">
                      {us ? <Check className="mx-auto w-5 h-5 text-emerald-400" /> : <X className="mx-auto w-4 h-4 text-white/15" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {fireflies ? <Check className="mx-auto w-4 h-4 text-white/40" /> : <X className="mx-auto w-4 h-4 text-white/15" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {otter ? <Check className="mx-auto w-4 h-4 text-white/40" /> : <X className="mx-auto w-4 h-4 text-white/15" />}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {fathom ? <Check className="mx-auto w-4 h-4 text-white/40" /> : <X className="mx-auto w-4 h-4 text-white/15" />}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ───────── Pricing ───────── */}
      <section id="pricing" className="py-28">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-amber-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>PRICING</span>
            </div>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.03em' }}>
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-white/50 max-w-md mx-auto" style={{ fontSize: '17px' }}>
              Start free. Upgrade when you're ready. No surprises.
            </p>

            {/* billing toggle */}
            <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-1.5">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'rounded-lg px-5 py-2 text-sm transition-all',
                  billingPeriod === 'monthly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-white/50 hover:text-white'
                )}
                style={{ fontWeight: 600 }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('yearly')}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-5 py-2 text-sm transition-all',
                  billingPeriod === 'yearly'
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-white/50 hover:text-white'
                )}
                style={{ fontWeight: 600 }}
              >
                Yearly
                <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs text-emerald-400" style={{ fontWeight: 700 }}>
                  -35%
                </span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-start">
            {/* Free */}
            <PricingCard accentColor="rgba(148,163,184,">
              <h3 className="text-white" style={{ fontSize: '20px', fontWeight: 800 }}>Free</h3>
              <p className="mt-1 text-white/40 text-sm">For individuals getting started</p>
              <div className="mt-6 mb-8">
                <span className="text-white" style={{ fontSize: '42px', fontWeight: 900 }}>$0</span>
                <span className="text-white/40 text-sm ml-1">/month</span>
              </div>
              <Link
                to="/signup"
                className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
                style={{ fontWeight: 600 }}
              >
                Get Started Free
              </Link>
              <ul className="mt-8 space-y-3">
                {['5 meetings / month', 'Basic transcription', 'Action item extraction', 'Email summaries'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                    <Check className="w-4 h-4 text-white/30 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </PricingCard>

            {/* Pro */}
            <PricingCard isPro>
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-5 py-1 text-xs text-white shadow-lg shadow-indigo-500/30" style={{ fontWeight: 700 }}>
                Most Popular
              </div>
              <h3 className="text-white" style={{ fontSize: '20px', fontWeight: 800 }}>Pro</h3>
              <p className="mt-1 text-white/40 text-sm">For professionals and power users</p>
              <div className="mt-6 mb-8 flex items-end gap-2">
                <span className="text-white" style={{ fontSize: '42px', fontWeight: 900 }}>${prices.pro[billingPeriod]}</span>
                <span className="text-white/40 text-sm mb-2">/ user / month</span>
                {billingPeriod === 'yearly' && (
                  <span className="mb-2 text-sm text-white/30 line-through">${prices.pro.monthly}</span>
                )}
              </div>
              <Link
                to="/dashboard"
                className="block w-full rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 text-center text-sm text-white shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-[1.02] transition-all"
                style={{ fontWeight: 700 }}
              >
                Start Free Trial
              </Link>
              <ul className="mt-8 space-y-3">
                {['Unlimited meetings', 'AI intelligence & insights', 'Decision tracking', 'Productivity scoring', 'CRM & Notion sync', 'Slack digests', 'Priority support'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/70">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shrink-0">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>
            </PricingCard>

            {/* Team */}
            <PricingCard accentColor="rgba(20,184,166,">
              <h3 className="text-white" style={{ fontSize: '20px', fontWeight: 800 }}>Team</h3>
              <p className="mt-1 text-white/40 text-sm">For growing organizations</p>
              <div className="mt-6 mb-8 flex items-end gap-2">
                <span className="text-white" style={{ fontSize: '42px', fontWeight: 900 }}>${prices.team[billingPeriod]}</span>
                <span className="text-white/40 text-sm mb-2">/ user / month</span>
                {billingPeriod === 'yearly' && (
                  <span className="mb-2 text-sm text-white/30 line-through">${prices.team.monthly}</span>
                )}
              </div>
              <Link
                to="/signup"
                className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
                style={{ fontWeight: 600 }}
              >
                Contact Sales
              </Link>
              <ul className="mt-8 space-y-3">
                {['Everything in Pro', 'Team analytics dashboard', 'Advanced integrations', 'Custom AI training', 'SSO / SAML', 'Dedicated CSM', 'SLA & uptime guarantee'].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-white/50">
                    <Check className="w-4 h-4 text-white/30 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </PricingCard>
          </div>

          {/* enterprise cta */}
          <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.02] p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-white" style={{ fontWeight: 700 }}>Need enterprise-grade features?</p>
              <p className="text-white/40 text-sm mt-1">Custom pricing, dedicated infra, security review, and white-glove onboarding.</p>
            </div>
            <Link
              to="/signup"
              className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-all"
              style={{ fontWeight: 600 }}
            >
              Talk to Sales →
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Final CTA ───────── */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 via-purple-900/30 to-[#06060f]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-indigo-600/20 rounded-full blur-3xl" />
        </div>
        <div className="mx-auto max-w-4xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 mb-8">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs text-purple-300" style={{ fontWeight: 600, letterSpacing: '0.04em' }}>START IN 30 SECONDS</span>
          </div>
          <h2
            className="text-white"
            style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}
          >
            Your next meeting should<br />
            <span style={{
              background: 'linear-gradient(135deg, #818cf8 0%, #a78bfa 50%, #e879f9 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              generate value, not notes.
            </span>
          </h2>
          <p className="mt-6 text-white/50 max-w-lg mx-auto" style={{ fontSize: '18px', lineHeight: 1.65 }}>
            Join 5,000+ teams who've transformed their meetings into a competitive advantage with MeetInsight AI.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 text-white shadow-2xl shadow-indigo-500/30 hover:shadow-indigo-500/50 hover:scale-105 transition-all"
              style={{ fontSize: '16px', fontWeight: 800 }}
            >
              Start Free Trial — No credit card
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-sm text-white/30">
            {['Free forever plan', '14-day Pro trial', 'No credit card', 'SOC2 compliant'].map((t) => (
              <span key={t} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500/60" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── Footer ───────── */}
      <footer className="border-t border-white/5 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            {/* brand */}
            <div className="col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span className="text-white" style={{ fontWeight: 700 }}>MeetInsight <span className="text-indigo-400">AI</span></span>
              </div>
              <p className="text-white/30 text-sm max-w-xs" style={{ lineHeight: 1.7 }}>
                AI-powered meeting intelligence platform that turns every conversation into actionable outcomes.
              </p>
              <div className="mt-4 flex gap-3">
                {['Twitter', 'LinkedIn', 'GitHub'].map((s) => (
                  <a key={s} href="#" className="text-xs text-white/25 hover:text-white/60 transition-colors" style={{ fontWeight: 500 }}>{s}</a>
                ))}
              </div>
            </div>

            {/* product */}
            <div>
              <p className="text-white/60 text-sm mb-4" style={{ fontWeight: 700 }}>Product</p>
              <ul className="space-y-2.5">
                {['Features', 'Integrations', 'Pricing', 'Changelog', 'Roadmap'].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* company */}
            <div>
              <p className="text-white/60 text-sm mb-4" style={{ fontWeight: 700 }}>Company</p>
              <ul className="space-y-2.5">
                {['About', 'Blog', 'Careers', 'Press', 'Contact'].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>

            {/* legal */}
            <div>
              <p className="text-white/60 text-sm mb-4" style={{ fontWeight: 700 }}>Legal</p>
              <ul className="space-y-2.5">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Security', 'GDPR'].map((l) => (
                  <li key={l}><a href="#" className="text-sm text-white/30 hover:text-white/60 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>

          {/* bottom */}
          <div className="border-t border-white/5 pt-8 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-white/20">© 2026 MeetInsight AI, Inc. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-6">
              {[
                { icon: Shield, label: 'SOC2 Compliant' },
                { icon: Lock, label: 'GDPR Ready' },
                { icon: Globe, label: 'Privacy First' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-white/20" />
                  <span className="text-xs text-white/20">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
