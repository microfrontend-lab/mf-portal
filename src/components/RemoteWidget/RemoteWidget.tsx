import { lazy } from 'react';
import type { ComponentType, LazyExoticComponent } from 'react';
import { loadWidget } from '@/federation/loadRemote';
import type { WidgetDescriptor, WidgetProps } from '@/types/widget';

export interface RemoteWidgetProps {
  widget: WidgetDescriptor;
  theme?: WidgetProps['theme'];
}

// Cached by widget name so the lazy component identity is stable across
// renders — creating it inline (e.g. in useMemo) resets its Suspense state
// on every render, which is exactly what react-hooks/static-components
// flags.
const lazyComponents = new Map<string, LazyExoticComponent<ComponentType<WidgetProps>>>();

function getLazyWidget(widget: WidgetDescriptor): LazyExoticComponent<ComponentType<WidgetProps>> {
  const cached = lazyComponents.get(widget.name);
  if (cached) return cached;
  const Component = lazy(() => loadWidget(widget));
  lazyComponents.set(widget.name, Component);
  return Component;
}

// getLazyWidget memoizes by widget.name in a module-level cache (above);
// react-hooks/static-components can't see through that indirection and
// flags this as an unmemoized component created during render.
/* eslint-disable react-hooks/static-components */
export function RemoteWidget({ widget, theme }: RemoteWidgetProps) {
  const Component = getLazyWidget(widget);
  return <Component basename={widget.route} theme={theme} />;
}
/* eslint-enable react-hooks/static-components */
