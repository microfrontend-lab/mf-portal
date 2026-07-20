import { describe, expect, it, vi } from 'vitest';
import { parseRegistry } from './registry';

describe('parseRegistry', () => {
  it('returns enabled, well-formed widgets', () => {
    const widgets = parseRegistry({
      version: 1,
      widgets: [
        {
          name: 'todoApp',
          url: 'https://storage.googleapis.com/mf-todo-app/remoteEntry.js',
          module: './TodoWidget',
          route: '/apps/todo',
          title: 'Todo',
          icon: 'check-square',
          enabled: true,
        },
      ],
    });
    expect(widgets).toHaveLength(1);
    expect(widgets[0]?.name).toBe('todoApp');
  });

  it('drops disabled widgets', () => {
    const widgets = parseRegistry({
      version: 1,
      widgets: [
        {
          name: 'todoApp',
          url: 'https://storage.googleapis.com/mf-todo-app/remoteEntry.js',
          module: './TodoWidget',
          route: '/apps/todo',
          title: 'Todo',
          enabled: false,
        },
      ],
    });
    expect(widgets).toHaveLength(0);
  });

  it('skips a malformed entry with a warning, without crashing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const widgets = parseRegistry({
      version: 1,
      widgets: [
        { name: 'brokenApp', url: 'not-a-url', module: './X', route: '/apps/x', title: 'X', enabled: true },
        {
          name: 'chartApp',
          url: 'https://storage.googleapis.com/mf-chart-app/remoteEntry.js',
          module: './ChartWidget',
          route: '/apps/chart',
          title: 'Charts',
          enabled: true,
        },
      ],
    });

    expect(widgets).toHaveLength(1);
    expect(widgets[0]?.name).toBe('chartApp');
    expect(warnSpy).toHaveBeenCalled();

    warnSpy.mockRestore();
  });

  it('returns an empty list for a malformed envelope, without crashing', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    expect(parseRegistry(null)).toEqual([]);
    expect(parseRegistry({ widgets: 'not-an-array' })).toEqual([]);

    warnSpy.mockRestore();
  });
});
