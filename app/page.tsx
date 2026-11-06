import { getSite } from '@/content/getSite';
import { Nav } from '@/components/Nav/Nav';

export default async function Home() {
  const site = await getSite();
  return (
    <>
      <Nav site={site} />
      <main />
    </>
  );
}
