import { Link } from 'react-router';
import { Stack, Text } from '@/components/ui';
import styles from './NotFoundPage.module.css';

export function NotFoundPage() {
  return (
    <Stack gap={3} className={styles.page}>
      <Text as="h1" size="xl">
        Page not found
      </Text>
      <Link to="/" className={styles.link}>
        Back to home
      </Link>
    </Stack>
  );
}
