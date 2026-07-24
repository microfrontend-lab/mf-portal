import { Link } from 'react-router';
import { Card, Stack, Text } from '@/components/ui';
import { resolveIcon } from '@/utils/icon';
import type { WidgetDescriptor } from '@/types/widget';
import type { RegistryStatus } from '@/hooks/useRegistry';
import styles from './HomePage.module.css';

export interface HomePageProps {
  widgets: WidgetDescriptor[];
  status: RegistryStatus;
  error: string | null;
}

export function HomePage({ widgets, status, error }: HomePageProps) {
  return (
    <Stack gap={6} className={styles.page}>
      <Stack gap={1}>
        <Text muted>
          This demo showcases Module Federation — an architectural pattern for decomposing a
          frontend into independently built, independently deployed applications, similar to
          microservices on the server side. Apps are composed together at runtime, not bundled
          together at build time, so a team can ship its app without the portal ever being
          rebuilt.
        </Text>
        <Text muted>You can switch between the different applications via the top panel.</Text>
        <Text muted>All apps share the same theme!</Text>
      </Stack>

      {status === 'loading' && <Text muted>Loading registry…</Text>}

      {status === 'error' && (
        <Card>
          <Text as="h2" size="lg">
            Could not load the registry
          </Text>
          <Text muted>{error}</Text>
        </Card>
      )}

      {status === 'success' && widgets.length === 0 && (
        <Card>
          <Text muted>No applications are currently registered.</Text>
        </Card>
      )}

      {status === 'success' && widgets.length > 0 && (
        <div className={styles.grid}>
          {widgets.map((widget) => {
            const Icon = resolveIcon(widget.icon);
            return (
              <Link key={widget.name} to={widget.route} className={styles.cardLink}>
                <Card className={styles.card}>
                  <Icon size={28} aria-hidden="true" />
                  <Text as="h2" size="lg">
                    {widget.title}
                  </Text>
                  <Text muted size="sm">
                    {widget.route}
                  </Text>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </Stack>
  );
}
