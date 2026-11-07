'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from '@/components/Icons/Icons';
import styles from './Contact.module.scss';

type Props = {
  /** The address in two parts, joined only on click so it is never in the HTML. */
  user: string;
  domain: string;
  /** id of the element that shows the text, selected as a fallback. */
  targetId: string;
  label: string;
  copiedLabel: string;
};

const RESET_MS = 2000;

function selectTarget(id: string) {
  const element = document.getElementById(id);
  const selection = window.getSelection();
  if (!element || !selection) return;
  const range = document.createRange();
  range.selectNodeContents(element);
  selection.removeAllRanges();
  selection.addRange(range);
}

export function CopyButton({ user, domain, targetId, label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('Clipboard API unavailable');
      await navigator.clipboard.writeText(`${user}@${domain}`);
    } catch {
      selectTarget(targetId);
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  }

  return (
    <button type="button" className={styles.copy} onClick={copy} data-track="copy_email" data-track-location="contact">
      {copied ? <CheckIcon className={styles.copyIcon} /> : <CopyIcon className={styles.copyIcon} />}
      <span aria-live="polite">{copied ? copiedLabel : label}</span>
    </button>
  );
}
