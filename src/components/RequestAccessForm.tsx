'use client';

import { useState } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';

const FIELD =
  'w-full rounded-lg border border-line-strong bg-white px-3.5 py-2.5 text-[0.95rem] text-ink outline-none transition-colors focus:border-brand';

/**
 * Name and email only. A message box asks for effort at the exact moment
 * someone is deciding whether to bother, and we can ask everything else in the
 * reply.
 */
export function RequestAccessForm({
  submitLabel,
  successMessage,
  labels,
}: {
  submitLabel: string;
  successMessage: string;
  labels: { name: string; email: string };
}) {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    setState('sending');
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        setState('sent');
        form.reset();
        return;
      }
      const payload = await response.json().catch(() => ({}));
      setError(payload.error ?? 'Could not send that.');
      setState('error');
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <div
        role="status"
        className="border-brand/30 bg-brand-tint rounded-card flex items-center justify-center gap-3 border px-6 py-5 text-center"
      >
        <span className="bg-brand flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="h-3.5 w-3.5"
          >
            <path d="m5 12 5 5L19 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-ink text-[1rem] font-bold">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      {/* Honeypot — hidden from people, tempting to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="grid gap-2.5 sm:grid-cols-[1fr_1fr_auto]">
        <label className="block">
          <span className="sr-only">{labels.name}</span>
          <input
            name="name"
            required
            maxLength={100}
            autoComplete="name"
            placeholder={labels.name}
            className={FIELD}
          />
        </label>
        <label className="block">
          <span className="sr-only">{labels.email}</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            placeholder={labels.email}
            className={FIELD}
          />
        </label>
        <button
          type="submit"
          disabled={state === 'sending'}
          className="bg-brand hover:bg-brand-dark rounded-lg px-6 py-2.5 text-[0.95rem] font-semibold whitespace-nowrap text-white transition-colors disabled:opacity-50"
        >
          {state === 'sending' ? 'Sending…' : submitLabel}
        </button>
      </div>

      {error && (
        <p role="alert" className="mt-3 text-[0.9rem] font-medium text-red-600">
          {error}
        </p>
      )}
    </form>
  );
}
