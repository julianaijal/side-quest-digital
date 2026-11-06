import type { Site } from '@/content/site';
import { ClockIcon, DiamondLarge, LinkedInIcon } from '@/components/Icons/Icons';
import { CopyButton } from './CopyButton';
import { LocalTime } from './LocalTime';
import styles from './Contact.module.scss';

const EMAIL_ID = 'contact-email';

export function Contact({ site }: { site: Site }) {
  const { contact } = site;
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.block}>
        <DiamondLarge className={styles.diamond} />
        <h2 id="contact-title" className={styles.heading}>
          {contact.title}
        </h2>
        <p className={styles.text}>{contact.text}</p>
        <div className={styles.email}>
          <a id={EMAIL_ID} href={`mailto:${site.email}`} className={styles.emailLink}>
            {site.email}
          </a>
          <CopyButton
            text={site.email}
            targetId={EMAIL_ID}
            label={contact.copyLabel}
            copiedLabel={contact.copiedLabel}
          />
        </div>
        <p className={styles.meta}>
          <ClockIcon className={styles.clock} />
          <span>
            {contact.timePrefix} <strong className={styles.strong}><LocalTime /></strong> {contact.timeSuffix}{' '}
            {site.replyTime}
          </span>
        </p>
        <a href={site.linkedin} className={styles.linkedin}>
          <LinkedInIcon />
          {contact.linkedinLabel}
        </a>
      </div>
    </section>
  );
}
