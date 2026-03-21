import { useState } from 'react';
import { Link } from 'react-router';
import {
  Brain, ArrowRight, Clock, User, Tag, Search,
  Sparkles, TrendingUp, Zap, Shield, BarChart3,
  BookOpen, ChevronRight, Star, Rss,
} from 'lucide-react';

/* ─── Types ── */
interface Post {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: { name: string; avatar: string; role: string };
  date: string;
  readTime: number;
  featured?: boolean;
  image: string;
  tags: string[];
  accent: string;
}

/* ─── Mock data ── */
const posts: Post[] = [
  {
    id: '1',
    slug: 'ai-meeting-intelligence-2026',
    title: 'How AI Is Transforming Meeting Intelligence in 2026',
    excerpt: 'From passive transcription to active decision-making — explore how next-generation AI is turning every meeting into a strategic advantage for high-performing teams.',
    category: 'AI & Technology',
    author: { name: 'Sarah Chen', avatar: 'SC', role: 'Head of Product' },
    date: 'March 18, 2026',
    readTime: 8,
    featured: true,
    image: 'https://images.unsplash.com/photo-1677442135968-6db3b0025e95?w=1200&q=80',
    tags: ['AI', 'Meetings', 'Productivity'],
    accent: '#6D28D9',
  },
  {
    id: '2',
    slug: 'reduce-meeting-waste',
    title: '7 Proven Strategies to Cut Meeting Waste by 40%',
    excerpt: 'The average knowledge worker spends 31 hours a month in unproductive meetings. Here are the data-backed strategies our top customers use to reclaim their time.',
    category: 'Productivity',
    author: { name: 'Marcus Webb', avatar: 'MW', role: 'Customer Success Lead' },
    date: 'March 14, 2026',
    readTime: 6,
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&q=80',
    tags: ['Productivity', 'Remote Work', 'Best Practices'],
    accent: '#EC4899',
  },
  {
    id: '3',
    slug: 'decision-tracking-playbook',
    title: 'The Decision Tracking Playbook for Product Teams',
    excerpt: 'Decisions made in meetings often disappear. This step-by-step guide shows how leading product orgs capture, track, and execute every decision — without extra overhead.',
    category: 'Product Management',
    author: { name: 'Lena Park', avatar: 'LP', role: 'Product Strategist' },
    date: 'March 10, 2026',
    readTime: 10,
    image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=800&q=80',
    tags: ['Product', 'Decisions', 'Team Alignment'],
    accent: '#22D3EE',
  },
  {
    id: '4',
    slug: 'gpt4-meeting-summaries',
    title: 'GPT-4 Turbo vs GPT-3.5 for Meeting Summaries: A Real-World Comparison',
    excerpt: "We ran 2,400 meetings through both models and measured accuracy, decision recall, and action item completeness. The results surprised us — and might surprise you too.",
    category: 'AI & Technology',
    author: { name: 'James Liu', avatar: 'JL', role: 'AI Research Engineer' },
    date: 'March 6, 2026',
    readTime: 12,
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&q=80',
    tags: ['AI', 'GPT-4', 'Research'],
    accent: '#a78bfa',
  },
  {
    id: '5',
    slug: 'remote-team-async-culture',
    title: 'Building an Async-First Culture Without Losing Team Alignment',
    excerpt: 'Async work reduces meeting load — but only if your team has the right tools and rituals. Learn how fast-growing remote teams balance flexibility with cohesion.',
    category: 'Remote Work',
    author: { name: 'Aria Santos', avatar: 'AS', role: 'Culture & Operations' },
    date: 'Feb 28, 2026',
    readTime: 7,
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80',
    tags: ['Remote Work', 'Culture', 'Async'],
    accent: '#34d399',
  },
  {
    id: '6',
    slug: 'meeting-score-methodology',
    title: 'Inside the Meeting Score Algorithm: How We Measure Effectiveness',
    excerpt: "MeetInsight AI's Meeting Score isn't a black box — it's a transparent, peer-reviewed framework. Here's exactly how we calculate it and what drives each component.",
    category: 'Product Deep Dive',
    author: { name: 'Sarah Chen', avatar: 'SC', role: 'Head of Product' },
    date: 'Feb 20, 2026',
    readTime: 9,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80',
    tags: ['Product', 'AI', 'Analytics'],
    accent: '#f59e0b',
  },
  {
    id: '7',
    slug: 'sales-calls-ai-coaching',
    title: 'AI Meeting Coaching Is Changing How Top Sales Reps Prepare',
    excerpt: "Sales leaders at 3 Fortune 500 companies share how AI-powered post-call coaching helped their reps close 22% more deals in Q1 2026. Real data, real stories.",
    category: 'Sales',
    author: { name: 'Marcus Webb', avatar: 'MW', role: 'Customer Success Lead' },
    date: 'Feb 14, 2026',
    readTime: 8,
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800&q=80',
    tags: ['Sales', 'Coaching', 'AI'],
    accent: '#fb923c',
  },
  {
    id: '8',
    slug: 'enterprise-meeting-security',
    title: "What Enterprise Teams Ask About Meeting AI Security (And Our Answers)",
    excerpt: 'SOC2, GDPR, data retention, PII masking — the questions CISOs and legal teams ask most about meeting intelligence platforms, answered plainly.',
    category: 'Security & Compliance',
    author: { name: 'James Liu', avatar: 'JL', role: 'AI Research Engineer' },
    date: 'Feb 8, 2026',
    readTime: 11,
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&q=80',
    tags: ['Security', 'Enterprise', 'Compliance'],
    accent: '#6366f1',
  },
];

