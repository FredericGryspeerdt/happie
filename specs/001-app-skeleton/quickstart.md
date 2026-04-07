# Quickstart: App Skeleton

**Feature**: `001-app-skeleton`
**Branch**: `001-app-skeleton`

## Prerequisites

- Node.js 20+
- npm 11+
- Angular CLI 21+ (`npm install -g @angular/cli`)

## Setup

```bash
# 1. Install dependencies (includes Angular Material after implementation)
npm install

# 2. Start the development server
npm start
# App runs at http://localhost:4200
```

## Verify the Shell

### Mobile layout (< 1024px)

1. Open http://localhost:4200 in a browser
2. Open DevTools → toggle device toolbar → select a mobile preset (e.g. iPhone 14)
3. Verify:
   - [ ] App bar visible at top with "Happie" title and hamburger menu icon
   - [ ] Bottom navigation bar visible with: Home, Shopping, Tasks
   - [ ] Active section highlighted in bottom nav
   - [ ] Tapping a bottom nav item navigates to that section
   - [ ] Hamburger opens the navigation drawer from the left
   - [ ] Drawer lists all three sections with icons and labels
   - [ ] Tapping a drawer item navigates and closes the drawer
   - [ ] Tapping outside the drawer closes it
   - [ ] Scrolling down hides the app bar; scrolling up shows it again
   - [ ] Each section shows a placeholder "Coming soon" screen

### Desktop layout (≥ 1024px)

1. Open http://localhost:4200 in a full browser window (or resize to ≥ 1024px)
2. Verify:
   - [ ] Navigation sidebar is permanently visible on the left
   - [ ] No hamburger menu or bottom navigation bar visible
   - [ ] App bar is fixed (does not scroll away)
   - [ ] Active section highlighted in the sidebar
   - [ ] Clicking a sidebar item navigates to that section

### Responsive resize

1. Start with a desktop window (≥ 1024px)
2. Resize below 1024px
3. Verify:
   - [ ] Sidebar disappears; bottom nav and hamburger appear
   - [ ] No page reload occurs

### Keyboard navigation

1. Using only the keyboard (no mouse):
   - [ ] Tab through all navigation items — all are reachable
   - [ ] Enter activates the focused navigation item
   - [ ] When drawer is open, Escape closes it
   - [ ] Focus returns to the menu button after drawer closes

### Accessibility check

```bash
npm test
# All AXE checks in ShellComponent tests must pass (0 violations)
```

## Run Tests

```bash
npm test
```

All tests must pass before merging, including AXE accessibility checks.

## Build

```bash
npm run build
# Check that initial bundle stays within Angular budget limits:
# initial: < 500kB (warning), < 1MB (error)
```
