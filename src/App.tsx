import { useEffect, useState } from 'react';
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
import TutorsPage from '@/components/TutorsPage';
import TuitionRequestPage from '@/components/TuitionRequestPage';
import QuickInfoWidget from '@/components/QuickInfoWidget';
import { useCmsData } from '@/hooks/useCmsData';

function App() {
  const { data } = useCmsData();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
      window.scrollTo(0, 0);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  // Admin Dashboard has NO chat widget
  if (currentPath === '/admin') {
    return <AdminPanel />;
  }

  const settings = data.settings;

  const renderContent = () => {
    if (currentPath === '/tutors') {
      return (
        <TutorsPage
          tutors={data.tutors}
          brandName={settings?.brand_name}
          settings={settings}
        />
      );
    }

    if (currentPath === '/request-tuition') {
      return (
        <TuitionRequestPage
          settings={settings}
          brandName={settings?.brand_name}
        />
      );
    }

    // Default: Home page
    return (
      <>
        <Navbar settings={settings} />
        <main>
          <Hero
            settings={settings}
            title={settings?.hero_title}
            description={settings?.hero_description}
            badgeText={settings?.hero_badge_text}
            imageUrl={settings?.hero_image_url}
          />
          <Features settings={settings} title={settings?.features_title} subtitle={settings?.features_subtitle} />
          <HowItWorks settings={settings} title={settings?.how_it_works_title} subtitle={settings?.how_it_works_subtitle} />
          <Directory
            settings={settings}
            tutors={data.tutors}
            title={settings?.directory_title}
            subtitle={settings?.directory_subtitle}
          />
          <Testimonials
            settings={settings}
            items={data.testimonials}
            title={settings?.testimonials_title}
            subtitle={settings?.testimonials_subtitle}
          />
          <Stats settings={settings} />
          <CTA
            settings={settings}
            title={settings?.cta_title}
            description={settings?.cta_description}
            badgeText={settings?.cta_badge_text}
          />
        </main>
        <Footer
          settings={settings}
          brandName={settings?.brand_name}
          description={settings?.footer_description}
          email={settings?.contact_email}
          phone={settings?.contact_phone}
          location={settings?.location}
        />
      </>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 overflow-x-hidden">
      {renderContent()}
      {/* Quick Info Chat Widget - Available on EVERY page except /admin */}
      <QuickInfoWidget settings={data.settings} questions={data.quickQuestions} />
    </div>
  );
}

export default App;