const categories = ['All', 'AI & Technology', 'Productivity', 'Product Management', 'Remote Work', 'Sales', 'Security & Compliance', 'Product Deep Dive'];

const categoryIcons: Record<string, React.ElementType> = {
  'AI & Technology': Sparkles,
  'Productivity': TrendingUp,
  'Product Management': BarChart3,
  'Remote Work': Shield,
  'Sales': Zap,
  'Security & Compliance': Shield,
  'Product Deep Dive': BookOpen,
};

/* ─── Avatar chip ── */
function Avatar({ initials, accent }: { initials: string; accent: string }) {
  return (
    <div
      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white"
      style={{ background: `linear-gradient(135deg, ${accent}, ${accent}aa)`, fontSize: '10px', fontWeight: 800, boxShadow: `0 0 8px ${accent}50` }}
    >
      {initials}
    </div>
  );
}

/* ─── Category badge ── */
function CategoryBadge({ cat, accent }: { cat: string; accent: string }) {
  const Icon = categoryIcons[cat] || Tag;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
      style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}35`, fontWeight: 700 }}
    >
      <Icon className="h-3 w-3" />
      {cat}
    </span>
  );
}

/* ─── Blog Card ── */
function BlogCard({ post, large = false }: { post: Post; large?: boolean }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="group relative rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: hovered ? `1px solid ${post.accent}50` : '1px solid rgba(255,255,255,0.07)',
        boxShadow: hovered ? `0 20px 60px ${post.accent}20, 0 0 0 1px ${post.accent}25` : 'none',
        transform: hovered ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: large ? 280 : 200 }}>
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)', transition: 'transform 0.6s ease' }}
        />
        {/* Gradient overlay */}
        <div
          className="absolute inset-0"
          style={{ background: `linear-gradient(to bottom, transparent 40%, rgba(6,6,15,0.85))` }}
        />
        {/* Category badge on image */}
        <div className="absolute top-4 left-4">
          <CategoryBadge cat={post.category} accent={post.accent} />
        </div>
        {post.featured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-white" style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.15)', fontWeight: 700 }}>
              <Star className="h-3 w-3 text-amber-400 fill-amber-400" />
              Featured
            </span>
          </div>
        )}
        {/* Accent glow on hover */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${post.accent}15 0%, transparent 70%)`,
            opacity: hovered ? 1 : 0,
            transition: 'opacity 0.4s ease',
          }}
        />
      </div>

      {/* Content */}
      <div className="p-6">
        <h2
          className="text-white mb-3 transition-all duration-300"
          style={{
            fontSize: large ? '22px' : '17px',
            fontWeight: 800,
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
            color: hovered ? '#ffffff' : 'rgba(255,255,255,0.92)',
          }}
        >
          {post.title}
        </h2>
        <p
          className="mb-5 text-sm"
          style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}
        >
          {post.excerpt}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-5">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg px-2.5 py-1 text-xs"
              style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.07)' }}
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2.5">
            <Avatar initials={post.author.avatar} accent={post.accent} />
            <div>
              <p className="text-xs text-white" style={{ fontWeight: 600 }}>{post.author.name}</p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>{post.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs" style={{ color: 'rgba(255,255,255,0.3)' }}>
              <Clock className="h-3 w-3" />
              {post.readTime}m read
            </div>
            <div
              className="flex items-center gap-1 text-xs transition-all duration-300"
              style={{ color: hovered ? post.accent : 'rgba(255,255,255,0.25)', fontWeight: 600 }}
            >
              Read more
              <ChevronRight className="h-3 w-3" style={{ transform: hovered ? 'translateX(3px)' : 'translateX(0)', transition: 'transform 0.3s ease' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-0.5"
        style={{
          background: `linear-gradient(90deg, transparent, ${post.accent}, transparent)`,
          opacity: hovered ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      />
    </article>
  );
}

/* ─── Main Blog Page ── */
export function Blog() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = posts.filter((p) => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  const featuredPost = posts.find((p) => p.featured);
  const normalPosts = filtered.filter((p) => !p.featured || activeCategory !== 'All' || search);

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: '#06060f', fontFamily: 'Inter, sans-serif', color: 'white' }}
    >
      {/* Plasma bg */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-10">
        <div style={{ position: 'absolute', width: 700, height: 700, top: -200, left: -100, borderRadius: '50%', background: 'radial-gradient(circle, #6D28D9 0%, transparent 70%)', opacity: 0.15, animation: 'plasma1 18s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 500, height: 500, top: 300, right: -100, borderRadius: '50%', background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)', opacity: 0.1, animation: 'plasma2 22s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, bottom: 0, left: '30%', borderRadius: '50%', background: 'radial-gradient(circle, #22D3EE 0%, transparent 70%)', opacity: 0.06, animation: 'plasma3 26s ease-in-out infinite' }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* ── Navbar ── */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 py-4"
        style={{ background: 'rgba(6,6,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}
      >
        <Link to="/" className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 16px rgba(109,40,217,0.5)' }}>
            <Brain className="h-4 w-4 text-white" />
          </div>
          <span style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '-0.02em' }}>
            MeetInsight <span style={{ color: '#a78bfa' }}>AI</span>
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/" className="text-sm transition-colors" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 500 }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'white'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}>
            ← Back to Site
          </Link>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm text-white transition-all"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', fontWeight: 700, boxShadow: '0 0 16px rgba(109,40,217,0.3)' }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 28px rgba(109,40,217,0.6)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 16px rgba(109,40,217,0.3)'; }}
          >
            Try Free
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <header className="py-20 px-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 mb-6" style={{ background: 'rgba(109,40,217,0.12)', border: '1px solid rgba(109,40,217,0.3)' }}>
          <Rss className="h-3.5 w-3.5" style={{ color: '#a78bfa' }} />
          <span className="text-xs" style={{ color: '#a78bfa', fontWeight: 700, letterSpacing: '0.06em' }}>THE MEETINSIGHT BLOG</span>
        </div>
        <h1
          style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.75rem)',
            fontWeight: 900,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Insights on{' '}
          <span style={{ background: 'linear-gradient(135deg, #818cf8, #a78bfa, #e879f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Smarter Meetings
          </span>
        </h1>
        <p className="mx-auto max-w-xl text-lg" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.65 }}>
          Research, playbooks, and real-world stories to help your team get more out of every conversation.
        </p>

        {/* Search */}
        <div className="mx-auto mt-10 max-w-lg relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.3)' }} />
          <input
            type="text"
            placeholder="Search articles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl py-3.5 pl-12 pr-5 text-sm outline-none transition-all duration-300"
            style={{
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.85)',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(109,40,217,0.6)'; e.target.style.boxShadow = '0 0 24px rgba(109,40,217,0.2)'; }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = 'none'; }}
          />
        </div>
      </header>

      {/* ── Categories ── */}
      <div className="px-6 pb-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((cat) => {
              const active = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className="rounded-xl px-4 py-2 text-sm transition-all duration-200"
                  style={{
                    background: active ? 'linear-gradient(135deg, #6D28D9, #EC4899)' : 'rgba(255,255,255,0.04)',
                    color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                    border: active ? 'none' : '1px solid rgba(255,255,255,0.07)',
                    fontWeight: active ? 700 : 500,
                    boxShadow: active ? '0 0 20px rgba(109,40,217,0.35)' : 'none',
                    transform: active ? 'scale(1.03)' : 'scale(1)',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <main className="px-6 pb-24">
        <div className="mx-auto max-w-7xl">

          {/* Featured post (full width when no filter) */}
          {featuredPost && activeCategory === 'All' && !search && (
            <div className="mb-10">
              <BlogCard post={featuredPost} large />
            </div>
          )}

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {normalPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center">
              <BookOpen className="mx-auto h-12 w-12 mb-4" style={{ color: 'rgba(255,255,255,0.15)' }} />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '16px' }}>No articles found</p>
              <button
                onClick={() => { setSearch(''); setActiveCategory('All'); }}
                className="mt-4 text-sm transition-colors"
                style={{ color: '#a78bfa', fontWeight: 600 }}
              >
                Clear filters →
              </button>
            </div>
          )}
        </div>
      </main>

      {/* ── Newsletter ── */}
      <section className="px-6 pb-24">
        <div className="mx-auto max-w-3xl">
          <div
            className="relative rounded-3xl p-12 text-center overflow-hidden"
            style={{
              background: 'linear-gradient(135deg, rgba(109,40,217,0.15) 0%, rgba(236,72,153,0.08) 100%)',
              border: '1px solid rgba(109,40,217,0.25)',
            }}
          >
            {/* Glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div style={{ position: 'absolute', width: 300, height: 300, top: -80, right: -60, borderRadius: '50%', background: 'radial-gradient(circle, rgba(109,40,217,0.2) 0%, transparent 70%)', filter: 'blur(32px)' }} />
              <div style={{ position: 'absolute', width: 200, height: 200, bottom: -40, left: -40, borderRadius: '50%', background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)', filter: 'blur(24px)' }} />
            </div>
            <div className="relative">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 28px rgba(109,40,217,0.5)' }}>
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 10 }}>
                Get articles in your inbox
              </h2>
              <p className="mx-auto mb-8 max-w-sm text-sm" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>
                Join 8,000+ meeting leaders who get weekly insights on AI, productivity, and team performance.
              </p>
              <form
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="you@company.com"
                  className="flex-1 rounded-xl px-4 py-3 text-sm outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(109,40,217,0.6)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(255,255,255,0.12)'; }}
                />
                <button
                  type="submit"
                  className="shrink-0 rounded-xl px-6 py-3 text-sm text-white transition-all"
                  style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', fontWeight: 700, boxShadow: '0 0 20px rgba(109,40,217,0.4)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 32px rgba(109,40,217,0.7)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 20px rgba(109,40,217,0.4)'; }}
                >
                  Subscribe →
                </button>
              </form>
              <p className="mt-4 text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>No spam. Unsubscribe anytime.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t px-6 py-10 text-center" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)' }}>
            <Brain className="h-3.5 w-3.5 text-white" />
          </div>
          <span style={{ fontSize: '14px', fontWeight: 800, color: 'white' }}>MeetInsight AI Blog</span>
        </div>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
          © 2026 MeetInsight AI · <Link to="/" className="hover:text-white/60 transition-colors">Home</Link> · <Link to="/dashboard" className="hover:text-white/60 transition-colors">Dashboard</Link>
        </p>
      </footer>
    </div>
  );
}
