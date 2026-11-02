// Shared helpers for the Pages Functions that write to the Airtable CRM.
// Not a route: it exports no onRequest handlers.
// Env vars (Cloudflare Pages > Settings > Variables and Secrets):
//   AIRTABLE_TOKEN   (secret) Personal Access Token with data.records:write on the base
//   AIRTABLE_BASE_ID e.g. appXXXXXXXXXXXXXX

const ALLOWED_HOSTS = ['kothar.co.il', 'www.kothar.co.il', 'baimbetov.me', 'www.baimbetov.me', 'localhost', '127.0.0.1'];

export const json = (body, status = 200) =>
    new Response(JSON.stringify(body), {
        status,
        headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
    });

export const clean = (value, max) => String(value ?? '').replace(/[\u0000-\u0009\u000b-\u001f]/g, ' ').trim().slice(0, max);

export function isAllowedOrigin(request) {
    const origin = request.headers.get('Origin');
    if (!origin) return true;
    try {
        const host = new URL(origin).hostname;
        return ALLOWED_HOSTS.includes(host) || host.endsWith('.pages.dev');
    } catch {
        return false;
    }
}

export async function readJson(request) {
    try {
        return await request.json();
    } catch {
        return null;
    }
}

// Creates one record. Returns true on success; logs and returns false otherwise.
export async function createRecord(env, table, fields) {
    if (!env.AIRTABLE_TOKEN || !env.AIRTABLE_BASE_ID) {
        console.error('airtable: missing AIRTABLE_TOKEN or AIRTABLE_BASE_ID');
        return false;
    }
    const res = await fetch(`https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(table)}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${env.AIRTABLE_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ records: [{ fields }], typecast: true })
    });
    if (!res.ok) {
        console.error('airtable: error', res.status, await res.text());
        return false;
    }
    return true;
}
