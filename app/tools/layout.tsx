import { getSite } from '@/content/getSite';
import { PageHeader } from '@/components/PageHeader/PageHeader';
import { Footer } from '@/components/Footer/Footer';
import styles from './layout.module.scss';

export default async function ToolsLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite();
  return (
    <>
      <PageHeader site={site} label={site.tools.backLabel} />
      <main id="main" className={styles.container}>
        {children}
      </main>
      <Footer site={site} />
    </>
  );
}
