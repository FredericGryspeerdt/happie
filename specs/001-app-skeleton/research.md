# Research: App Skeleton

**Feature**: `001-app-skeleton`
**Date**: 2026-04-05

## Angular Material Navigation Components

### Decision: App Bar → `MatToolbar`

- **Choice**: `MatToolbar` from `@angular/material/toolbar`
- **Rationale**: Standard Material top application bar. Supports row layout,
  icon buttons, and title text out of the box. No custom component needed.
- **Alternatives considered**: Custom `div`-based bar — rejected (Angular Material
  equivalent exists; constitution prohibits unnecessary custom components).

### Decision: Navigation Drawer → `MatSidenav`

- **Choice**: `MatSidenav` inside `MatSidenavContainer`
  from `@angular/material/sidenav`
- **Rationale**: Supports `mode="over"` (mobile overlay drawer) and `mode="side"`
  (desktop persistent sidebar) — exactly the two behaviours required. Material
  handles focus trapping and ARIA attributes automatically.
- **Configuration**:
  - Mobile (< 1024px): `mode="over"`, `opened` driven by `isDrawerOpen` signal
  - Desktop (≥ 1024px): `mode="side"`, permanently `opened`, no overlay backdrop
- **Alternatives considered**: Custom side panel — rejected (Angular Material
  equivalent exists).

### Decision: Bottom Navigation → `MatTabNavBar`

- **Choice**: `MatTabNavBar` + `MatTabLink` from `@angular/material/tabs`
- **Rationale**: Angular Material does **not** have a dedicated bottom navigation
  bar component (`mat-bottom-nav` does not exist). `MatTabNavBar` is the closest
  available component — it renders a horizontal row of navigation links with
  active-state indication, ink bar, and ripple effects. Positioned fixed at the
  bottom via CSS on mobile.
- **Limitation**: The ink bar (underline indicator) is at the top of the component
  by default. This is a known minor visual divergence from Material Design 3's
  Navigation Bar spec, which uses an indicator pill. Acceptable for v1.
- **Alternatives considered**:
  - Custom bottom nav with `MatIconButton` + Tailwind — would require justification
    per constitution (Principle V); rejected since `MatTabNavBar` covers the need.
  - `MatBottomSheet` — for contextual actions, not navigation; rejected.

## Breakpoint Detection

### Decision: `BreakpointObserver` → `toSignal()`

- **Choice**: Angular CDK `BreakpointObserver` with breakpoint string
  `'(min-width: 1024px)'`, converted to a signal via `toSignal()`
- **Rationale**: CDK provides a tested, injection-friendly abstraction over
  `window.matchMedia`. Piping to `toSignal()` gives a reactive `Signal<boolean>`
  compatible with Angular's signal-based change detection. Avoids duplicating the
  1024px breakpoint in both TypeScript and CSS by using CSS for layout and the
  signal for imperative behaviour (drawer mode, visibility).
- **Usage**:
  ```ts
  const breakpointObserver = inject(BreakpointObserver);
  const isLargeScreen = toSignal(
    breakpointObserver.observe('(min-width: 1024px)').pipe(
      map(result => result.matches)
    ),
    { initialValue: false }
  );
  ```
- **Alternatives considered**: Manual `window.matchMedia` listener — rejected
  (CDK abstraction is cleaner and injection-friendly). Pure CSS with no TS signal —
  rejected (drawer `mode` and `opened` inputs require imperative control).

## Scroll-Away Toolbar

### Decision: `ScrollDispatcher` + direction signal + CSS `transform`

- **Choice**: Angular CDK `ScrollDispatcher` to detect scroll events; a derived
  signal tracks scroll direction; CSS `transform: translateY(-100%)` hides the
  toolbar; `transition` provides the animation.
- **Rationale**: Angular Material `MatToolbar` has no built-in scroll-away
  behaviour. The CDK `ScrollDispatcher` is the recommended Angular abstraction
  for scroll event listening. A signal-based approach integrates cleanly with
  OnPush change detection.
- **Implementation sketch**:
  ```ts
  // In ShellComponent
  private lastScrollY = 0;
  readonly isScrolledDown = signal(false);

  constructor() {
    const scrollDispatcher = inject(ScrollDispatcher);
    const ngZone = inject(NgZone);

    scrollDispatcher.scrolled().pipe(takeUntilDestroyed()).subscribe(() => {
      ngZone.run(() => {
        const currentY = window.scrollY;
        this.isScrolledDown.set(currentY > this.lastScrollY && currentY > 64);
        this.lastScrollY = currentY;
      });
    });
  }
  ```
  Template host binding:
  ```ts
  // In AppBarComponent or ShellComponent host:
  host: { '[class.toolbar-hidden]': 'isScrolledDown()' }
  ```
  CSS:
  ```css
  .toolbar-hidden { transform: translateY(-100%); transition: transform 0.3s ease; }
  ```
- **Only applies on mobile** (< 1024px): on desktop the toolbar is always fixed.
- **Alternatives considered**: `IntersectionObserver` on a sentinel — more complex,
  no CDK integration. CSS `position: sticky` with negative scroll — cannot animate
  re-appearance reliably across browsers.

## Lazy Loading

### Decision: `loadComponent` per route

- **Choice**: Angular Router `loadComponent` pointing to each placeholder component
- **Rationale**: Simplest lazy-loading pattern in Angular 21. No separate route
  files needed for placeholder pages. Keeps `app.routes.ts` readable.
- **Route structure**:
  ```ts
  { path: '', component: ShellComponent, children: [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./features/home/home').then(m => m.HomeComponent) },
    { path: 'shopping', loadComponent: () => import('./features/shopping/shopping').then(m => m.ShoppingComponent) },
    { path: 'tasks', loadComponent: () => import('./features/tasks/tasks').then(m => m.TasksComponent) },
  ]}
  ```
- **Alternatives considered**: `loadChildren` with separate route files — overkill
  for placeholder components; can be adopted when features grow.

## Angular Material Setup

### Decision: `ng add @angular/material` + custom theme

- **Choice**: Use Angular Material schematic to install and configure
- **Theme**: Custom Material 3 theme defined in `styles.css` using
  `@use '@angular/material' as mat`
- **Animations**: `provideAnimationsAsync()` in `app.config.ts`
  (async animations for performance)
- **Typography**: Material default typography scale applied globally
- **Rationale**: Schematic handles peer dependency installation, theme scaffolding,
  and `index.html` updates (Roboto font, Material Icons).

## AXE Accessibility Testing

### Decision: `axe-core` in Vitest tests

- **Choice**: `axe-core` npm package with Angular testing utilities
- **Rationale**: SC-005 requires 100% of navigation elements to pass automated
  accessibility checks. `axe-core` is the industry-standard automated AXE engine.
  Running it in Vitest component tests provides fast, CI-integrated validation.
- **Usage pattern**:
  ```ts
  import axe from 'axe-core';
  // In test after component render:
  const results = await axe.run(fixture.nativeElement);
  expect(results.violations).toHaveLength(0);
  ```
