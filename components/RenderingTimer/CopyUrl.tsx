'use client';

import { useEffect, useRef, useState } from 'react';
import { CheckIcon, CopyIcon } from '@/components/Icons/Icons';
import styles from './CopyUrl.module.scss';

interface Props {
  url: string;
  label: string;
  copiedLabel: string;
}

const RESET_MS = 2000;

export function CopyUrl({ url, label, copiedLabel }: Props) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), RESET_MS);
  }

  return (
    <div className={styles.copyUrl}>
      <code className={styles.url}>{url}</code>
      <button type="button" className={styles.button} onClick={copy}>
        {copied ? <CheckIcon className={styles.icon} /> : <CopyIcon className={styles.icon} />}
        <span aria-live="polite">{copied ? copiedLabel : label}</span>
      </button>
    </div>
  );
}
