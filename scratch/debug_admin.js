import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://htenehyaznqyhibqoqlc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW5laHlhem5xeWhpYnFvcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDUyMTgsImV4cCI6MjEwNjY4MTIxOH0.DtqS5OI0Bhbza7CCbXMnsCZU2wjxPrPprJAfDlLr10s';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAll() {
  console.log('1. Signing in with admins / 12340987...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admins@nextgentutors.com',
    password: '12340987',
  });

  if (authError) {
    console.error('CRITICAL AUTH ERROR:', authError);
    return;
  }
  console.log('Auth Successful! User UID:', authData.user.id);
  console.log('Session access_token present:', Boolean(authData.session.access_token));

  console.log('\n2. Testing RPC is_site_admin()...');
  const rpcRes = await supabase.rpc('is_site_admin');
  console.log('is_site_admin RPC:', rpcRes);

  console.log('\n3. Testing site_settings upsert...');
  const settingsRes = await supabase.from('site_settings').upsert({
    singleton: true,
    brand_name: 'Next Gen Tutors Test',
    hero_title: 'Test Title',
    hero_description: 'Test Desc',
    contact_email: 'hello@nextgentutors.com',
    contact_phone: '+880 1318126412',
    location: 'Dhaka',
    footer_description: 'Footer test',
    updated_at: new Date().toISOString(),
  }, { onConflict: 'singleton' });
  console.log('site_settings upsert:', settingsRes.error ? settingsRes.error : 'SUCCESS');

  console.log('\n4. Testing tutors insert...');
  const tutorRes = await supabase.from('tutors').insert({
    name: 'Debug Tutor',
    headline: 'Physics Specialist',
    subjects: ['Physics'],
    location: 'Dhaka',
    avatar_url: '',
    rating: 5,
    is_verified: true,
    is_featured: true,
  }).select();
  console.log('tutors insert:', tutorRes.error ? tutorRes.error : 'SUCCESS, ID: ' + tutorRes.data?.[0]?.id);

  if (tutorRes.data?.[0]?.id) {
    const id = tutorRes.data[0].id;
    console.log('\n5. Testing tutors update...');
    const updateRes = await supabase.from('tutors').update({ is_verified: false }).eq('id', id);
    console.log('tutors update:', updateRes.error ? updateRes.error : 'SUCCESS');

    console.log('\n6. Testing tutors delete...');
    const delRes = await supabase.from('tutors').delete().eq('id', id);
    console.log('tutors delete:', delRes.error ? delRes.error : 'SUCCESS');
  }
}

debugAll().catch(console.error);
