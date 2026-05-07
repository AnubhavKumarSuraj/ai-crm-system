const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../../.env') });

const BUCKET = 'campaign-images';

const uploadToSupabase = async (fileBuffer, originalName, mimeType) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceKey) {
    console.warn('[Storage] SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set — skipping image upload.');
    return null;
  }

  const ext = path.extname(originalName) || '.jpg';
  const filePath = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

  const res = await fetch(`${supabaseUrl}/storage/v1/object/${BUCKET}/${filePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${serviceKey}`,
      'Content-Type': mimeType,
      'x-upsert': 'true',
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Supabase Storage upload failed: HTTP ${res.status}`);
  }

  return `${supabaseUrl}/storage/v1/object/public/${BUCKET}/${filePath}`;
};

module.exports = { uploadToSupabase };
