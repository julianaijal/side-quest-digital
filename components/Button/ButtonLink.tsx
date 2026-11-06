import type { ReactNode } from 'react';
import styles from './Button.module.scss';

type Props = {
  href: string;
  children: ReactNode;
  variant?: 'primary' | 'secondary';
  size?: 'default' | 'small';
  className?: string;
};

/** Call to action styled as a button. Always an anchor. */
export function ButtonLink({ href, children, variant = 'primary', size = 'default', className }: Props) {
  const classes = [styles.button, styles[variant], size === 'small' && styles.small, className]
    .filter(Boolean)
    .join(' ');
  return (
    <a href={href} className={classes}>
      {children}
    </a>
  );
}
