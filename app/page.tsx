'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        localStorage.setItem('auth-token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        router.push('/dashboard');
      } else {
        setError(data.error || 'Credenciais inválidas');
      }
    } catch (err) {
      setError('Erro ao conectar');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md p-8 bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-700/50">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">CCPServices</h1>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-slate-100 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded text-white"
              required
            />
          </div>
          
          <div>
            <label className="block text-slate-100 mb-2">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600 rounded text-white"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-cyan-600 text-white rounded-lg font-semibold hover:opacity-90"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
