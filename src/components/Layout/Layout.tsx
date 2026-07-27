import { NavLink } from 'react-router';
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

function navLinkClass({ isActive }: { isActive: boolean }) {
  return isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink;
}

export function Layout({ widgets, theme, onToggleTheme, children }: LayoutProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <NavLink to="/" className={styles.brand}>
          <img src={`${process.env.PUBLIC_PATH}logo.png`} alt="" className={styles.logo} />
          <span>Portal</span>
        </NavLink>
        <nav className={styles.nav}>
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          {widgets.map((widget) => {
            const Icon = resolveIcon(widget.icon);
            return (
              <NavLink key={widget.name} to={widget.route} className={navLinkClass}>
                <Icon size={16} aria-hidden="true" />
                <span>{widget.title}</span>
              </NavLink>
            );
          })}
        </nav>
        <button
          type="button"
          className={styles.themeToggle}
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
        </button>
      </header>
      <main className={styles.content}>{children}</main>
    </div>
  );
}
