import { getSite } from '@/content/getSite';
import { Nav } from '@/components/Nav/Nav';
import { Hero } from '@/components/Hero/Hero';

export default async function Home() {
  const site = await getSite();
  return (
    <>
      <Nav site={site} />
      <main>
        <Hero site={site} />
      </main>
    </>
  );
}
