'use client';

import { useState } from 'react';

type State = 'idle' | 'sending' | 'sent' | 'error';

const FIELD =
  'w-full rounded-xl border border-line-strong bg-white px-4 py-3 text-[1rem] text-ink outline-none transition-colors focus:border-brand';

export function RequestAccessForm({
  submitLabel,
  successMessage,
  labels,
}: {
  submitLabel: string;
  successMessage: string;
  labels: { name: string; email: string; subject: string; message: string };
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
        className="border-brand/30 bg-brand-tint rounded-card border p-8 text-center"
      >
        <span className="bg-brand mx-auto mb-4 flex h-11 w-11 items-center justify-center rounded-full text-white">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            className="h-5 w-5"
          >
            <path d="m5 12 5 5L19 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        <p className="text-ink text-[1.1rem] font-bold">{successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="border-line rounded-card border bg-white p-6 sm:p-8">
      {/* Honeypot — hidden from people, tempting to bots. */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute h-0 w-0 overflow-hidden opacity-0"
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-ink mb-1.5 block text-[0.88rem] font-semibold">{labels.name}</span>
          <input name="name" required maxLength={100} autoComplete="name" className={FIELD} />
        </label>
        <label className="block">
          <span className="text-ink mb-1.5 block text-[0.88rem] font-semibold">{labels.email}</span>
          <input
            name="email"
            type="email"
            required
            maxLength={200}
            autoComplete="email"
            className={FIELD}
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="text-ink mb-1.5 block text-[0.88rem] font-semibold">{labels.subject}</span>
        <input name="subject" required maxLength={150} className={FIELD} />
      </label>

      <label className="mt-4 block">
        <span className="text-ink mb-1.5 block text-[0.88rem] font-semibold">{labels.message}</span>
        <textarea
          name="message"
          required
          rows={5}
          maxLength={4000}
          className={`${FIELD} resize-y`}
        />
      </label>

      {error && (
        <p role="alert" className="mt-4 text-[0.92rem] font-medium text-red-600">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="bg-brand hover:bg-brand-dark mt-6 w-full rounded-xl py-3.5 text-[1.05rem] font-semibold text-white transition-colors disabled:opacity-50"
      >
        {state === 'sending' ? 'Sending…' : submitLabel}
      </button>
    </form>
  );
}
