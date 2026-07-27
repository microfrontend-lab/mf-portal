import { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router';
import { Layout } from '@/components/Layout';
import { RemoteWidget } from '@/components/RemoteWidget';
import { WidgetErrorBoundary } from '@/components/WidgetErrorBoundary';
import { WidgetSkeleton } from '@/components/WidgetSkeleton';
import { HomePage } from '@/pages/HomePage';
import { NotFoundPage } from '@/pages/NotFoundPage';
import { useRegistry } from '@/hooks/useRegistry';
import { useTheme } from '@/hooks/useTheme';

export default function App() {
  const { widgets, status, error } = useRegistry();
  const { theme, toggleTheme } = useTheme();

  return (
    <BrowserRouter>
      <Layout widgets={widgets} theme={theme} onToggleTheme={toggleTheme}>
        <Routes>
          <Route path="/" element={<HomePage widgets={widgets} status={status} error={error} />} />
          {widgets.map((widget) => (
            <Route
              key={widget.name}
              path={`${widget.route}/*`}
              element={
                <WidgetErrorBoundary name={widget.name}>
                  <Suspense fallback={<WidgetSkeleton />}>
                    <RemoteWidget widget={widget} theme={theme} />
                  </Suspense>
                </WidgetErrorBoundary>
              }
            />
          ))}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
