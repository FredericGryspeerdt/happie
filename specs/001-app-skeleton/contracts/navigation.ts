/**
 * Navigation contracts for the Happie app skeleton.
 *
 * These interfaces define the public shape of navigation-related types.
 * They are documentation artifacts — the actual implementations live in src/.
 */

// ---------------------------------------------------------------------------
// Core types
// ---------------------------------------------------------------------------

/**
 * A top-level navigable section of the app.
 * The set is fixed for the skeleton (Home, Shopping, Tasks).
 */
export interface NavSection {
  /** Unique identifier matching the route path segment */
  id: 'home' | 'shopping' | 'tasks';
  /** Human-readable label displayed in the nav drawer and bottom bar */
  label: string;
  /** Material Symbols icon name */
  icon: string;
  /** Absolute Angular router path (e.g. '/home') */
  route: string;
}

// ---------------------------------------------------------------------------
// Shell component public surface
// ---------------------------------------------------------------------------

/**
 * The reactive navigation state exposed by ShellComponent.
 * All fields are read-only signals; mutations happen via the methods below.
 */
export interface ShellNavigationState {
  /** The NavSection matching the current router URL, or undefined before first navigation */
  readonly activeSection: NavSection | undefined;
  /** True when the navigation drawer is open */
  readonly isDrawerOpen: boolean;
  /** True when the viewport width is ≥ 1024px */
  readonly isLargeScreen: boolean;
  /** True when the user has scrolled down far enough to hide the toolbar (mobile only) */
  readonly isScrolledDown: boolean;
}

/**
 * Methods available on ShellComponent for controlling navigation state.
 */
export interface ShellNavigationActions {
  /** Open the navigation drawer */
  openDrawer(): void;
  /** Close the navigation drawer */
  closeDrawer(): void;
  /** Toggle the navigation drawer open/closed */
  toggleDrawer(): void;
}

// ---------------------------------------------------------------------------
// Route configuration contract
// ---------------------------------------------------------------------------

/**
 * The expected top-level route paths registered in app.routes.ts.
 * Consumers of NavSection.route should expect one of these values.
 */
export type AppRoutePath = '' | 'home' | 'shopping' | 'tasks';

// ---------------------------------------------------------------------------
// Static navigation configuration
// ---------------------------------------------------------------------------

/**
 * The three confirmed placeholder sections for the app skeleton.
 * Source of truth for navigation labels, icons, and routes.
 */
export const NAV_SECTIONS: readonly NavSection[] = [
  { id: 'home',     label: 'Home',     icon: 'home',          route: '/home'     },
  { id: 'shopping', label: 'Shopping', icon: 'shopping_cart', route: '/shopping' },
  { id: 'tasks',    label: 'Tasks',    icon: 'check_circle',  route: '/tasks'    },
] as const;
