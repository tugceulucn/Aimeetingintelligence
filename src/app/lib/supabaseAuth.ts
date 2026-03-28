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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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

export async function signUpWithPassword({
  firstName,
  lastName,
  email,
  password,
}: SignUpPayload) {
  const data = await request<SignUpResponse>('/auth/v1/signup', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      email_redirect_to: getSupabaseCallbackUrl(),
      data: {
        first_name: firstName,
        last_name: lastName,
        full_name: `${firstName} ${lastName}`.trim(),
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
