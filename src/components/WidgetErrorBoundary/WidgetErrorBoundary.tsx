import { Component } from 'react';
import type { ReactNode } from 'react';
import { Card } from '../ui/Card';
import { Text } from '../ui/Text';
import { Stack } from '../ui/Stack';
import styles from './WidgetErrorBoundary.module.css';

export interface WidgetErrorBoundaryProps {
  name: string;
  children: ReactNode;
}

interface WidgetErrorBoundaryState {
  error: Error | null;
}

/**
 * The one class component this app allows — React error boundaries require
 * one. A remote that's down, 404s, or throws on mount degrades to this card
 * instead of taking down the rest of the portal (ARCHITECTURE §5.2, §14.5).
 */
export class WidgetErrorBoundary extends Component<WidgetErrorBoundaryProps, WidgetErrorBoundaryState> {
  override state: WidgetErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): WidgetErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error): void {
    console.error(`[mf-portal] widget "${this.props.name}" failed to load or render`, error);
  }

  override render(): ReactNode {
    const { error } = this.state;
    if (error) {
      return (
        <Card className={styles.card}>
          <Stack gap={2}>
            <Text as="h2" size="lg">
              Unable to load &ldquo;{this.props.name}&rdquo;
            </Text>
            <Text muted>{error.message}</Text>
          </Stack>
        </Card>
      );
    }
    return this.props.children;
  }
}
