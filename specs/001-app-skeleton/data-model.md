# Data Model: App Skeleton

**Feature**: `001-app-skeleton`
**Date**: 2026-04-05

## Overview

The app skeleton has no persistence layer. All state is in-memory within the
`ShellComponent` lifetime. The data model covers the navigation configuration
and the reactive state signals that drive the shell UI.

---

## Entities

### `NavSection`

Represents a top-level section in the navigation shell.

```ts
interface NavSection {
  /** Unique identifier, matches the route path segment */
  id: 'home' | 'shopping' | 'tasks';
  /** Display label shown in nav drawer and bottom bar */
  label: string;
  /** Material icon name (from Material Symbols) */
  icon: string;
  /** Absolute router path */
  route: string;
}
```

**Confirmed instances** (from spec clarification):

```ts
const NAV_SECTIONS: NavSection[] = [
  { id: 'home',     label: 'Home',     icon: 'home',          route: '/home'     },
  { id: 'shopping', label: 'Shopping', icon: 'shopping_cart', route: '/shopping' },
  { id: 'tasks',    label: 'Tasks',    icon: 'check_circle',  route: '/tasks'    },
];
```

**Constraints**:
- `id` is a closed union — no arbitrary strings
- `route` must match a registered Angular route path
- `icon` must be a valid Material Symbols icon name
- The list is static for the skeleton; it will be driven by configuration
  in a future iteration as real features are added

---

### `NavigationState`

The reactive state of the shell navigation. Owned by `ShellComponent` as signals.

```ts
interface NavigationState {
  /** The currently active section, derived from router URL */
  activeSection: Signal<NavSection | undefined>;
  /** Whether the navigation drawer is open */
  isDrawerOpen: Signal<boolean>;
  /** Whether the viewport is ≥ 1024px wide */
  isLargeScreen: Signal<boolean>;
  /** Whether the user has scrolled down (hides toolbar on mobile) */
  isScrolledDown: Signal<boolean>;
}
```

**State transitions**:

| State | Trigger | New Value |
|-------|---------|-----------|
| `isDrawerOpen` | Menu button tap | `true` |
| `isDrawerOpen` | Section tap / backdrop tap / Escape key | `false` |
| `isDrawerOpen` | Viewport becomes ≥ 1024px | `false` (drawer not used on desktop) |
| `activeSection` | Router navigation event | Matching `NavSection` for new URL |
| `isLargeScreen` | Viewport crosses 1024px threshold | `true` / `false` |
| `isScrolledDown` | User scrolls down > 64px | `true` |
| `isScrolledDown` | User scrolls up | `false` |

---

## Component Inputs / Outputs

### `ShellComponent`

No inputs or outputs. Root layout component; communicates only via Angular Router
and internal signals.

---

## Route Structure

```
AppRoutes:
  '' (ShellComponent — layout wrapper)
  ├── ''          → redirect to 'home'
  ├── 'home'      → HomeComponent (lazy)
  ├── 'shopping'  → ShoppingComponent (lazy)
  └── 'tasks'     → TasksComponent (lazy)
```

Each placeholder component receives no inputs and renders a simple "Coming soon"
card. They have no outputs or service dependencies.
