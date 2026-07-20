// api/subscribe.js — HydroWild email capture → Omnisend
// Runs as a Vercel serverless function so the Omnisend API key stays server-side
// (never exposed to the browser). The popup POSTs { email } here.
//
// Env var required (Vercel → Project → Settings → Environment Variables):
//   OMNISEND_API_KEY = <store API key from Omnisend → Store settings → Integrations & API>

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.OMNISEND_API_KEY;
  if (!apiKey) {
    console.error('[subscribe] OMNISEND_API_KEY is not set');
    return res.status(500).json({ error: 'Server not configured' });
  }

  // Vercel may hand us a parsed object or a raw string depending on content-type
  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  const email = String(body?.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  try {
    const omni = await fetch('https://api.omnisend.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
      },
      body: JSON.stringify({
        identifiers: [
          {
            type: 'email',
            id: email,
            channels: {
              email: { status: 'subscribed', statusDate: new Date().toISOString() },
            },
          },
        ],
        tags: ['popup-15off', 'source: website'],
      }),
    });

    // 201 = new contact, 200 = updated existing — both are success.
    if (omni.status === 200 || omni.status === 201) {
      return res.status(200).json({ ok: true });
    }

    // Some accounts return 4xx for an already-existing contact — treat as success.
    const text = await omni.text();
    if (omni.status === 409 || /already exist/i.test(text)) {
      return res.status(200).json({ ok: true, existing: true });
    }

    console.error('[subscribe] Omnisend error', omni.status, text);
    return res.status(502).json({ error: 'Upstream error' });
  } catch (err) {
    console.error('[subscribe] request failed', err);
    return res.status(502).json({ error: 'Upstream error' });
  }
}
