---
description: "Task list for App Skeleton implementation"
---

# Tasks: App Skeleton

**Input**: Design documents from `/specs/001-app-skeleton/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/navigation.ts ✅

**Tests**: Included — required by constitution Principle VI (Test Discipline).

**Organization**: Tasks are grouped by user story to enable independent
implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (US1, US2, US3)
- Exact file paths included in all descriptions

## Path Conventions

- All paths relative to repository root
- Angular source: `src/app/`
- Shell layout: `src/app/layout/shell/`
- Features: `src/app/features/<name>/`
- Shared models: `src/app/shared/navigation/`

---

## Phase 1: Setup

**Purpose**: Install Angular Material and configure the project for shell development.

- [ ] T001 Install Angular Material via schematic — run `ng add @angular/material` (updates `package.json`, `src/styles.css`, `src/index.html`, `src/app/app.config.ts`). After it completes, verify what the schematic wrote before executing T002/T003 — skip any step already done by the schematic.
- [X] T002 [P] Configure custom Angular Material theme and typography in `src/styles.css`
- [X] T003 [P] Add `provideAnimationsAsync()` to providers in `src/app/app.config.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core types, routing skeleton, and placeholder feature components that
all user stories depend on.

**⚠️ CRITICAL**: No user story work can begin until this phase is complete.

- [X] T004 Define `NavSection` interface and `NAV_SECTIONS` constant (Home, Shopping, Tasks) in `src/app/shared/navigation/nav-section.model.ts`
- [X] T005 Configure `app.routes.ts` with `ShellComponent` as layout wrapper and lazy `loadComponent` child routes for `/home`, `/shopping`, `/tasks`, and a root redirect in `src/app/app.routes.ts`
- [X] T006 [P] Create `HomeComponent` standalone placeholder ("Coming soon") in `src/app/features/home/home.ts` and `src/app/features/home/home.html`
- [X] T007 [P] Create `ShoppingComponent` standalone placeholder ("Coming soon") in `src/app/features/shopping/shopping.ts` and `src/app/features/shopping/shopping.html`
- [X] T008 [P] Create `TasksComponent` standalone placeholder ("Coming soon") in `src/app/features/tasks/tasks.ts` and `src/app/features/tasks/tasks.html`
- [X] T009 Create `ShellComponent` scaffold with `MatSidenavContainer` and `<router-outlet>` in `src/app/layout/shell/shell.ts` and `src/app/layout/shell/shell.html`
- [X] T010 Replace `src/app/app.html` contents with `<router-outlet />` only, and remove the unused `title` signal from `src/app/app.ts`

**Checkpoint**: App boots, redirects to `/home`, and shows the Home placeholder — foundation ready.

---

## Phase 3: User Story 1 — Mobile Navigation (Priority: P1) 🎯 MVP

**Goal**: A household member on mobile sees the app bar with the Happie title,
a bottom navigation bar with Home/Shopping/Tasks, active-state highlighting,
and a scroll-away toolbar.

**Independent Test**: Open the app on a mobile viewport. Tap each bottom nav item
and confirm the active section changes. Scroll down to confirm the app bar hides;
scroll up to confirm it reappears.

### Implementation for User Story 1

- [X] T011 [P] [US1] Add `MatToolbar` to `ShellComponent` with "Happie" title in `src/app/layout/shell/shell.html`
- [X] T012 [P] [US1] Implement `isScrolledDown` signal in `ShellComponent` using CDK `ScrollDispatcher` to detect scroll direction in `src/app/layout/shell/shell.ts`
- [X] T013 [US1] Apply `[class.toolbar-hidden]="isScrolledDown()"` binding directly on the `<mat-toolbar>` element in `src/app/layout/shell/shell.html`, and add `transform: translateY(-100%)` transition CSS for `.toolbar-hidden` in `src/app/layout/shell/shell.css`
- [X] T014 [US1] Implement `activeSection` signal derived from `Router` navigation events matching against `NAV_SECTIONS` in `src/app/layout/shell/shell.ts`
- [X] T015 [US1] Add `MatTabNavBar` bottom navigation with three `MatTabLink` items (Home, Shopping, Tasks) and `mat-icon` icons in `src/app/layout/shell/shell.html`
- [X] T016 [US1] Style bottom navigation fixed at bottom, full-width, with minimum 44×44px touch targets in `src/app/layout/shell/shell.css`
- [X] T017 [US1] Bind `[active]` on each `MatTabLink` to `activeSection()?.id` comparison in `src/app/layout/shell/shell.html`

**Checkpoint**: User Story 1 is fully functional — mobile nav and scroll-away toolbar work independently.

---

## Phase 4: User Story 2 — Navigation Drawer (Priority: P2)

**Goal**: A household member taps the hamburger menu to open a navigation drawer
listing all sections; selecting a section or tapping the backdrop closes the drawer.

**Independent Test**: Tap the hamburger button to open the drawer. Verify all three
sections are listed. Tap a section — drawer closes and section activates. Tap the
backdrop — drawer closes without changing section.

### Implementation for User Story 2

- [X] T018 [US2] Add `MatSidenav` (mode `over`) with `MatNavList` and section items to `ShellComponent` in `src/app/layout/shell/shell.html`
- [X] T019 [US2] Implement `isDrawerOpen` signal with `openDrawer()`, `closeDrawer()`, and `toggleDrawer()` methods in `src/app/layout/shell/shell.ts`
- [X] T020 [US2] Add hamburger `MatIconButton` to `MatToolbar`, bind to `toggleDrawer()`, with `aria-expanded` and `aria-controls` attributes in `src/app/layout/shell/shell.html`
- [X] T021 [US2] Bind each drawer nav item click to navigate and call `closeDrawer()` in `src/app/layout/shell/shell.html`
- [X] T022 [US2] Bind `MatSidenav` `(backdropClick)` to `closeDrawer()` in `src/app/layout/shell/shell.html`
- [X] T023 [US2] Add `aria-label` to `MatSidenav` and `aria-current="page"` to the active drawer nav item in `src/app/layout/shell/shell.html`

