/**
 * Sends the "Request access" enquiry to the team inbox.
 *
 * Uses Resend's REST API over plain fetch, so there is no mail dependency to
 * install or keep updated, and it behaves on serverless where raw SMTP
 * connections are slow and often blocked.
 *
 * To use an existing mailbox over SMTP instead (a Hostinger or Google
 * Workspace account, say), swap the body of `sendEnquiry` for nodemailer —
 * nothing else in the app reaches for a mail provider.
 */

export interface Enquiry {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export class MailNotConfigured extends Error {}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function sendEnquiry(enquiry: Enquiry): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL ?? 'onboarding@resend.dev';

  if (!apiKey || !to) {
    throw new MailNotConfigured('RESEND_API_KEY and CONTACT_EMAIL must both be set.');
  }

  const rows: [string, string][] = [
    ['Name', enquiry.name],
    ['Email', enquiry.email],
    ['Subject', enquiry.subject],
  ];

  const html = `
    <div style="font-family:Roboto,Arial,sans-serif;color:#18181b;line-height:1.6">
      <h2 style="margin:0 0 16px">New access request</h2>
      <table style="border-collapse:collapse;margin-bottom:20px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#52525b">${label}</td>
                   <td style="padding:4px 0"><strong>${escapeHtml(value)}</strong></td></tr>`,
          )
          .join('')}
      </table>
      <div style="padding:16px;background:#f6f5f3;border-radius:8px;white-space:pre-wrap">${escapeHtml(
        enquiry.message,
      )}</div>
    </div>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: `fanbased site <${from}>`,
      to: [to],
      // So hitting reply in the inbox goes back to the person who enquired.
      reply_to: enquiry.email,
      subject: `Access request: ${enquiry.subject}`,
      html,
    }),
  });

  if (!response.ok) {
    throw new Error(`Resend ${response.status}: ${(await response.text()).slice(0, 300)}`);
  }
}
