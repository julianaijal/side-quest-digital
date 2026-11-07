'use client';

import { useEffect, useState } from 'react';
import { CONSENT_KEY } from '@/lib/analytics';
import styles from './CookieConsent.module.scss';

type Choice = 'granted' | 'denied';

type Props = {
  label: string;
  text: string;
  acceptLabel: string;
  declineLabel: string;
  settingsLabel: string;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function readChoice(): Choice | null {
  try {
    const value = localStorage.getItem(CONSENT_KEY);
    return value === 'granted' || value === 'denied' ? value : null;
  } catch {
    return null;
  }
}

/** Removes Google Analytics cookies that an earlier "allow" left behind. */
function clearAnalyticsCookies() {
  const host = location.hostname;
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.split('=')[0].trim();
    if (!name.startsWith('_ga')) continue;
    for (const domain of [host, `.${host}`, `.${host.split('.').slice(-2).join('.')}`]) {
      document.cookie = `${name}=; max-age=0; path=/; domain=${domain}`;
    }
    document.cookie = `${name}=; max-age=0; path=/`;
  }
}

/**
 * Cookie banner plus the footer button that reopens it. Renders nothing in the
 * banner slot on the server; it opens after mount when no choice is stored.
 */
export function CookieConsent({ label, text, acceptLabel, declineLabel, settingsLabel }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage is only readable after mount
    if (readChoice() === null) setOpen(true);
  }, []);

  function choose(choice: Choice) {
    try {
      localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Storage blocked: the choice holds for this page view only.
    }
    window.gtag?.('consent', 'update', { analytics_storage: choice });
    if (choice === 'denied') clearAnalyticsCookies();
    setOpen(false);
  }

  return (
    <>
      <button type="button" className={styles.settings} onClick={() => setOpen(true)}>
        {settingsLabel}
      </button>
      {open && (
        <section className={styles.banner} aria-label={label}>
          <div className={styles.inner}>
            <p className={styles.text}>{text}</p>
            <div className={styles.actions}>
              <button type="button" className={`${styles.button} ${styles.decline}`} onClick={() => choose('denied')}>
                {declineLabel}
              </button>
              <button type="button" className={`${styles.button} ${styles.accept}`} onClick={() => choose('granted')}>
                {acceptLabel}
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
