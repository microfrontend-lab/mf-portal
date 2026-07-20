import { Puzzle } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import * as icons from 'lucide-react';

function toPascalCase(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('');
}

/** Resolves a registry `icon` name (kebab-case, per ARCHITECTURE §5.1) to a lucide-react component. */
export function resolveIcon(name: string | undefined): LucideIcon {
  if (!name) return Puzzle;
  const pascalName = toPascalCase(name);
  const candidate = (icons as unknown as Record<string, unknown>)[pascalName];
  return isLucideIcon(candidate) ? candidate : Puzzle;
}

function isLucideIcon(value: unknown): value is LucideIcon {
  return typeof value === 'function' || typeof value === 'object';
}
