'use client';

import { useState } from 'react';
import { Logo } from '@/components/Brand';

export function Login() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError('');

    try {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        window.location.reload();
        return;
      }
      const data = await response.json().catch(() => ({}));
      setError(data.error ?? 'Could not sign in.');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center px-6">
      <form onSubmit={submit} className="w-full max-w-sm">
        <span className="text-brand mb-8 flex justify-center">
          <Logo id="logo-login" width={150} height={42} />
        </span>
        <h1 className="mb-2 text-center text-[1.6rem] font-bold">Edit the site</h1>
        <p className="mb-7 text-center text-[0.98rem]">
          Enter the shared password to change the copy.
        </p>

        <label htmlFor="password" className="text-ink mb-2 block text-[0.9rem] font-semibold">
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoFocus
          autoComplete="current-password"
          className="border-line-strong focus:border-brand w-full rounded-xl border bg-white px-4 py-3 text-[1rem] outline-none"
        />

        {error && (
          <p role="alert" className="mt-3 text-[0.9rem] font-medium text-red-600">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy || !password}
          className="bg-brand hover:bg-brand-dark mt-5 w-full rounded-xl py-3 text-[1rem] font-semibold text-white transition-colors disabled:opacity-40"
        >
          {busy ? 'Checking…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
