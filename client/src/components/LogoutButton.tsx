import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { translations } from '../lib/translations';

export default function LogoutButton() {
  const { logout } = useAuth();
  const { profile } = useApp();
  const t = translations[profile.language] || translations.English;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors shadow-md flex items-center justify-center min-w-[80px] text-sm font-medium"
    >
      {t.nav?.logout || 'Logout'}
    </button>
  );
}