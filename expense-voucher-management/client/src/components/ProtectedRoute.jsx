import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { getMe } from '../services/authService';

const ROLE_ROUTES = {
  Employee: '/employee',
  Director: '/director',
  Accounts: '/accounts',
};

export default function ProtectedRoute({ allowedRole, children }) {
  const [status, setStatus] = useState('checking');

  useEffect(() => {
    let active = true;

    getMe()
      .then((result) => {
        if (!active) return;
        const role = result.data.user.role;
        setStatus({ ok: true, role });
      })
      .catch(() => {
        if (!active) return;
        setStatus({ ok: false });
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!status.ok) {
    return <Navigate to="/login" replace />;
  }

  if (status.role !== allowedRole) {
    return <Navigate to={ROLE_ROUTES[status.role] || '/login'} replace />;
  }

  return children;
}
