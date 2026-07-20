import clsx from 'clsx';
import type { HTMLAttributes } from 'react';
import styles from './Text.module.css';

export interface TextProps extends HTMLAttributes<HTMLSpanElement> {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  muted?: boolean;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3';
}

export function Text({ size = 'md', muted = false, as: Tag = 'span', className, ...rest }: TextProps) {
  return <Tag className={clsx(styles.text, styles[size], muted && styles.muted, className)} {...rest} />;
}
