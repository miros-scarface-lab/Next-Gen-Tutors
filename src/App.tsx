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
import { useCmsData } from '@/hooks/useCmsData';

function App() {
  const { data } = useCmsData();
  if (window.location.pathname === '/admin') return <AdminPanel />;
  const settings = data.settings;

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <Navbar />
      <main>
        <Hero title={settings?.hero_title} description={settings?.hero_description} />
        <Features />
        <HowItWorks />
        <Directory tutors={data.tutors} tuitionPosts={data.tuitionPosts} />
        <Testimonials items={data.testimonials} />
        <Stats />
        <CTA />
      </main>
      <Footer
        brandName={settings?.brand_name}
        description={settings?.footer_description}
        email={settings?.contact_email}
        phone={settings?.contact_phone}
        location={settings?.location}
      />
    </div>
  );
}

export default App;
