import clsx from 'clsx';
import type { CSSProperties, HTMLAttributes } from 'react';
import styles from './Stack.module.css';

export interface StackProps extends HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column';
  gap?: 1 | 2 | 3 | 4 | 6 | 8;
}

export function Stack({ direction = 'column', gap = 3, className, style, ...rest }: StackProps) {
  return (
    <div
      className={clsx(styles.stack, styles[direction], className)}
      style={{ '--stack-gap': `var(--space-${gap})`, ...style } as CSSProperties}
      {...rest}
    />
  );
}
