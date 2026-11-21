'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { crawlers } from './crawlers';
import {
  generateRobotsTxt,
  generateMetaTags,
  generateHttpHeaders,
  generateContentSignals,
  type PolicySettings,
} from './generate';
import styles from './AiCrawlerPolicy.module.scss';

interface Props {
  searchLabel: string;
  aiSearchLabel: string;
  aiTrainingLabel: string;
  copyLabel: string;
  copiedLabel: string;
}

const TABS = ['robots.txt', 'Meta tags', 'HTTP headers', 'Content Signals'] as const;
type Tab = (typeof TABS)[number];

const RESET_MS = 2000;

export function AiCrawlerPolicy({
  searchLabel,
  aiSearchLabel,
  aiTrainingLabel,
  copyLabel,
  copiedLabel,
}: Props) {
  const [settings, setSettings] = useState<PolicySettings>({
    search: true,
    aiInput: true,
    aiTrain: false,
  });
  const [activeTab, setActiveTab] = useState<Tab>('robots.txt');
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  const toggle = useCallback((key: keyof PolicySettings) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const activeIdx = TABS.indexOf(activeTab);

  const output = (() => {
    switch (activeTab) {
      case 'robots.txt':
        return generateRobotsTxt(settings, crawlers);
      case 'Meta tags':
        return generateMetaTags(settings);
      case 'HTTP headers':
        return generateHttpHeaders(settings);
      case 'Content Signals':
        return generateContentSignals(settings);
    }
  })();

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
    } catch {
      return;
    }
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), RESET_MS);
  }

  function handleTabKey(e: React.KeyboardEvent) {
    const idx = TABS.indexOf(activeTab);
    let next = idx;
    if (e.key === 'ArrowRight') next = (idx + 1) % TABS.length;
    else if (e.key === 'ArrowLeft') next = (idx - 1 + TABS.length) % TABS.length;
    else return;
    e.preventDefault();
    setActiveTab(TABS[next]);
    tabRefs.current[next]?.focus();
  }

  return (
    <div className={styles.generator}>
      <div className={styles.controls}>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={settings.search}
            onChange={() => toggle('search')}
          />
          <span>{searchLabel}</span>
        </label>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={settings.aiInput}
            onChange={() => toggle('aiInput')}
          />
          <span>{aiSearchLabel}</span>
        </label>
        <label className={styles.toggle}>
          <input
            type="checkbox"
            checked={settings.aiTrain}
            onChange={() => toggle('aiTrain')}
          />
          <span>{aiTrainingLabel}</span>
        </label>
      </div>

      <div className={styles.output}>
        <div className={styles.tabBar} role="tablist" onKeyDown={handleTabKey}>
          {TABS.map((tab, i) => (
            <button
              key={tab}
              ref={(el) => { tabRefs.current[i] = el; }}
              id={`policy-tab-${i}`}
              role="tab"
              type="button"
              aria-selected={activeTab === tab}
              aria-controls="policy-tabpanel"
              tabIndex={activeTab === tab ? 0 : -1}
              className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        <div
          id="policy-tabpanel"
          role="tabpanel"
          aria-labelledby={`policy-tab-${activeIdx}`}
          aria-live="polite"
          className={styles.panel}
        >
          <pre className={styles.code}>{output}</pre>
        </div>

        <button type="button" className={styles.copy} onClick={copy}>
          <span aria-live="polite">{copied ? copiedLabel : copyLabel}</span>
        </button>
      </div>
    </div>
  );
}
