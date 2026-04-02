import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { ArrowRight, Brain, Lock, Mail, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  minLength,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  minLength?: number;
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6 }}>
        {label}
      </label>
      <div className="relative">
        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.25)' }} />
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300"
          style={{
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.85)',
          }}
          required={required}
          minLength={minLength}
        />
      </div>
    </div>
  );
}

export function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signIn, signUp, signInWithOAuth, isConfigured } = useAuth();
  const [accountType, setAccountType] = useState<'individual' | 'employee'>('individual');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [workspaceName, setWorkspaceName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const isSignup = location.pathname === '/signup';
  const returnTo = (location.state as { from?: string } | null)?.from ?? '/dashboard';

  const content = useMemo(() => ({
    title: isSignup ? 'Hesabını oluştur' : 'Tekrar hoş geldiniz',
    subtitle: isSignup ? 'Zaten hesabın var mi?' : 'Hesabın yok mu?',
    switchHref: isSignup ? '/login' : '/signup',
    switchText: isSignup ? 'Giriş yap' : 'Kayıt olun',
    submitText: isSignup ? 'Kayıt Ol' : 'Giriş Yap',
  }), [isSignup]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);

    if (!isConfigured) {
      return;
    }

    try {
      setSubmitting(true);

      if (isSignup) {
        const trimmedFirstName = firstName.trim();
        const trimmedLastName = lastName.trim();
        const trimmedEmail = email.trim();

        if (!trimmedFirstName || !trimmedLastName) {
          setError('Lütfen ad ve soyad alanlarını doldurun.');
          return;
        }

        if (!workspaceName.trim()) {
          setError('Lütfen workspace adını doldurun.');
          return;
        }

        if (accountType === 'employee' && !companyName.trim()) {
          setError('Firma çalışanı kaydı için şirket adını girin.');
          return;
        }

        const result = await signUp({
          accountType,
          firstName: trimmedFirstName,
          lastName: trimmedLastName,
          email: trimmedEmail,
          password,
          companyName: companyName.trim(),
          workspaceName: workspaceName.trim(),
          jobTitle: jobTitle.trim(),
          department: department.trim(),
        });
        if (result.needsEmailConfirmation) {
          setMessage('Kayıt oluşturuldu. Supabase e-posta dogrulaması için gelen kutunu kontrol et.');
          if (!rememberMe) {
            setPassword('');
          }
          return;
        }
      } else {
        await signIn(email.trim(), password);
      }

      navigate(returnTo, { replace: true });
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'İşlem sırasında bir hata oluştu.');
    } finally {
      setSubmitting(false);
    }
  }

  function handleOAuth(provider: 'google' | 'azure') {
    setError(null);
    setMessage(null);

    if (!isConfigured) {
      return;
    }

    try {
      signInWithOAuth(provider);
    } catch (oauthError) {
      setError(oauthError instanceof Error ? oauthError.message : 'OAuth girişi başlatılamadı.');
    }
  }

  return (
    <div className="flex min-h-screen" style={{ background: '#0B0B0F', fontFamily: 'Inter, sans-serif' }}>
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div
          style={{
            position: 'absolute',
            width: 600,
            height: 600,
            top: -150,
            left: -150,
            borderRadius: '50%',
            background: 'radial-gradient(circle, #6D28D9 0%, transparent 70%)',
            opacity: 0.2,
            animation: 'plasma1 18s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 400,
            height: 400,
            bottom: -100,
            right: '10%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, #EC4899 0%, transparent 70%)',
            opacity: 0.12,
            animation: 'plasma2 22s ease-in-out infinite',
          }}
        />
      </div>

      <div className="relative z-10 flex flex-1 flex-col justify-center px-8 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-3">
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
            {content.title}
          </h2>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', marginBottom: 32 }}>
            {content.subtitle}{' '}
            <Link to={content.switchHref} style={{ color: '#a78bfa', fontWeight: 600 }}>
              {content.switchText}
            </Link>
          </p>

          {error && (
            <div className="mb-4 rounded-xl p-3 text-sm" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#fca5a5' }}>
              {error}
            </div>
          )}

          {message && (
            <div className="mb-4 rounded-xl p-3 text-sm" style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', color: '#86efac' }}>
              {message}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <div className="space-y-4">
                <div>
                  <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 8 }}>
                    Kayıt tipi
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setAccountType('individual')}
                      className="rounded-xl px-4 py-3 text-left text-sm transition-all"
                      style={{
                        background: accountType === 'individual' ? 'rgba(109,40,217,0.18)' : 'rgba(255,255,255,0.04)',
                        border: accountType === 'individual' ? '1px solid rgba(109,40,217,0.45)' : '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.88)',
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>Bireysel</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                        Tek başına bireysel kullanıcı olarak kaydol
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setAccountType('employee')}
                      className="rounded-xl px-4 py-3 text-left text-sm transition-all"
                      style={{
                        background: accountType === 'employee' ? 'rgba(109,40,217,0.18)' : 'rgba(255,255,255,0.04)',
                        border: accountType === 'employee' ? '1px solid rgba(109,40,217,0.45)' : '1px solid rgba(255,255,255,0.08)',
                        color: 'rgba(255,255,255,0.88)',
                      }}
                    >
                      <div style={{ fontWeight: 700 }}>Firma calışanı</div>
                      <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>
                        Bir firma workspace altında kaydol
                      </div>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Ad" value={firstName} onChange={setFirstName} placeholder="Adınız" required />
                  <Field label="Soyad" value={lastName} onChange={setLastName} placeholder="Soyadınız" required />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Field label="Workspace adı" value={workspaceName} onChange={setWorkspaceName} placeholder="Orn. Mustafa Workspace" required />
                  <Field label="Unvan" value={jobTitle} onChange={setJobTitle} placeholder="Orn. Product Manager" />
                </div>

                {accountType === 'employee' && (
                  <div className="space-y-4">
                    <Field label="Şirket adı" value={companyName} onChange={setCompanyName} placeholder="Şirketiniz" required />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Departman" value={department} onChange={setDepartment} placeholder="Orn. Product" />
                      <div />
                    </div>
                  </div>
                )}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6 }}>
                E-posta
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="siz@sirket.com"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  required
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '13px', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: 6 }}>
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" style={{ color: 'rgba(255,255,255,0.25)' }} />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="********"
                  className="w-full rounded-xl py-3 pl-10 pr-4 text-sm outline-none transition-all duration-300"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.85)',
                  }}
                  minLength={6}
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(event) => setRememberMe(event.target.checked)}
                  className="h-4 w-4 rounded"
                  style={{ accentColor: '#6D28D9' }}
                />
                <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Beni hatırla</span>
              </label>
              {!isSignup && (
                <button type="button" style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 600 }}>
                  Şifremi unuttum?
                </button>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting || !isConfigured}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm text-white transition-all duration-200 disabled:opacity-70"
              style={{
                background: 'linear-gradient(135deg, #6D28D9, #EC4899)',
                fontWeight: 700,
                boxShadow: '0 0 24px rgba(109,40,217,0.4)',
                marginTop: 8,
              }}
            >
              {submitting ? 'İşleniyor...' : content.submitText}
              <ArrowRight className="h-4 w-4" />
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.3)' }}>ya da şununla devam et</span>
              <div className="h-px flex-1" style={{ background: 'rgba(255,255,255,0.08)' }} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              {[
                {
                  label: 'Google',
                  provider: 'google' as const,
                  svg: <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>,
                },
                {
                  label: 'Microsoft',
                  provider: 'azure' as const,
                  svg: <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M11.5 2H2v9.5h9.5V2zm1 0v9.5H22V2h-9.5zm-1 10.5H2V22h9.5v-9.5zm1 0V22H22v-9.5h-9.5z" /></svg>,
                },
              ].map(({ label, provider, svg }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => handleOAuth(provider)}
                  disabled={!isConfigured}
                  className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.09)',
                    color: 'rgba(255,255,255,0.65)',
                    fontWeight: 500,
                    opacity: isConfigured ? 1 : 0.45,
                    cursor: isConfigured ? 'pointer' : 'not-allowed',
                  }}
                >
                  {svg}
                  {label}
                </button>
              ))}
            </div>
          </form>
        </div>
      </div>

      <div
        className="relative hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:p-12"
        style={{ background: 'linear-gradient(135deg, rgba(109,40,217,0.2) 0%, rgba(236,72,153,0.1) 100%)', borderLeft: '1px solid rgba(255,255,255,0.06)' }}
      >
        <div className="max-w-md text-center">
          <div
            className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-3xl"
            style={{ background: 'linear-gradient(135deg, #6D28D9, #EC4899)', boxShadow: '0 0 60px rgba(109,40,217,0.5)' }}
          >
            <span className="text-2xl font-bold text-white">MI</span>
          </div>
          <h3 style={{ fontSize: '26px', fontWeight: 800, color: 'white', letterSpacing: '-0.02em', marginBottom: 12 }}>
            Hesabını güvenle oluştur
          </h3>
          <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.7 }}>
            Kullanıcı ister bireysel olarak ister bir firma workspace altında çalişan olarak kayıt olabilir. Kayıt sonrası auth ve tablo kayıtları birlikte oluşturulur.
          </p>
          <div className="mt-8 flex items-center justify-center gap-6">
            {[
              { val: 'Users', lbl: 'Profil kaydı' },
              { val: 'Teams', lbl: 'Workspace üyeliği' },
              { val: 'Auth', lbl: 'E-posta girişi' },
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
