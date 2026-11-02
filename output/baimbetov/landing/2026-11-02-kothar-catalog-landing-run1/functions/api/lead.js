// Cloudflare Pages Function: POST /api/lead
// Saves a lead from the contact form to the "לידים" table. An Airtable automation emails the team.
// Optional env var: AIRTABLE_TABLE (table name or id). Default: "לידים"

import { json, clean, isAllowedOrigin, readJson, createRecord } from '../_lib/airtable.js';

const PROJECT_TYPES = ['פרגולה', 'דק', 'מבנה עץ', 'אחר'];

export async function onRequestPost({ request, env }) {
    if (!isAllowedOrigin(request)) return json({ ok: false }, 403);

    const data = await readJson(request);
    if (!data) return json({ ok: false, error: 'bad_json' }, 400);

    // Honeypot: real visitors never fill this hidden field. Pretend success for bots.
    if (clean(data.company, 200)) return json({ ok: true });

    const name = clean(data.name, 100);
    const phone = clean(data.phone, 30);
    const projectType = clean(data.projectType, 30);
    const city = clean(data.city, 80);
    if (!name || !/^[+\d][\d\s\-()]{7,20}$/.test(phone) || !PROJECT_TYPES.includes(projectType) || !city) {
        return json({ ok: false, error: 'invalid' }, 400);
    }

    const saved = await createRecord(env, env.AIRTABLE_TABLE || 'לידים', {
        'שם': name,
        'טלפון': phone,
        'סוג פרויקט': projectType,
        'עיר': city,
        'תיאור הפרויקט': clean(data.details, 2000),
        'מקור': 'אתר',
        'סטטוס': 'חדש',
        'UTM': clean(data.utm, 500),
        'דף מקור': clean(data.page, 300)
    });
    return saved ? json({ ok: true }) : json({ ok: false, error: 'upstream' }, 502);
}
