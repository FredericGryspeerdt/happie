# Implementation Plan: App Skeleton

**Branch**: `001-app-skeleton` | **Date**: 2026-04-05 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-app-skeleton/spec.md`

## Summary

Build the Happie app shell: a responsive Angular 21+ SPA using Angular Material for
navigation chrome. The shell delivers a Material toolbar (scroll-away on mobile),
a side-navigation drawer, and a bottom navigation bar on mobile — adapting to a
persistent sidebar at ≥ 1024px. Three lazy-loaded placeholder sections (Home,
Shopping, Tasks) populate the route structure. No backend or auth required.

## Technical Context

**Language/Version**: TypeScript 5.9+ / Angular 21.1+
**Primary Dependencies**: Angular Material (latest), Angular CDK (BreakpointObserver, ScrollDispatcher), Tailwind CSS 4, Angular Router
**Storage**: N/A — skeleton only, no persistence layer
**Testing**: Vitest 4+ with `@angular/core/testing`
**Target Platform**: Web browser — mobile-first responsive SPA
**Project Type**: web-app (Angular SPA)
**Performance Goals**: < 2s TTI on standard mobile connection (SC-002); lazy-loaded routes minimise initial bundle
**Constraints**: WCAG AA; 320px–1920px viewports; 44×44px minimum touch targets; mobile-first Tailwind prefixes; OnPush everywhere
**Scale/Scope**: 3 placeholder sections (Home, Shopping, Tasks)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Accessibility-First | ✅ PASS | FR-010 keyboard nav, FR-011 ARIA labels, SC-005 AXE; AXE test task included |
| II. Signal-Driven Reactivity | ✅ PASS | Active section + drawer state via signals; `BreakpointObserver` piped to `toSignal()` |
| III. Standalone & Minimal Components | ✅ PASS | All components standalone, OnPush, `inject()` |
| IV. Type Safety | ✅ PASS | `NavSection` interface typed; strict TS mode; no `any` |
| V. Simplicity & Restraint | ✅ PASS | Angular Material `MatSidenav`, `MatToolbar`, `MatTabNav` — no custom nav unless unavailable |
| VI. Test Discipline | ✅ PASS | Tests for navigation state, drawer behaviour, breakpoint adaptation, AXE |
| VII. Collaborative by Default | N/A | Skeleton — no shared data; no multi-user concerns at this layer |
| VIII. Feature Isolation | ✅ PASS | Each section is a `loadComponent` lazy route; shell in `layout/`; no cross-feature imports |
| IX. Mobile-First | ✅ PASS | Tailwind base styles = mobile; `md:` / `lg:` = enhancements; bottom nav on mobile; toolbar hides on scroll |
| Technology Constraints | ✅ PASS | Angular Material for all nav UI; latest stable versions |
| Dependency Versioning | ✅ PASS | `ng add @angular/material` installs latest; all deps at `^latest` |

## Project Structure

### Documentation (this feature)

```text
specs/001-app-skeleton/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
│   └── navigation.ts
└── tasks.md             # Phase 2 output (/speckit-tasks)
```

### Source Code (repository root)

```text
src/
├── index.html
├── main.ts
├── styles.css                           # Global Tailwind import
├── material-theme.scss                  # Angular Material M3 theme (loaded via angular.json)
└── app/
    ├── app.ts                           # Root component — hosts <router-outlet>
    ├── app.html
    ├── app.css
    ├── app.config.ts                    # provideRouter, provideAnimationsAsync
    ├── app.routes.ts                    # Top-level lazy routes → ShellComponent layout wrapper
    ├── layout/
    │   └── shell/
    │       ├── shell.ts                 # ShellComponent — sidenav container + toolbar + bottom nav
    │       ├── shell.html
    │       ├── shell.css
    │       └── shell.spec.ts
    ├── shared/
    │   └── navigation/
    │       └── nav-section.model.ts     # NavSection interface + NAV_SECTIONS constant
    └── features/
        ├── home/
        │   ├── home.ts                  # Placeholder component
        │   └── home.html
        ├── shopping/
        │   ├── shopping.ts
        │   └── shopping.html
        └── tasks/
            ├── tasks.ts
            └── tasks.html
