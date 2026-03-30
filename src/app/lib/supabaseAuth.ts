const STORAGE_KEY = 'meetinsight-supabase-session';

export type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
};

export type SupabaseSession = {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
  user: SupabaseUser;
};

type PasswordAuthResponse = {
  access_token: string;
  refresh_token: string;
  expires_in?: number;
  expires_at?: number;
  user: SupabaseUser;
  error_description?: string;
  msg?: string;
};

type SignUpResponse = {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user?: SupabaseUser;
  error_description?: string;
  msg?: string;
};

export type SignUpPayload = {
  accountType: 'individual' | 'employee';
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  companyName?: string;
  workspaceName?: string;
  jobTitle?: string;
  department?: string;
};

export type AppUser = {
  id: string;
  email: string;
  full_name?: string | null;
  job_title?: string | null;
  department?: string | null;
  timezone?: string | null;
  language?: string | null;
  locale?: string | null;
  auth_provider?: string | null;
  email_verified?: boolean | null;
  is_active?: boolean | null;
  last_login_at?: string | null;
  theme?: string | null;
  accent_color?: string | null;
  default_summary_style?: string | null;
  ai_opt_in?: boolean | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export type AppWorkspace = {
  id: string;
  name: string;
  company_name?: string | null;
};

type WorkspaceMemberRow = {
  id: string;
  workspace_id: string;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

function getExpiresAt(expiresIn?: number, expiresAt?: number) {
  if (expiresAt) return expiresAt;
  if (expiresIn) return Math.floor(Date.now() / 1000) + expiresIn;
  return undefined;
}

async function request<T>(path: string, init: RequestInit = {}) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase ayarlari eksik. VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanimlayin.');
  }

  const response = await fetch(`${supabaseUrl}${path}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; error_description?: string; msg?: string })
    | null;

  if (!response.ok) {
    const message =
      data?.error_description ??
      data?.message ??
      data?.msg ??
      'Supabase istegi basarisiz oldu.';
    throw new Error(message);
  }

  return data as T;
}

async function restRequest<T>(path: string, init: RequestInit = {}, accessToken?: string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase ayarlari eksik. VITE_SUPABASE_URL ve VITE_SUPABASE_ANON_KEY tanimlayin.');
  }

  const response = await fetch(`${supabaseUrl}/rest/v1${path}`, {
    ...init,
    headers: {
      apikey: supabaseAnonKey,
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...(init.headers ?? {}),
    },
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; hint?: string; details?: string })
    | null;

  if (!response.ok) {
    const message =
      data?.message ??
      data?.hint ??
      data?.details ??
      'Veritabani islemi basarisiz oldu.';
    throw new Error(message);
  }

  return data as T;
}

async function selectUserById(accessToken: string, userId: string) {
  const rows = await restRequest<AppUser[]>(
    `/users?select=*&id=eq.${encodeURIComponent(userId)}`,
    { method: 'GET' },
    accessToken
  );

  return rows[0] ?? null;
}

async function selectUserByEmail(accessToken: string, email: string) {
  const rows = await restRequest<AppUser[]>(
    `/users?select=*&email=eq.${encodeURIComponent(email)}`,
    { method: 'GET' },
    accessToken
  );

  return rows[0] ?? null;
}

async function selectWorkspaceMembership(accessToken: string, userId: string) {
  const rows = await restRequest<WorkspaceMemberRow[]>(
    `/workspace_members?select=id,workspace_id&user_id=eq.${encodeURIComponent(userId)}&limit=1`,
    { method: 'GET' },
    accessToken
  );

  return rows[0] ?? null;
}

async function selectWorkspaceById(accessToken: string, workspaceId: string) {
  const rows = await restRequest<AppWorkspace[]>(
    `/workspaces?select=id,name,company_name&id=eq.${encodeURIComponent(workspaceId)}&limit=1`,
    { method: 'GET' },
    accessToken
  );

  return rows[0] ?? null;
}

async function insertUserRow(session: SupabaseSession, payload: SignUpPayload) {
  const rows = await restRequest<AppUser[]>(
    '/users',
    {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify([
        {
          id: session.user.id,
          email: payload.email,
          full_name: `${payload.firstName} ${payload.lastName}`.trim(),
          job_title: payload.jobTitle?.trim() || null,
          department: payload.department?.trim() || null,
          timezone: 'Europe/Istanbul',
          language: 'tr',
          locale: 'tr-TR',
          auth_provider: 'email',
          email_verified: false,
          is_active: true,
          last_login_at: new Date().toISOString(),
          theme: 'system',
          default_summary_style: 'bullet',
          ai_opt_in: true,
        },
      ]),
    },
    session.access_token
  );

  return rows[0];
}

export async function fetchAppUser(accessToken: string, userId: string) {
  return selectUserById(accessToken, userId);
}

export async function fetchUserWorkspace(accessToken: string, userId: string) {
  const membership = await selectWorkspaceMembership(accessToken, userId);
  if (!membership?.workspace_id) {
    return null;
  }

  return selectWorkspaceById(accessToken, membership.workspace_id);
}

export async function updateAppUser(
  accessToken: string,
  userId: string,
  payload: Partial<
    Pick<
      AppUser,
      | 'full_name'
      | 'job_title'
      | 'department'
      | 'timezone'
      | 'language'
      | 'locale'
      | 'email_verified'
      | 'is_active'
      | 'last_login_at'
      | 'theme'
      | 'accent_color'
      | 'default_summary_style'
      | 'ai_opt_in'
    >
  >
) {
  const rows = await restRequest<AppUser[]>(
    `/users?id=eq.${encodeURIComponent(userId)}`,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    },
    accessToken
  );

  return rows[0] ?? null;
}

export async function updateWorkspace(
  accessToken: string,
  workspaceId: string,
  payload: Partial<Pick<AppWorkspace, 'name' | 'company_name'>>
) {
  const rows = await restRequest<AppWorkspace[]>(
    `/workspaces?id=eq.${encodeURIComponent(workspaceId)}`,
    {
      method: 'PATCH',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify(payload),
    },
    accessToken
  );

  return rows[0] ?? null;
}

async function insertWorkspaceRow(accessToken: string, payload: SignUpPayload) {
  const workspaceName =
    payload.workspaceName?.trim() ||
    payload.companyName?.trim() ||
    `${payload.firstName} ${payload.lastName} Workspace`;

  const rows = await restRequest<AppWorkspace[]>(
    '/workspaces',
    {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify([
        {
          name: workspaceName,
          company_name: payload.accountType === 'employee' ? payload.companyName?.trim() || workspaceName : null,
        },
      ]),
    },
    accessToken
  );

  return rows[0];
}

async function insertWorkspaceMember(accessToken: string, userId: string, workspaceId: string, payload: SignUpPayload) {
  await restRequest<WorkspaceMemberRow[]>(
    '/workspace_members',
    {
      method: 'POST',
      headers: {
        Prefer: 'return=representation',
      },
      body: JSON.stringify([
        {
          workspace_id: workspaceId,
          user_id: userId,
          role: payload.accountType === 'employee' ? 'member' : 'owner',
          currency: 'TRY',
        },
      ]),
    },
    accessToken
  );
}

async function ensureAppData(session: SupabaseSession, payload: SignUpPayload) {
  let appUser = await selectUserById(session.access_token, session.user.id);

  if (!appUser) {
    appUser = await selectUserByEmail(session.access_token, payload.email);
  }

  if (!appUser) {
    appUser = await insertUserRow(session, payload);
  }

  const membership = await selectWorkspaceMembership(session.access_token, appUser.id);

  if (!membership) {
    const workspace = await insertWorkspaceRow(session.access_token, payload);
    await insertWorkspaceMember(session.access_token, appUser.id, workspace.id, payload);
  }
}

function getDefaultLocale(language?: string | null) {
  return language === 'tr' ? 'tr-TR' : 'en-US';
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

export function getSupabaseCallbackUrl() {
  if (typeof window === 'undefined') {
    return '';
  }

  return `${window.location.origin}/login`;
}

export function getStoredSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SupabaseSession;
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function storeSession(session: SupabaseSession | null) {
  if (typeof window === 'undefined') {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export async function signInWithPassword(email: string, password: string) {
  const data = await request<PasswordAuthResponse>('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  const session: SupabaseSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: getExpiresAt(data.expires_in, data.expires_at),
    user: data.user,
  };

  storeSession(session);
  return session;
}

export async function signUpWithPassword(payload: SignUpPayload) {
  const data = await request<SignUpResponse>('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: payload.email,
      password: payload.password,
      email_redirect_to: getSupabaseCallbackUrl(),
      data: {
        account_type: payload.accountType,
        first_name: payload.firstName,
        last_name: payload.lastName,
        full_name: `${payload.firstName} ${payload.lastName}`.trim(),
        company_name: payload.companyName?.trim() || null,
        workspace_name: payload.workspaceName?.trim() || null,
        job_title: payload.jobTitle?.trim() || null,
        department: payload.department?.trim() || null,
      },
    }),
  });

  if (data.access_token && data.refresh_token && data.user) {
    const session: SupabaseSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: getExpiresAt(data.expires_in, data.expires_at),
      user: data.user,
    };

    await ensureAppData(session, payload);
    storeSession(session);

    return {
      session,
      needsEmailConfirmation: false,
    };
  }

  return {
    session: null,
    needsEmailConfirmation: true,
  };
}

export async function fetchUser(accessToken: string) {
  return request<SupabaseUser>('/auth/v1/user', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function updateAuthUserMetadata(
  accessToken: string,
  metadata: Record<string, unknown>
) {
  return request<SupabaseUser>('/auth/v1/user', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      data: metadata,
    }),
  });
}

export async function refreshSession(refreshToken: string) {
  const data = await request<PasswordAuthResponse>('/auth/v1/token?grant_type=refresh_token', {
    method: 'POST',
    body: JSON.stringify({ refresh_token: refreshToken }),
  });

  const session: SupabaseSession = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: getExpiresAt(data.expires_in, data.expires_at),
    user: data.user,
  };

  storeSession(session);
  return session;
}

export async function syncUserRecord(session: SupabaseSession) {
  if (!session.user.email) {
    return null;
  }

  const metadata = session.user.user_metadata ?? {};
  await ensureAppData(session, {
    accountType: metadata.account_type === 'employee' ? 'employee' : 'individual',
    firstName:
      typeof metadata.first_name === 'string' && metadata.first_name.trim()
        ? metadata.first_name.trim()
        : session.user.email.split('@')[0],
    lastName:
      typeof metadata.last_name === 'string' && metadata.last_name.trim()
        ? metadata.last_name.trim()
        : 'User',
    email: session.user.email,
    password: '',
    companyName: typeof metadata.company_name === 'string' ? metadata.company_name : undefined,
    workspaceName: typeof metadata.workspace_name === 'string' ? metadata.workspace_name : undefined,
    jobTitle: typeof metadata.job_title === 'string' ? metadata.job_title : undefined,
    department: typeof metadata.department === 'string' ? metadata.department : undefined,
  });

  return fetchAppUser(session.access_token, session.user.id);
}

export async function markUserAsSignedIn(session: SupabaseSession) {
  const appUser = await fetchAppUser(session.access_token, session.user.id);
  if (!appUser) {
    return null;
  }

  return updateAppUser(session.access_token, session.user.id, {
    is_active: true,
    last_login_at: new Date().toISOString(),
    locale: appUser.locale?.trim() || getDefaultLocale(appUser.language),
  });
}

export async function markUserAsSignedOut(session: SupabaseSession) {
  return updateAppUser(session.access_token, session.user.id, {
    is_active: false,
  });
}

export async function updateUserPreferences(
  session: SupabaseSession,
  preferences: {
    language?: 'en' | 'tr';
    theme?: 'dark' | 'light';
  }
) {
  const payload: Partial<AppUser> = {};

  if (preferences.language) {
    payload.language = preferences.language;
    payload.locale = getDefaultLocale(preferences.language);
  }

  if (preferences.theme) {
    payload.theme = preferences.theme;
  }

  return updateAppUser(session.access_token, session.user.id, payload);
}

export async function signOutRequest(accessToken: string) {
  if (!isSupabaseConfigured()) {
    storeSession(null);
    return;
  }

  await fetch(`${supabaseUrl}/auth/v1/logout`, {
    method: 'POST',
    headers: {
      apikey: supabaseAnonKey!,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  }).catch(() => null);

  storeSession(null);
}

export function getOAuthUrl(provider: 'google' | 'azure') {
  if (!supabaseUrl || !supabaseAnonKey || typeof window === 'undefined') {
    throw new Error('Supabase ayarlari eksik. OAuth baslatilamadi.');
  }

  const url = new URL('/auth/v1/authorize', supabaseUrl);
  url.searchParams.set('provider', provider);
  url.searchParams.set('redirect_to', getSupabaseCallbackUrl());
  url.searchParams.set('response_type', 'token');

  return url.toString();
}

export function consumeSessionFromUrl() {
  if (typeof window === 'undefined') {
    return null;
  }

  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash;

  if (!hash) {
    return null;
  }

  const params = new URLSearchParams(hash);
  const accessToken = params.get('access_token');
  const refreshToken = params.get('refresh_token');
  const expiresAt = params.get('expires_at');

  if (!accessToken || !refreshToken) {
    return null;
  }

  const session: SupabaseSession = {
    access_token: accessToken,
    refresh_token: refreshToken,
    expires_at: expiresAt ? Number(expiresAt) : undefined,
    user: {
      id: params.get('provider_token') ?? 'oauth-user',
      email: params.get('email') ?? undefined,
    },
  };

  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
  storeSession(session);
  return session;
}
