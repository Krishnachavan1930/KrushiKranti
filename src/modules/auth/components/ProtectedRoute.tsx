import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../../shared/hooks';
import type { Role } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Role[];
}

const isDev = import.meta.env.MODE === 'development';

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user, role: stateRole } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const currentRole = stateRole || user?.role;

  // Temporary logging to verify state
  console.log('[ProtectedRoute] Check:', {
    path: location.pathname,
    isAuthenticated,
    role: currentRole,
    isDev
  });

  // Bypass for DEV mode if requested
  if (isDev && allowedRoles?.includes('admin')) {
    console.warn('[ProtectedRoute] DEV MODE BYPASS ACTIVE');
    // We already have devAdmin in authSlice state, but this catches any edge cases
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    // Redirect to login for any protected path
    const privatePrefixes = ['/admin', '/farmer', '/wholesaler'];
    const privateExactPaths = [
      '/dashboard', '/orders', '/wishlist', '/chat',
      '/profile', '/checkout',
    ];

    const isPrivatePath =
      privatePrefixes.some((prefix) => location.pathname.startsWith(prefix)) ||
      privateExactPaths.some((p) => location.pathname === p || location.pathname.startsWith(p + '/'));

    if (isPrivatePath) {
      return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Public route wrapped in ProtectedRoute — allow through
    return <>{children}</>;
  }

  if (allowedRoles && currentRole && !allowedRoles.includes(currentRole as Role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
