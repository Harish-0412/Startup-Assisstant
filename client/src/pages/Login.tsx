import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { translations } from '../lib/translations';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login, signup, loginWithGoogle } = useAuth();
  const { profile } = useApp();
  
  const t = translations[profile.language] || translations.English;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      if (error.code === 'auth/weak-password') {
        alert('Password must be at least 6 characters long');
      } else if (error.code === 'auth/email-already-in-use') {
        alert('Email already in use');
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email address');
      } else if (error.code === 'auth/user-not-found') {
        alert('User not found');
      } else if (error.code === 'auth/wrong-password') {
        alert('Wrong password');
      } else {
        alert('Authentication failed: ' + error.message);
      }
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (error: any) {
      console.error('Google auth error:', error);
      if (error.code === 'auth/operation-not-allowed') {
        alert('Google login is not enabled. Please use email/password.');
      } else {
        alert('Google login failed: ' + error.message);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">
          {isLogin ? (t.auth?.login || 'Login') : (t.auth?.signup || 'Sign Up')}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder={t.auth?.email || 'Email'}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="password"
            placeholder={t.auth?.password || 'Password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Loading...' : (isLogin ? (t.auth?.login || 'Login') : (t.auth?.signup || 'Sign Up'))}
          </button>
        </form>
        
        <div className="my-4 text-center">
          <span className="text-gray-500">or</span>
        </div>
        
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-red-600 text-white p-3 rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
        >
          {loading ? 'Loading...' : (t.auth?.loginWithGoogle || 'Continue with Google')}
        </button>
        
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? (t.auth?.noAccount || "Don't have an account?") : (t.auth?.hasAccount || 'Already have an account?')}
          </button>
        </div>
      </div>
    </div>
  );
}