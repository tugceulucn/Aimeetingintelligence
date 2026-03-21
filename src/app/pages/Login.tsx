import { Link } from 'react-router';
import { Brain, Mail, Lock, ArrowRight } from 'lucide-react';

export function Login() {
  return (
    <div
      className="flex min-h-screen"
      style={{ background: '#0B0B0F', fontFamily: 'Inter, sans-serif' }}
    >
      {/* Plasma arkaplan */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div style={{
          position: 'absolute', width: 600, height: 600, top: -150, left: -150, borderRadius: '50%',
          background: 'radial-gradient(circle, #6D28D9 0%, transparent 70%)', opacity: 0.2,
          animation: 'plasma1 18s ease-in-out infinite',
        }} />
        <div style={{
          position: 'absolute', width: 400, height: 400, bottom: -100, right: '10%', borderRadius: '50%',
          background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)', opacity: 0.12,
          animation: 'plasma2 22s ease-in-out infinite',
        }} />
      </div>

      {/* Sol — Form */}
      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 20px rgba(109,40,217,0.5)' }}
            >
              <Brain className="h-5 w-5 text-white" />
            </div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>
              MeetInsight{' '}
              <span style={{ background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                AI
              </span>
            </span>
          </div>

          <h2 style={{ fontSize: '28px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Tekrar hoş geldiniz
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
            Hesabınız yok mu?{' '}
            <Link to="/signup" style={{ color: '#a78bfa', fontWeight: 600 }}>
              Kayıt olun
            </Link>
          </p>

          <form className="space-y-4">
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6 }}>
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  type="email"
                  placeholder="siz@sirket.com"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(109,40,217,0.6)';
                    e.target.style.boxShadow = '0 0 20px rgba(109,40,217,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6 }}>
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = 'rgba(109,40,217,0.6)';
                    e.target.style.boxShadow = '0 0 20px rgba(109,40,217,0.2)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.1)';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="h-4 w-4 rounded" style={{ accentColor: '#6D28D9' }} />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Beni hatırla</span>
              </label>
              <button type="button" style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 600 }}>
                Şifremi unuttum?
              </button>
            </div>

            {/* Sign In Button */}
            <Link
              to="/dashboard"
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm text-white transition-all duration-200"
              style={{
                background: 'linear-gradient(135deg, #6D28D9, #EC4899)',
                fontWeight: 700,
                boxShadow: '0 0 24px rgba(109,40,217,0.4)',
                marginTop: 8,
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 36px rgba(109,40,217,0.65)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 0 24px rgba(109,40,217,0.4)'; }}
            >
              Giriş Yap
              <ArrowRight className="h-4 w-4" />
            </Link>

            {/* Divider */}
            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>ya da şununla devam et</span>
              <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Social Buttons */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Google', svg: <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg> },
                { label: 'Microsoft', svg: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2H2v9.5h9.5V2zm1 0v9.5H22V2h-9.5zm-1 10.5H2V22h9.5v-9.5zm1 0V22H22v-9.5h-9.5z"/></svg> },
              ].map(({ label, svg }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(255,255,255,0.65)',
                    fontWeight: 500,
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.04)'; }}
                >
                  {svg}
                  {label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      {/* Sağ — Görsel */}
      <div
        className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-12 relative"
        style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(236,72,153,0.1) 100%)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-md text-center">
          <div
            className="mx-auto h-24 w-24 flex items-center justify-center rounded-3xl mb-8"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 60px rgba(109,40,217,0.5)' }}
          >
            <Brain className="h-12 w-12 text-white" />
          </div>
          <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 12 }}>
            AI Destekli Toplantı Zekası
          </h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Gelişmiş yapay zeka analiz platformumuzla toplantılarınızı eyleme geçirilebilir içgörülere dönüştürün.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            {[
              { val: '10K+', lbl: 'Kullanıcı' },
              { val: '98%', lbl: 'Memnuniyet' },
              { val: '2M+', lbl: 'Analiz' },
            ].map(({ val, lbl }) => (
              <div key={lbl} className="text-center">
                <p style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg,#a78bfa,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{val}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.35)' }}>{lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
