'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { resolvePolicy, type ResolverResult } from './parse';
import styles from './CrawlPolicyResolver.module.scss';

interface Props {
  resolveLabel: string;
  userAgentLabel: string;
}

const AGENTS = ['Googlebot', 'Bingbot', 'GPTBot'] as const;

export function CrawlPolicyResolver({ resolveLabel, userAgentLabel }: Props) {
  const [robotsTxt, setRobotsTxt] = useState('');
  const [url, setUrl] = useState('/');
  const [metaRobots, setMetaRobots] = useState('');
  const [xRobotsTag, setXRobotsTag] = useState('');
  const [userAgent, setUserAgent] = useState('Googlebot');
  const [customAgent, setCustomAgent] = useState('');
  const [result, setResult] = useState<ResolverResult | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const resolve = useCallback(() => {
    const ua = userAgent === 'custom' ? customAgent : userAgent;
    if (!ua.trim()) {
      setResult(null);
      return;
    }
    setResult(
      resolvePolicy({
        robotsTxt,
        url: url || '/',
        metaRobots,
        xRobotsTag,
        userAgent: ua,
      }),
    );
  }, [robotsTxt, url, metaRobots, xRobotsTag, userAgent, customAgent]);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(resolve, 150);
    return () => clearTimeout(timerRef.current);
  }, [resolve]);

  return (
    <div className={styles.resolver}>
      <div className={styles.form}>
        <label className={styles.field}>
          <span className={styles.label}>robots.txt</span>
          <textarea
            className={styles.textarea}
            rows={6}
            value={robotsTxt}
            onChange={(e) => setRobotsTxt(e.target.value)}
            placeholder={'User-agent: *\nDisallow: /'}
            spellCheck={false}
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>URL path</span>
          <input
            type="text"
            className={styles.input}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="/page"
          />
        </label>

        <label className={styles.field}>
          <span className={styles.label}>Meta robots</span>
          <input
            type="text"
            className={styles.input}
            value={metaRobots}
            onChange={(e) => setMetaRobots(e.target.value)}
            placeholder="noindex, follow"
          />
          <span className={styles.help}>Comma separated directives</span>
        </label>

        <label className={styles.field}>
          <span className={styles.label}>X-Robots-Tag</span>
          <input
            type="text"
            className={styles.input}
            value={xRobotsTag}
            onChange={(e) => setXRobotsTag(e.target.value)}
            placeholder="noindex"
          />
          <span className={styles.help}>HTTP response header value</span>
        </label>

        <div className={styles.field}>
          <label htmlFor="resolver-ua" className={styles.label}>{userAgentLabel}</label>
          <div className={styles.agentRow}>
            <select
              id="resolver-ua"
              className={styles.select}
              value={AGENTS.includes(userAgent as typeof AGENTS[number]) ? userAgent : 'custom'}
              onChange={(e) => setUserAgent(e.target.value)}
            >
              {AGENTS.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
              <option value="custom">Custom</option>
            </select>
            {!AGENTS.includes(userAgent as typeof AGENTS[number]) && (
              <input
                type="text"
                className={styles.input}
                value={customAgent}
                onChange={(e) => setCustomAgent(e.target.value)}
                placeholder="MyBot"
              />
            )}
          </div>
        </div>
      </div>

      {result && (
        <div className={styles.results}>
          <h2 className={styles.verdict}>{resolveLabel}</h2>
          <dl className={styles.verdictList}>
            <div className={result.canCrawl ? styles.verdictYes : styles.verdictNo}>
              <dt>Can crawl</dt>
              <dd>{result.canCrawl ? 'Yes' : 'No'}</dd>
            </div>
            <div className={result.canIndex ? styles.verdictYes : styles.verdictNo}>
              <dt>Can index</dt>
              <dd>{result.canIndex ? 'Yes' : 'No'}</dd>
            </div>
            <div className={result.canFollow ? styles.verdictYes : styles.verdictNo}>
              <dt>Links followed</dt>
              <dd>{result.canFollow ? 'Yes' : 'No'}</dd>
            </div>
          </dl>

          {result.conflicts.length > 0 && (
            <ul className={styles.conflicts} aria-live="polite">
              {result.conflicts.map((c, i) => (
                <li key={i} className={styles.conflict}>{c}</li>
              ))}
            </ul>
          )}

          {result.directives.length > 0 && (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Source</th>
                  <th>Directive</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {result.directives.map((d, i) => (
                  <tr key={i}>
                    <td>{d.source}</td>
                    <td>{d.directive}</td>
                    <td>{d.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
