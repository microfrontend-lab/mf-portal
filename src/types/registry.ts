import { z } from 'zod';
import type { WidgetDescriptor } from './widget';

const widgetDescriptorSchema = z.object({
  name: z.string(),
  url: z.string().url(),
  module: z.string(),
  route: z.string(),
  title: z.string(),
  icon: z.string().optional(),
  enabled: z.boolean(),
}) satisfies z.ZodType<WidgetDescriptor>;

const registryEnvelopeSchema = z.object({
  version: z.number(),
  widgets: z.array(z.unknown()),
});

/**
 * Validates the fetched registry payload. A malformed envelope yields an
 * empty list; a malformed individual entry is skipped with a console
 * warning — the registry must never crash the portal (ARCHITECTURE §5.1).
 */
export function parseRegistry(json: unknown): WidgetDescriptor[] {
  const envelope = registryEnvelopeSchema.safeParse(json);
  if (!envelope.success) {
    console.warn('[mf-portal] registry.json failed validation', envelope.error.issues);
    return [];
  }

  const widgets: WidgetDescriptor[] = [];
  for (const raw of envelope.data.widgets) {
    const result = widgetDescriptorSchema.safeParse(raw);
    if (result.success) {
      widgets.push(result.data);
    } else {
      console.warn('[mf-portal] skipping invalid widget entry in registry.json', raw, result.error.issues);
    }
  }
  return widgets.filter((w) => w.enabled);
}
