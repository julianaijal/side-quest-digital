'use client';

import { useEffect, useState } from 'react';

type Props = {
  user: string;
  domain: string;
  /** id the copy button selects as a fallback. */
  id: string;
  className?: string;
  linkClassName?: string;
  nowrapClassName?: string;
};

/**
 * The server and visitors without JavaScript get "julian [@] domain" as text,
 * so bots that read the HTML find no address. After hydration it becomes a
 * real mailto link; script built links stop address harvesters in practice.
 */
export function EmailLink({ user, domain, id, className, linkClassName, nowrapClassName }: Props) {
  const [ready, setReady] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- the link must only exist in the browser
  useEffect(() => setReady(true), []);

  if (!ready) {
    return (
      <p id={id} className={className}>
        {user} [@] <span className={nowrapClassName}>{domain}</span>
      </p>
    );
  }

  return (
    <p id={id} className={className}>
      <a
        href={`mailto:${user}@${domain}`}
        className={linkClassName}
        data-track="email_click"
        data-track-location="contact"
      >
        {user}@<span className={nowrapClassName}>{domain}</span>
      </a>
    </p>
  );
}
