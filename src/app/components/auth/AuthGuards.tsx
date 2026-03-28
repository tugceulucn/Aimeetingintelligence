import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../../context/AuthContext';

function FullScreenMessage({ text }: { text: string }) {
  return (
    <div
      className="flex min-h-screen items-center justify-center text-sm text-white/70"
      style={{ background: '#0B0B0F', fontFamily: 'Inter, sans-serif' }}
    >
      {text}
    </div>
  );
}

export function RequireAuth() {
  const location = useLocation();
  const { user, loading, isConfigured } = useAuth();

  if (loading) {
    return <FullScreenMessage text="Oturum kontrol ediliyor..." />;
  }

  if (!isConfigured) {
    return <Navigate to="/login" replace state={{ from: location.pathname, configError: true }} />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
}

export function PublicOnlyRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return <FullScreenMessage text="Sayfa hazirlaniyor..." />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
