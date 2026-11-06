import { getSite } from '@/content/getSite';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';
import { Services } from '@/components/Services/Services';
import { Steps } from '@/components/Steps/Steps';

export default async function Home() {
  const site = await getSite();
  return (
    <>
      <Nav site={site} />
      <main>
        <Hero site={site} />
        <Services site={site} />
        <Steps site={site} />
      </main>
    </>
  );
}
