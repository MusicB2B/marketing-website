import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RequestAccessForm } from '@/components/RequestAccessForm';

const labels = { name: 'Name', email: 'Email' };
const props = {
  submitLabel: 'Request access',
  successMessage: "Thanks, you're on the list.",
  labels,
};

beforeEach(() => vi.stubGlobal('fetch', vi.fn()));
afterEach(() => vi.unstubAllGlobals());

const ok = () => ({ ok: true, json: async () => ({ ok: true }) }) as Response;
const fail = (status: number, error: string) =>
  ({ ok: false, status, json: async () => ({ error }) }) as Response;

describe('RequestAccessForm', () => {
  it('asks for a name and an email, and nothing else', () => {
    render(<RequestAccessForm {...props} />);
    expect(screen.getByPlaceholderText('Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/message/i)).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText(/subject/i)).not.toBeInTheDocument();
  });

  it('carries a honeypot field that is hidden from people', () => {
    const { container } = render(<RequestAccessForm {...props} />);
    const honeypot = container.querySelector('input[name="company"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot).toHaveAttribute('aria-hidden', 'true');
    expect(honeypot).toHaveAttribute('tabIndex', '-1');
  });

  it('posts what was typed and then shows the thank-you', async () => {
    vi.mocked(fetch).mockResolvedValue(ok());
    render(<RequestAccessForm {...props} />);

    await userEvent.type(screen.getByPlaceholderText('Name'), 'Jules');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'jules@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Request access' }));

    await waitFor(() =>
      expect(screen.getByRole('status')).toHaveTextContent("Thanks, you're on the list."),
    );

    const [url, init] = vi.mocked(fetch).mock.calls[0]!;
    expect(url).toBe('/api/contact');
    const body = JSON.parse(String(init!.body));
    expect(body).toMatchObject({ name: 'Jules', email: 'jules@example.com' });
  });

  it('shows the error the server gave, not a generic one', async () => {
    vi.mocked(fetch).mockResolvedValue(fail(429, 'Too many requests. Please try again later.'));
    render(<RequestAccessForm {...props} />);

    await userEvent.type(screen.getByPlaceholderText('Name'), 'Jules');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'jules@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Request access' }));

    await waitFor(() =>
      expect(screen.getByRole('alert')).toHaveTextContent(
        'Too many requests. Please try again later.',
      ),
    );
  });

  // Losing what someone typed because the network blipped is the worst outcome.
  it('keeps the form on screen when the request fails outright', async () => {
    vi.mocked(fetch).mockRejectedValue(new Error('offline'));
    render(<RequestAccessForm {...props} />);

    await userEvent.type(screen.getByPlaceholderText('Name'), 'Jules');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'jules@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Request access' }));

    await waitFor(() => expect(screen.getByRole('alert')).toBeInTheDocument());
    expect(screen.getByPlaceholderText('Name')).toHaveValue('Jules');
  });

  it('disables the button while sending so it cannot be double-submitted', async () => {
    let release: (value: Response) => void = () => {};
    vi.mocked(fetch).mockReturnValue(
      new Promise<Response>((r) => {
        release = r;
      }),
    );
    render(<RequestAccessForm {...props} />);

    await userEvent.type(screen.getByPlaceholderText('Name'), 'Jules');
    await userEvent.type(screen.getByPlaceholderText('Email'), 'jules@example.com');
    await userEvent.click(screen.getByRole('button', { name: 'Request access' }));

    await waitFor(() => expect(screen.getByRole('button')).toBeDisabled());
    release(ok());
  });
});
