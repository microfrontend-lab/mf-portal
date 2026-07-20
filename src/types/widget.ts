// Copied from microfrontend-lab/mf-registry → contracts/widget.ts
// Do not edit here. Change the canonical copy first, then re-copy.

/** Props the portal passes into every embedded widget. */
export interface WidgetProps {
  basename?: string;
  user?: { id: string; name: string; email: string };
  theme?: 'light' | 'dark';
}

/** Shape of one entry in registry.json. */
export interface WidgetDescriptor {
  name: string;
  url: string;
  module: string;
  route: string;
  title: string;
  icon?: string;
  enabled: boolean;
}
