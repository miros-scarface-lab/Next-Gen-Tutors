const SUPABASE_URL = 'https://htenehyaznqyhibqoqlc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW5laHlhem5xeWhpYnFvcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDUyMTgsImV4cCI6MjEwNjY4MTIxOH0.DtqS5OI0Bhbza7CCbXMnsCZU2wjxPrPprJAfDlLr10s';

async function updateSettings() {
  console.log('Logging in as admin...');
  const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({
      email: 'admins@nextgentutors.com',
      password: '12340987',
    }),
  });
  const loginData = await loginRes.json();
  if (!loginData.access_token) {
    console.error('Failed to log in:', loginData);
    return;
  }
  const token = loginData.access_token;

  console.log('Fetching current site_settings...');
  const getRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
    },
  });
  const rows = await getRes.json();
  const current = rows[0] || {};

  const updatedCustomTexts = { ...current.custom_texts };
  for (const [key, val] of Object.entries(updatedCustomTexts)) {
    if (Array.isArray(val)) {
      updatedCustomTexts[key] = val.map(item => {
        if (typeof item === 'object' && item !== null) {
          const newItem = { ...item };
          if (typeof newItem.title === 'string') {
            newItem.title = newItem.title.replace(/Next\s*Gen\s*Tutors?/gi, 'Mentorio Pirojpur');
          }
          if (typeof newItem.description === 'string') {
            newItem.description = newItem.description.replace(/Next\s*Gen\s*Tutors?/gi, 'Mentorio Pirojpur');
          }
          return newItem;
        }
        return item;
      });
    }
  }

  const patchBody = {
    brand_name: 'Mentorio Pirojpur',
    directory_subtitle: (current.directory_subtitle || '').replace(/Next\s*Gen\s*Tutors?/gi, 'Mentorio Pirojpur'),
    custom_texts: updatedCustomTexts,
    updated_at: new Date().toISOString(),
  };

  console.log('Updating site_settings...', patchBody);
  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?singleton=eq.true`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(patchBody),
  });

  if (!patchRes.ok) {
    console.error('Update failed:', patchRes.status, await patchRes.text());
  } else {
    console.log('Update success!', await patchRes.json());
  }
}

updateSettings().catch(console.error);
