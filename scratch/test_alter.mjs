const SUPABASE_URL = 'https://htenehyaznqyhibqoqlc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW5laHlhem5xeWhpYnFvcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDUyMTgsImV4cCI6MjEwNjY4MTIxOH0.DtqS5OI0Bhbza7CCbXMnsCZU2wjxPrPprJAfDlLr10s';

async function main() {
  const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
    body: JSON.stringify({ email: 'admins@nextgentutors.com', password: '12340987' })
  });
  const loginData = await loginRes.json();
  const token = loginData.access_token;
  console.log('Login success:', !!token);

  // Try RPC exec_sql if available
  const rpcRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      query: `
        ALTER TABLE site_settings 
        ADD COLUMN IF NOT EXISTS whatsapp_number text DEFAULT '01318126412',
        ADD COLUMN IF NOT EXISTS quick_faqs jsonb DEFAULT '[]'::jsonb,
        ADD COLUMN IF NOT EXISTS stats_items jsonb DEFAULT '[]'::jsonb;
      `
    })
  });
  console.log('RPC exec_sql status:', rpcRes.status, await rpcRes.text());
}

main();
