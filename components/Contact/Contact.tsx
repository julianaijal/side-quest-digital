import type { Site } from '@/content/site';
import { ClockIcon, LinkedInIcon } from '@/components/Icons/Icons';
import { CopyButton } from './CopyButton';
import { EmailLink } from './EmailLink';
import { LocalTime } from './LocalTime';
import styles from './Contact.module.scss';

const EMAIL_ID = 'contact-email';

export function Contact({ site }: { site: Site }) {
  const { contact } = site;
  return (
    <section id="contact" className={styles.section} aria-labelledby="contact-title">
      <div className={styles.block}>
        <div className={styles.main}>
          <h2 id="contact-title" className={styles.heading}>
            {contact.title}
          </h2>
          <p className={styles.text}>{contact.text}</p>
          <div className={styles.email}>
            <EmailLink
              user={site.emailUser}
              domain={site.emailDomain}
              id={EMAIL_ID}
              className={styles.emailLink}
              linkClassName={styles.mailto}
              nowrapClassName={styles.nowrap}
            />
            <CopyButton
              user={site.emailUser}
              domain={site.emailDomain}
              targetId={EMAIL_ID}
              label={contact.copyLabel}
              copiedLabel={contact.copiedLabel}
            />
          </div>
        </div>
        <div className={styles.aside}>
          <p className={styles.meta}>
            <ClockIcon className={styles.clock} />
            <span>
              {contact.timePrefix} <strong className={styles.strong}><LocalTime /></strong> {contact.timeSuffix}
            </span>
          </p>
          <a href={site.linkedin} className={styles.linkedin} data-track="linkedin_click" data-track-location="contact">
            <LinkedInIcon className={styles.linkedinIcon} />
            {contact.linkedinLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
