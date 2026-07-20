import { useEffect, useState } from 'react';
import { registryService } from '@/services/registry.service';
import type { WidgetDescriptor } from '@/types/widget';

export type RegistryStatus = 'loading' | 'error' | 'success';

export function useRegistry() {
  const [widgets, setWidgets] = useState<WidgetDescriptor[]>([]);
  const [status, setStatus] = useState<RegistryStatus>('loading');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    registryService
      .fetch()
      .then((fetched) => {
        if (cancelled) return;
        setWidgets(fetched);
        setStatus('success');
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : 'Failed to load registry');
        setStatus('error');
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { widgets, status, error };
}
