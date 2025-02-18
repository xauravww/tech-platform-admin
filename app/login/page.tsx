'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../context/authContext';
import { Input } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading,setLoading] = useState(false)
  const router = useRouter();
  const { setToken } = useAuth();

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(!visible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Login failed');
      }

      const tokenFromCookies = document.cookie
        .split('; ')
        .find(row => row.startsWith('token='))
        ?.split('=')[1];

      setToken(tokenFromCookies || null);
      router.push('/admin');
      router.refresh();
    } catch (error: any) {
      setError(error.message);
    }finally{
      setLoading(false)
    }
  };

  const navigateToSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden" style={{ minHeight: "calc(100vh - 65px)" }}
>
      {/* Background blur elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 opacity-30 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gray-700 opacity-30 rounded-full blur-3xl"></div>

      {/* Glassmorphism container */}
      <div className="relative z-10 backdrop-blur-xl bg-white/10 border border-white/20 shadow-lg p-8 rounded-xl w-96">
        <h1 className="text-3xl font-bold mb-6 text-white text-center">Login</h1>
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded mb-4">{error}</div>
        )}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-white text-sm font-bold mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 border rounded bg-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-white text-sm font-bold mb-2">Password</label>
            <div className="relative w-full">
              <input
                type={visible ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="custom-password-input w-full p-2 border rounded bg-white/30 text-white placeholder-white/70 focus:outline-none focus:bg-white/20"
                required
              />
              <span
                onClick={toggleVisibility}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
              >
                {visible ? <EyeTwoTone style={{ color: '#fff' }} /> : <EyeInvisibleOutlined style={{ color: '#fff' }} />}
              </span>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-white/20 text-white py-2 px-4 rounded hover:bg-white/30 transition-all duration-300"
          >
           {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        {/* Link to Signup Page */}
        <div className="mt-4 text-center">
          <p className="text-sm text-white/80">
            Don&apos;t have an account?{' '}
            <button onClick={navigateToSignup} className="text-white hover:underline">
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