**Checkpoint**: User Stories 1 AND 2 are both independently functional.

---

## Phase 5: User Story 3 — Tablet & Desktop Adapted Layout (Priority: P3)

**Goal**: On viewports ≥ 1024px the navigation sidebar is persistently visible,
the hamburger and bottom nav are hidden, and the layout adapts without a page reload.

**Independent Test**: Open at ≥ 1024px — confirm persistent sidebar, no bottom nav,
no hamburger. Resize below 1024px — confirm bottom nav and hamburger appear. No
reload should occur.

### Implementation for User Story 3

- [X] T024 [US3] Implement `isLargeScreen` signal from `BreakpointObserver('(min-width: 1024px)')` via `toSignal()` in `src/app/layout/shell/shell.ts`
- [X] T025 [US3] Bind `MatSidenav` `[mode]` and `[opened]` to `isLargeScreen` signal (mode `side`, always open on desktop; mode `over`, signal-driven on mobile) in `src/app/layout/shell/shell.html`
- [X] T026 [P] [US3] Hide bottom navigation on desktop using `@if (!isLargeScreen())` in `src/app/layout/shell/shell.html`
- [X] T027 [P] [US3] Hide hamburger button on desktop using `@if (!isLargeScreen())` in `src/app/layout/shell/shell.html`
- [X] T028 [US3] Add an `effect()` in `ShellComponent` to auto-close drawer (`isDrawerOpen.set(false)`) when `isLargeScreen` becomes `true` in `src/app/layout/shell/shell.ts`

**Checkpoint**: All three user stories are independently functional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Accessibility, tests, and validation across all stories.

- [X] T029 [P] Add `aria-label` to `MatToolbar` and ensure all `MatTabLink` items have descriptive labels and `aria-current` binding in `src/app/layout/shell/shell.html`
- [X] T030 [P] Write Vitest component tests for `ShellComponent` navigation signal behavior: active section updates on route change, drawer opens/closes via `toggleDrawer()`, pressing Escape while drawer is open calls `closeDrawer()`, breakpoint signal switches layout mode in `src/app/layout/shell/shell.spec.ts`
- [X] T030a Install `axe-core` devDependency: `npm install --save-dev axe-core`
- [X] T031 [P] Write AXE accessibility test for `ShellComponent` using `axe-core` — assert zero violations in `src/app/layout/shell/shell.spec.ts`
- [X] T032 Run `npm test` and verify all tests pass (zero AXE violations, all signal behavior tests green)
- [X] T033 Run `npm run build` and verify initial bundle remains within Angular budget (< 500kB warning threshold)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — start immediately
- **Foundational (Phase 2)**: Requires Phase 1 complete — blocks all user stories
- **US1 (Phase 3)**: Requires Phase 2 complete — MVP delivery point
- **US2 (Phase 4)**: Requires Phase 2 complete — can start in parallel with US1 after Phase 2
- **US3 (Phase 5)**: Requires Phase 2 complete — can start after Phase 2; benefits from US1/US2 complete for full integration
- **Polish (Phase 6)**: Requires all desired user stories complete

### User Story Dependencies

- **US1 (P1)**: After Foundational — no dependency on US2 or US3
- **US2 (P2)**: After Foundational — adds drawer to the shell; independent of US1 (different shell behaviour)
- **US3 (P3)**: After Foundational — adds breakpoint logic; integrates cleanly after US1+US2

### Within Each Story

- Models/signals before bindings
- Bindings before styling
- Styling before accessibility attributes
- Implementation complete before tests

### Parallel Opportunities

- T002 + T003 can run in parallel (Phase 1)
- T006 + T007 + T008 can run in parallel (Phase 2)
- T011 + T012 can run in parallel (Phase 3)
- T026 + T027 can run in parallel (Phase 5)
- T029 + T030 + T031 can run in parallel (Phase 6)

---

## Parallel Example: User Story 1

```bash
# Run together (different files, no deps between them):
Task T011: "Add MatToolbar to shell.html"
Task T012: "Implement isScrolledDown signal in shell.ts"

# Then sequentially:
Task T013: "Apply toolbar-hidden class binding and CSS" (depends on T011 + T012)
Task T014: "Implement activeSection signal" (depends on T004 NAV_SECTIONS)
Task T015: "Add MatTabNavBar to shell.html" (depends on T014)
Task T016: "Style bottom nav in shell.css"
Task T017: "Bind [active] on MatTabLinks" (depends on T014 + T015)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational
3. Complete Phase 3: User Story 1 (mobile nav + scroll-away toolbar)
4. **STOP and VALIDATE**: Bottom nav works, active state correct, scroll-away works
5. Demo/review if ready

### Incremental Delivery

1. Phase 1 + 2 → Foundation ready
2. Phase 3 → US1 complete → Demo mobile nav (MVP!)
3. Phase 4 → US2 complete → Demo drawer
4. Phase 5 → US3 complete → Demo desktop layout
5. Phase 6 → Polish → Tests + accessibility + build verified

---

## Notes

- `[P]` tasks have no file conflicts with concurrent tasks in the same phase
- AXE tests (T031) require `axe-core` package — add to devDependencies if not present
- `ng add @angular/material` (T001) modifies several files; commit before proceeding to T002/T003
- `effect()` in T028 requires injection context — must be called in the constructor or with `runInInjectionContext`
- Tailwind `lg:` prefix maps to `min-width: 1024px` — matches the constitution-defined breakpoint
