// Quick test: Can we log in as admin and perform CRUD?
const SUPABASE_URL = 'https://htenehyaznqyhibqoqlc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW5laHlhem5xeWhpYnFvcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDUyMTgsImV4cCI6MjEwNjY4MTIxOH0.DtqS5OI0Bhbza7CCbXMnsCZU2wjxPrPprJAfDlLr10s';

async function main() {
  console.log('=== STEP 1: Test Login ===');
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
  if (loginData.error || !loginData.access_token) {
    console.log('❌ LOGIN FAILED:', loginData.error_description || loginData.msg || JSON.stringify(loginData));
    console.log('   This means the admin user does NOT exist in Supabase auth.');
    console.log('   The migration files were NOT applied to the database.');
    return;
  }
  console.log('✅ LOGIN SUCCESS! User ID:', loginData.user?.id);
  const token = loginData.access_token;

  console.log('\n=== STEP 2: Check is_site_admin() ===');
  const adminCheckRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/is_site_admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!adminCheckRes.ok) {
    console.log('❌ is_site_admin() RPC FAILED:', adminCheckRes.status, await adminCheckRes.text());
  } else {
    const isAdmin = await adminCheckRes.json();
    console.log('   is_site_admin() returned:', isAdmin);
  }

  console.log('\n=== STEP 3: Check site_settings table columns ===');
  const settingsRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?select=*`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!settingsRes.ok) {
    console.log('❌ site_settings query FAILED:', settingsRes.status, await settingsRes.text());
  } else {
    const settings = await settingsRes.json();
    console.log('   site_settings rows:', settings.length);
    if (settings.length > 0) {
      console.log('   Columns present:', Object.keys(settings[0]).join(', '));
      const needed = ['hero_badge_text', 'hero_image_url', 'features_title', 'cta_title'];
      for (const col of needed) {
        console.log(`   ${col}: ${col in settings[0] ? '✅ exists' : '❌ MISSING'}`);
      }
    }
  }

  console.log('\n=== STEP 4: Check tutors table columns ===');
  const tutorsRes = await fetch(`${SUPABASE_URL}/rest/v1/tutors?select=*&limit=1`, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!tutorsRes.ok) {
    console.log('❌ tutors query FAILED:', tutorsRes.status, await tutorsRes.text());
  } else {
    const tutors = await tutorsRes.json();
    console.log('   tutors rows:', tutors.length);
    if (tutors.length > 0) {
      console.log('   Columns present:', Object.keys(tutors[0]).join(', '));
      const needed = ['department', 'student_level', 'whatsapp_number'];
      for (const col of needed) {
        console.log(`   ${col}: ${col in tutors[0] ? '✅ exists' : '❌ MISSING'}`);
      }
    }
  }

  console.log('\n=== STEP 5: Test UPSERT site_settings ===');
  const upsertRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'resolution=merge-duplicates',
    },
    body: JSON.stringify({
      singleton: true,
      brand_name: 'Next Gen Tutors',
      hero_title: 'Find Your Perfect Tutor Anytime, Anywhere',
    }),
  });
  if (!upsertRes.ok) {
    console.log('❌ UPSERT site_settings FAILED:', upsertRes.status, await upsertRes.text());
  } else {
    console.log('✅ UPSERT site_settings SUCCESS');
  }

  console.log('\n=== STEP 6: Test INSERT tutor ===');
  const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/tutors`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify({
      name: 'Test Tutor Delete Me',
      headline: 'Testing admin panel',
      bio: 'This is a test',
      subjects: ['Test'],
      location: 'Test City',
      avatar_url: '',
      rating: 5,
      is_verified: false,
      is_featured: false,
    }),
  });
  if (!insertRes.ok) {
    console.log('❌ INSERT tutor FAILED:', insertRes.status, await insertRes.text());
  } else {
    const inserted = await insertRes.json();
    console.log('✅ INSERT tutor SUCCESS, id:', inserted[0]?.id);
    
    // Clean up
    const delRes = await fetch(`${SUPABASE_URL}/rest/v1/tutors?id=eq.${inserted[0].id}`, {
      method: 'DELETE',
      headers: {
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${token}`,
      },
    });
    console.log('   Cleanup DELETE:', delRes.ok ? '✅' : '❌');
  }

  console.log('\n=== SUMMARY ===');
  console.log('If all steps show ✅, the admin panel SHOULD work.');
  console.log('If login failed, the admin user needs to be created in Supabase Dashboard.');
  console.log('If columns are ❌ MISSING, the migrations need to be applied.');
}

main().catch(console.error);
