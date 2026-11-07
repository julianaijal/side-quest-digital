'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { ButtonLink } from '@/components/Button/ButtonLink';
import { CloseIcon, MenuIcon } from '@/components/Icons/Icons';
import styles from './Nav.module.scss';

type Link = { readonly label: string; readonly href: string };

type Props = {
  links: readonly Link[];
  cta: Link;
  openLabel: string;
  closeLabel: string;
  navLabel: string;
};

// The panel is a popover, so the menu opens, closes on Escape and on a tap
// outside, and returns focus to the button without JavaScript. Script only
// swaps the button label and closes the panel after a link is followed.
export function MobileMenu({ links, cta, openLabel, closeLabel, navLabel }: Props) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLElement>(null);
  const panelId = useId();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const onToggle = (event: Event) => setOpen((event as ToggleEvent).newState === 'open');
    panel.addEventListener('toggle', onToggle);
    return () => panel.removeEventListener('toggle', onToggle);
  }, []);

  const close = () => panelRef.current?.hidePopover();

  return (
    <div className={styles.mobile}>
      <button
        type="button"
        className={styles.toggle}
        aria-label={open ? closeLabel : openLabel}
        popoverTarget={panelId}
      >
        <MenuIcon className={styles.iconOpen} />
        <CloseIcon className={styles.iconClose} />
      </button>
      <nav ref={panelRef} id={panelId} aria-label={navLabel} className={styles.panel} popover="auto">
        <ul className={styles.panelList}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.panelLink} onClick={close}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <ButtonLink href={cta.href} className={styles.panelCta} onClick={close} track="cta_click" trackLocation="menu">
              {cta.label}
            </ButtonLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
