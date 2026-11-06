'use client';

import { useEffect, useState } from 'react';
import styles from './Contact.module.scss';

const TIME_ZONE = 'Europe/Amsterdam';
const UPDATE_MS = 30_000;

function format(date: Date) {
  return date.toLocaleTimeString('en-GB', { timeZone: TIME_ZONE, hour: '2-digit', minute: '2-digit' });
}

/**
 * Current time in Amsterdam. Renders empty on the server and fills in after
 * mount, so server and client markup always match.
 */
export function LocalTime() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    const tick = () => setNow(new Date());
    tick();
    const interval = setInterval(tick, UPDATE_MS);
    return () => clearInterval(interval);
  }, []);

  return (
    <time className={styles.time} dateTime={now?.toISOString()}>
      {now ? format(now) : ''}
    </time>
  );
}
