import type { Site } from '@/content/site';
import { ServiceCard } from './ServiceCard';
import styles from './Services.module.scss';

export function Services({ site }: { site: Site }) {
  const { services, snippets } = site;
  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <div className={styles.header}>
        <p className={styles.eyebrow}>{services.eyebrow}</p>
        <h2 id="services-title" className={styles.heading}>
          {services.title}
        </h2>
      </div>
      <div className={styles.bento}>
        {services.items.map((item) => (
          <ServiceCard key={item.id} item={item} snippets={snippets} />
        ))}
      </div>
    </section>
  );
}
