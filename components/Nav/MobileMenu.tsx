'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
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

export function MobileMenu({ links, cta, openLabel, closeLabel, navLabel }: Props) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const close = useCallback((returnFocus: boolean) => {
    setOpen(false);
    if (returnFocus) buttonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close(true);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, close]);

  return (
    <div className={styles.mobile}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.toggle}
        aria-label={open ? closeLabel : openLabel}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
      </button>
      <nav id={panelId} aria-label={navLabel} className={styles.panel} hidden={!open}>
        <ul className={styles.panelList}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.panelLink} onClick={() => close(false)}>
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <ButtonLink href={cta.href} className={styles.panelCta} onClick={() => close(false)}>
              {cta.label}
            </ButtonLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}
