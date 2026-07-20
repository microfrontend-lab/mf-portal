import { parseRegistry } from '@/types/registry';
import type { WidgetDescriptor } from '@/types/widget';

const REGISTRY_URL = process.env.REGISTRY_URL || '/registry.json';

export const registryService = {
  fetch: async (): Promise<WidgetDescriptor[]> => {
    const response = await fetch(REGISTRY_URL, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`Registry fetch failed: ${response.status} ${response.statusText}`);
    }
    const json: unknown = await response.json();
    return parseRegistry(json);
  },
} as const;
