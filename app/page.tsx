import { getSite } from '@/content/getSite';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { Services } from '@/components/Services/Services';
import { About } from '@/components/About/About';
import { Contact } from '@/components/Contact/Contact';
import { Footer } from '@/components/Footer/Footer';

export default async function Home() {
  const site = await getSite();
  return (
    <>
      <Nav site={site} />
      <main id="main">
        <Hero site={site} />
        <Services site={site} />
        <About site={site} />
        <Contact site={site} />
      </main>
      <Footer site={site} />
    </>
  );
}
