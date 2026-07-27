import { useEffect, useState } from 'react';
import { registryService } from '@/services/registry.service';
import { initFederation } from '@/federation/loadRemote';
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
        // Must run before the state update below: setting status to
        // 'success' is what unlocks the widget Routes in App.tsx, and a
        // matched route's lazy() initializer calls loadRemote() synchronously
        // during render — before a useEffect in App.tsx would ever get a
        // chance to run init(). On a deep-link reload the widget route can
        // match on the very first render after this resolves, so init() has
        // to already be done by then (ARCHITECTURE §5.2/§5.3).
        initFederation(fetched);
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
