import { init, loadRemote } from '@module-federation/enhanced/runtime';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactRouter from 'react-router';
import type { ComponentType } from 'react';
import type { WidgetDescriptor, WidgetProps } from '@/types/widget';

let initialized = false;

/**
 * The portal has no build-time ModuleFederationPlugin (ARCHITECTURE §5) —
 * remotes are only known once registry.json is fetched. `lib` registers the
 * portal's *own* already-loaded instances into the federation share scope,
 * with `eager: true`, so remotes negotiate against them instead of loading
 * their own copies. This is what keeps React a singleton across the
 * federation boundary (§6, §14.1) even without a build-time plugin.
 */
export function initFederation(widgets: WidgetDescriptor[]): void {
  if (initialized) return;
  init({
    name: 'mfPortal',
    remotes: widgets.map((w) => ({
      name: w.name,
      entry: w.url,
    })),
    shared: {
      react: {
        version: React.version,
        shareConfig: { singleton: true, requiredVersion: '^19.0.0', eager: true },
        lib: () => React,
      },
      'react-dom': {
        version: ReactDOM.version,
        shareConfig: { singleton: true, requiredVersion: '^19.0.0', eager: true },
        lib: () => ReactDOM,
      },
      'react-router': {
        version: '7.18.1',
        shareConfig: { singleton: true, requiredVersion: '^7.0.0', eager: true },
        lib: () => ReactRouter,
      },
    },
  });
  initialized = true;
}

export async function loadWidget(
  widget: WidgetDescriptor,
): Promise<{ default: ComponentType<WidgetProps> }> {
  const mod = await loadRemote<{ default: ComponentType<WidgetProps> }>(
    `${widget.name}${widget.module.replace('.', '')}`,
  );
  if (!mod) {
    throw new Error(`Remote module "${widget.module}" from "${widget.name}" failed to load`);
  }
  return mod;
}
