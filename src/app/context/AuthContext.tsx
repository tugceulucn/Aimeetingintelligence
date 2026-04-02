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
  fetchAppUser,
  fetchUserWorkspace,
  fetchUser,
  getOAuthUrl,
  getStoredSession,
  isSupabaseConfigured,
  markUserAsSignedIn,
  markUserAsSignedOut,
  refreshSession,
  signInWithPassword,
  signOutRequest,
  type AppWorkspace,
  type AppUser,
  type SignUpPayload,
  signUpWithPassword,
  storeSession,
  syncUserRecord,
  deleteProfileImage,
  updateAuthUserMetadata,
  updateAppUser,
  updateUserPreferences,
  updateWorkspace,
  uploadProfileImage,
  type SupabaseSession,
  type SupabaseUser,
} from '../lib/supabaseAuth';
import type { Language, Theme } from './AppContext';

type AuthContextValue = {
  user: SupabaseUser | null;
  appUser: AppUser | null;
  workspace: AppWorkspace | null;
  session: SupabaseSession | null;
  loading: boolean;
  isConfigured: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (payload: SignUpPayload) => Promise<{ needsEmailConfirmation: boolean }>;
  signInWithOAuth: (provider: 'google' | 'azure') => void;
  signOut: () => Promise<void>;
  refreshAppUser: () => Promise<void>;
  updatePreferences: (preferences: { language?: Language; theme?: Theme }) => Promise<void>;
  saveProfile: (profile: { firstName: string; lastName: string; jobTitle?: string; avatarFile?: File | null }) => Promise<void>;
  saveWorkspace: (workspaceName: string) => Promise<void>;
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
  const [appUser, setAppUser] = useState<AppUser | null>(null);
  const [workspace, setWorkspace] = useState<AppWorkspace | null>(null);
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
          setAppUser(null);
          setWorkspace(null);
          setLoading(false);
        }
        return;
      }

      try {
        const nextSession = isSessionFresh(storedSession)
          ? storedSession
          : await refreshSession(storedSession.refresh_token);
        await syncUserRecord(nextSession);
        const nextAppUser = await markUserAsSignedIn(nextSession);
        const nextUser = await fetchUser(nextSession.access_token);
        const nextWorkspace = await fetchUserWorkspace(nextSession.access_token, nextSession.user.id);
        const hydrated = { ...nextSession, user: nextUser };

        storeSession(hydrated);

        if (active) {
          setSession(hydrated);
          setUser(nextUser);
          setAppUser(nextAppUser);
          setWorkspace(nextWorkspace);
        }
      } catch {
        storeSession(null);
        if (active) {
          setSession(null);
          setUser(null);
          setAppUser(null);
          setWorkspace(null);
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
    appUser,
    workspace,
    session,
    loading,
    isConfigured,
    async signIn(email: string, password: string) {
      const nextSession = await signInWithPassword(email, password);
      await syncUserRecord(nextSession);
      const nextUser = await fetchUser(nextSession.access_token);
      const hydrated = { ...nextSession, user: nextUser };
      const nextAppUser = await markUserAsSignedIn(hydrated);
      const nextWorkspace = await fetchUserWorkspace(hydrated.access_token, hydrated.user.id);

      storeSession(hydrated);
      setSession(hydrated);
      setUser(nextUser);
      setAppUser(nextAppUser);
      setWorkspace(nextWorkspace);
    },
    async signUp(payload: SignUpPayload) {
      const result = await signUpWithPassword(payload);
      if (result.session) {
        const nextUser = await fetchUser(result.session.access_token);
        const hydrated = { ...result.session, user: nextUser };
        const nextAppUser = (await fetchAppUser(hydrated.access_token, hydrated.user.id))
          ?? (await markUserAsSignedIn(hydrated));
        const nextWorkspace = await fetchUserWorkspace(hydrated.access_token, hydrated.user.id);

        storeSession(hydrated);
        setSession(hydrated);
        setUser(nextUser);
        setAppUser(nextAppUser);
        setWorkspace(nextWorkspace);
      }
      return { needsEmailConfirmation: result.needsEmailConfirmation };
    },
    signInWithOAuth(provider: 'google' | 'azure') {
      window.location.assign(getOAuthUrl(provider));
    },
    async signOut() {
      const currentSession = session;
      setSession(null);
      setUser(null);
      setAppUser(null);
      setWorkspace(null);
      storeSession(null);

      if (currentSession) {
        await markUserAsSignedOut(currentSession).catch(() => null);
        await signOutRequest(currentSession.access_token);
      }
    },
    async refreshAppUser() {
      if (!session) {
        setAppUser(null);
        return;
      }

      const nextAppUser = await fetchAppUser(session.access_token, session.user.id);
      setAppUser(nextAppUser);
      const nextWorkspace = await fetchUserWorkspace(session.access_token, session.user.id);
      setWorkspace(nextWorkspace);
    },
    async updatePreferences(preferences) {
      if (!session) {
        return;
      }

      const nextAppUser = await updateUserPreferences(session, preferences);
      if (nextAppUser) {
        setAppUser(nextAppUser);
      }
    },
    async saveProfile(profile) {
      if (!session) {
        return;
      }

      const fullName = `${profile.firstName} ${profile.lastName}`.trim();
      const previousAvatarFileName = appUser?.avatar_url?.trim() || null;
      let uploadedAvatarFileName: string | undefined;

      try {
        uploadedAvatarFileName = profile.avatarFile
          ? await uploadProfileImage(session.access_token, profile.avatarFile)
          : undefined;

        const nextAppUser = await updateAppUser(session.access_token, session.user.id, {
          full_name: fullName,
          avatar_url: uploadedAvatarFileName,
          job_title: profile.jobTitle?.trim() || null,
        });
        const nextUser = await updateAuthUserMetadata(session.access_token, {
          first_name: profile.firstName.trim(),
          last_name: profile.lastName.trim(),
          full_name: fullName,
          avatar_url: uploadedAvatarFileName ?? previousAvatarFileName,
          job_title: profile.jobTitle?.trim() || null,
        });

        if (nextAppUser) {
          setAppUser(nextAppUser);
        }

        setUser(nextUser);
        setSession((currentSession) =>
          currentSession
            ? {
                ...currentSession,
                user: nextUser,
              }
            : currentSession
        );

        if (uploadedAvatarFileName && previousAvatarFileName && previousAvatarFileName !== uploadedAvatarFileName) {
          await deleteProfileImage(session.access_token, previousAvatarFileName).catch(() => null);
        }
      } catch (error) {
        if (uploadedAvatarFileName) {
          await deleteProfileImage(session.access_token, uploadedAvatarFileName).catch(() => null);
        }

        throw error;
      }
    },
    async saveWorkspace(workspaceName) {
      if (!session || !workspace) {
        return;
      }

      const nextWorkspace = await updateWorkspace(session.access_token, workspace.id, {
        name: workspaceName.trim(),
      });

      if (nextWorkspace) {
        setWorkspace(nextWorkspace);
      }
    },
  }), [appUser, loading, session, user, workspace, isConfigured]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
