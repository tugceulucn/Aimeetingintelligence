import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  consumeSessionFromUrl,
  fetchUser,
  getOAuthUrl,
  getStoredSession,
  isSupabaseConfigured,
  refreshSession,
  signInWithPassword,
  signOutRequest,
  type SignUpPayload,
  signUpWithPassword,
  storeSession,
  type SupabaseSession,
  type SupabaseUser,
} from '../lib/supabaseAuth';

type AuthContextValue = {
  user: SupabaseUser | null;
  session: SupabaseSession | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<{ needsEmailConfirmation: boolean }>;
  signInWithOAuth: (provider: 'google' | 'azure') => void;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function isSessionFresh(session: SupabaseSession | null) {
  if (!session?.expires_at) {
    return true;
  }

  return session.expires_at > Math.floor(Date.now() / 1000) + 30;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<SupabaseSession | null>(null);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [loading, setLoading] = useState(true);
  const isConfigured = isSupabaseConfigured();

  useEffect(() => {
    let active = true;

    async function init() {
      const sessionFromUrl = consumeSessionFromUrl();
      const storedSession = sessionFromUrl ?? getStoredSession();

      if (!storedSession || !isConfigured) {
        if (active) {
          setSession(storedSession);
          setUser(storedSession?.user ?? null);
          setLoading(false);
        }
        return;
      }

      try {
        const nextSession = isSessionFresh(storedSession)
          ? storedSession
          : await refreshSession(storedSession.refresh_token);
        const nextUser = await fetchUser(nextSession.access_token);
        const hydrated = { ...nextSession, user: nextUser };

        storeSession(hydrated);

        if (active) {
          setSession(hydrated);
          setUser(nextUser);
        }
      } catch {
        storeSession(null);
        if (active) {
          setSession(null);
          setUser(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void init();

    return () => {
      active = false;
    };
  }, [isConfigured]);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    session,
    loading,
    isConfigured,
    async signIn(email: string, password: string) {
      const nextSession = await signInWithPassword(email, password);
      setSession(nextSession);
      setUser(nextSession.user);
    },
    async signUp(payload: SignUpPayload) {
      const result = await signUpWithPassword(payload);
      if (result.session) {
        setSession(result.session);
        setUser(result.session.user);
      }
      return { needsEmailConfirmation: result.needsEmailConfirmation };
    },
    signInWithOAuth(provider: 'google' | 'azure') {
      window.location.assign(getOAuthUrl(provider));
    },
    async signOut() {
      const accessToken = session?.access_token;
      setSession(null);
      setUser(null);
      storeSession(null);

      if (accessToken) {
        await signOutRequest(accessToken);
      }
    },
  }), [loading, session, user, isConfigured]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
