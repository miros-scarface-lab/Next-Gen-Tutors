import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import HowItWorks from '@/components/HowItWorks';
import Testimonials from '@/components/Testimonials';
import Stats from '@/components/Stats';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import Directory from '@/components/Directory';
import AdminPanel from '@/components/AdminPanel';
import QuickInfoWidget from '@/components/QuickInfoWidget';
import { useCmsData } from '@/hooks/useCmsData';

function App() {
  const { data } = useCmsData();
  if (window.location.pathname === '/admin') return <AdminPanel />;
  const settings = data.settings;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero
          title={settings?.hero_title}
          description={settings?.hero_description}
          badgeText={settings?.hero_badge_text}
          imageUrl={settings?.hero_image_url}
        />
        <Features title={settings?.features_title} subtitle={settings?.features_subtitle} />
        <HowItWorks title={settings?.how_it_works_title} subtitle={settings?.how_it_works_subtitle} />
        <Directory
          tutors={data.tutors}
          title={settings?.directory_title}
          subtitle={settings?.directory_subtitle}
        />
        <Testimonials
          items={data.testimonials}
          title={settings?.testimonials_title}
          subtitle={settings?.testimonials_subtitle}
        />
        <Stats />
        <CTA
          title={settings?.cta_title}
          description={settings?.cta_description}
          badgeText={settings?.cta_badge_text}
        />
      </main>
      <Footer
        brandName={settings?.brand_name}
        description={settings?.footer_description}
        email={settings?.contact_email}
        phone={settings?.contact_phone}
        location={settings?.location}
      />
      <QuickInfoWidget />
    </div>
  );
}

export default App;
