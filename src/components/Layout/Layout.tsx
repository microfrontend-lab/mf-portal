import { Link } from 'react-router';
import type { ReactNode } from 'react';
import { Sun, Moon } from 'lucide-react';
import { resolveIcon } from '@/utils/icon';
import type { WidgetDescriptor } from '@/types/widget';
import type { Theme } from '@/hooks/useTheme';
import styles from './Layout.module.css';

export interface LayoutProps {
  widgets: WidgetDescriptor[];
  theme: Theme;
  onToggleTheme: () => void;
  children: ReactNode;
}

export function Layout({ widgets, theme, onToggleTheme, children }: LayoutProps) {
  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <Link to="/" className={styles.brand}>
          mf-portal
        </Link>
        <nav className={styles.nav}>
          <Link to="/" className={styles.navLink}>
            Home
          </Link>
          {widgets.map((widget) => {
            const Icon = resolveIcon(widget.icon);
            return (
              <Link key={widget.name} to={widget.route} className={styles.navLink}>
                <Icon size={18} aria-hidden="true" />
                <span>{widget.title}</span>
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
          <span>{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
        </button>
      </aside>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
