const SUPABASE_URL = 'https://htenehyaznqyhibqoqlc.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh0ZW5laHlhem5xeWhpYnFvcWxjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTExMDUyMTgsImV4cCI6MjEwNjY4MTIxOH0.DtqS5OI0Bhbza7CCbXMnsCZU2wjxPrPprJAfDlLr10s';

async function syncCleanSettings() {
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

  const cleanSettings = {
    singleton: true,
    brand_name: 'Mentorio Pirojpur',
    hero_title: 'আপনার সন্তানের জন্য সেরা ও অভিজ্ঞ টিউটর খুঁজুন',
    hero_description: 'পিরোজপুর বিজ্ঞান ও প্রযুক্তি বিশ্ববিদ্যালয়ের (PrSTU) অভিজ্ঞ ও বিশ্বস্ত টিউটরদের সাথে সরাসরি যোগাযোগ করুন। কোনো মধ্যস্বত্বভোগী বা কমিশন ছাড়াই।',
    hero_badge_text: '১০০% কমিশন-মুক্ত প্ল্যাটফর্ম',
    hero_image_url: '/hero-image.png',
    features_title: 'আমাদের প্ল্যাটফর্মের বিশেষ সুবিধাসমূহ',
    features_subtitle: 'অভিভাবক ও শিক্ষকদের মধ্যে সরাসরি যোগাযোগের সুবিধাজনক সিস্টেম।',
    how_it_works_title: 'কীভাবে আপনার টিউটর খুঁজে পাবেন',
    how_it_works_subtitle: 'মাত্র ৪টি সহজ ধাপ অনুসরণ করে যুক্ত হন আপনার পছন্দের টিউটরের সাথে।',
    directory_title: 'আমাদের যাচাইকৃত সেরা টিউটরবৃন্দ',
    directory_subtitle: 'Mentorio Pirojpur-এর সেরা ও অভিজ্ঞ টিউটরদের সাথে সরাসরি যোগাযোগ করুন।',
    testimonials_title: 'অভিভাবক ও শিক্ষকদের অনুভূতি',
    testimonials_subtitle: 'আমাদের ব্যবহারকারী সম্মানিত অভিভাবক ও টিউটরদের বাস্তব অভিজ্ঞতা।',
    cta_title: 'কয়েক মিনিটেই আপনার পছন্দের টিউটর খুঁজে নিন',
    cta_description: 'সরাসরি টিউটরের সাথে কথা বলুন — দ্রুত, সহজ এবং ১০০% কমিশন মুক্ত। Mentorio Pirojpur-এর সাথেই যুক্ত থাকুন।',
    cta_badge_text: 'ওয়েব ও মোবাইলে সহজলভ্য',
    contact_email: 'nextgentutors247@gmail.com',
    contact_phone: '01318126412',
    location: 'Pirojpur, Barishal, Bangladesh',
    footer_description: 'অভিজ্ঞ ও দক্ষ টিউটরদের সাথে সরাসরি যোগাযোগ করে পড়াশোনায় সেরা সাফল্য অর্জন করুন। কোনো মিডিয়া ফি ছাড়াই শতভাগ বিশ্বস্ত সেবা।',
    updated_at: new Date().toISOString(),
  };

  console.log('Syncing clean settings to Supabase...');
  const patchRes = await fetch(`${SUPABASE_URL}/rest/v1/site_settings?singleton=eq.true`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${token}`,
      'Prefer': 'return=representation',
    },
    body: JSON.stringify(cleanSettings),
  });

  if (!patchRes.ok) {
    console.error('Update failed:', patchRes.status, await patchRes.text());
  } else {
    console.log('Update success! Clean settings synced.');
  }
}

syncCleanSettings().catch(console.error);