```

> **Note**: No per-feature `*.routes.ts` files are needed. All routing is defined in
> `app.routes.ts` using `loadComponent` for each lazy route directly.

**Structure Decision**: Single Angular project. Shell layout isolated in `layout/shell/`.
Features isolated in `features/` as lazy-loaded route components. No shared service
layer needed for this skeleton — navigation state lives in `ShellComponent` signals.

## Complexity Tracking

> No constitution violations requiring justification.

---

## Phase 0: Research

See [research.md](research.md) for full findings. Key decisions:

| Decision | Choice | Rationale |
|----------|--------|-----------|
| App bar component | `MatToolbar` | Standard Material top bar |
| Navigation drawer | `MatSidenav` in `MatSidenavContainer` | Material drawer, supports "over" (mobile) and "side" (desktop) modes |
| Bottom navigation | `MatTabNavBar` + `MatTabLink` | Closest Angular Material component to a navigation bar; no dedicated `mat-bottom-nav` exists |
| Breakpoint detection | `BreakpointObserver('(min-width: 1024px)')` → `toSignal()` | CDK utility; avoids media query duplication; clean signal integration |
| Scroll-away toolbar | Scroll direction signal via `ScrollDispatcher` + CSS `transform` | No built-in Material support; CDK `ScrollDispatcher` is the correct abstraction |
| Lazy loading | `loadComponent` per section route | Simplest Angular 21 lazy-load pattern; no separate route files needed for placeholders |
| Material theme | Custom Angular Material theme in `styles.css` | Required for Material component styling |

## Phase 1: Design

### Angular Material Setup

Angular Material must be added to the project before implementing the shell.
The schematic (`ng add @angular/material`) configures:

- Material theme (custom, in `styles.css`)
- `provideAnimationsAsync()` in `app.config.ts`
- Typography and density settings

### Shell Architecture

`ShellComponent` is the root layout. It owns:

- `MatSidenavContainer` wrapping the full viewport
- `MatSidenav` (the navigation drawer) — mode `over` on mobile, `side` on desktop
- `MatToolbar` in the sidenav content area — hides on scroll-down on mobile
- `MatTabNavBar` fixed at the bottom on mobile (hidden on desktop via CSS)
- `<router-outlet>` for the active section content

Navigation state is managed via signals inside `ShellComponent`:

- `isDrawerOpen: Signal<boolean>` — toggled by menu button
- `isLargeScreen: Signal<boolean>` — from `BreakpointObserver` via `toSignal()`
- `isScrolledDown: Signal<boolean>` — from `ScrollDispatcher` scroll direction tracking

Active section state is driven by Angular's `RouterLinkActive` directive (`#rla="routerLinkActive"`
template variable) — no manual signal is needed. `[active]="rla.isActive"` on `MatTabLink` and
`[activated]="rla.isActive"` on `mat-list-item` keep both navs in sync automatically.

The hamburger button and bottom nav are conditionally rendered with `@if (!isLargeScreen())`
(Angular native control flow) rather than Tailwind `lg:hidden`. This removes the elements from
the DOM entirely on desktop, which is preferable for accessibility: hidden-but-present elements
can still receive keyboard focus with CSS-only approaches.

### Routing

```
/ → redirect → /home
/home → HomeComponent (lazy)
/shopping → ShoppingComponent (lazy)
/tasks → TasksComponent (lazy)
```

The `ShellComponent` wraps the router-outlet; the top-level route uses it as a
layout wrapper with child routes for each section.

### Accessibility Plan

- All `MatSidenav` and `MatToolbar` elements include `aria-label` attributes
- Drawer open/close button: `aria-expanded`, `aria-controls`
- Bottom nav links: `aria-current="page"` on active item
- Focus is trapped inside the drawer when open on mobile (Material handles this)
- Keyboard: Escape closes the drawer (host `document:keydown.escape` binding); Tab cycles through nav items
- `aria-label` on toolbar, sidenav, and hamburger button; `aria-current="page"` on active nav items
- Keyboard validation strategy: Escape key tested explicitly in `shell.spec.ts`; Tab order and
  Enter activation rely on Angular Material's built-in keyboard support, validated end-to-end by
  the AXE zero-violations assertion in `shell.spec.ts`
- Vitest + `axe-core` (direct API, not `@axe-core/angular`) runs AXE checks in tests

### Data Model

See [data-model.md](data-model.md).

### Contracts

See [contracts/navigation.ts](contracts/navigation.ts).
