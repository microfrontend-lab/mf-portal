import styles from './WidgetSkeleton.module.css';

export function WidgetSkeleton() {
  return (
    <div className={styles.skeleton} role="status" aria-label="Loading widget">
      <div className={styles.bar} />
      <div className={styles.bar} />
      <div className={styles.bar} />
    </div>
  );
}
