<!--
Sync Impact Report
- Version change: N/A → 1.0.0 (initial ratification)
- Added principles:
  - I. Accessibility-First
  - II. Signal-Driven Reactivity
  - III. Standalone & Minimal Components
  - IV. Type Safety
  - V. Simplicity & Restraint
  - VI. Test Discipline
- Added sections:
  - Technology Constraints
  - Development Workflow
  - Governance
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no updates needed (Constitution Check section is generic)
  - .specify/templates/spec-template.md — ✅ no updates needed (requirements/scenarios are generic)
  - .specify/templates/tasks-template.md — ✅ no updates needed (phase structure is generic)
- Follow-up TODOs: none
-->

# Happie Constitution

## Core Principles

### I. Accessibility-First (NON-NEGOTIABLE)

Every component, page, and interaction MUST meet WCAG AA standards
and pass all AXE automated checks before merge.

- All interactive elements MUST have proper focus management
  and visible focus indicators.
- Color contrast MUST meet WCAG AA minimum ratios (4.5:1 for
  normal text, 3:1 for large text).
- ARIA attributes MUST be applied where native HTML semantics
  are insufficient.
- Keyboard navigation MUST work for all interactive flows.
- Accessibility violations block merges — no exceptions.

**Rationale**: Accessibility is a baseline quality attribute, not
a feature. Retrofitting it is orders of magnitude harder than
building it in from the start.

### II. Signal-Driven Reactivity

All component state MUST use Angular Signals. Observable-based
patterns are permitted only at service boundaries (HTTP, router).

- Use `signal()` for local mutable state.
- Use `computed()` for all derived state — never duplicate or
  manually sync derived values.
- Use `update()` or `set()` to mutate signals. `mutate()` is
  PROHIBITED.
- Keep all signal transformations pure and side-effect free.
- Use the `async` pipe exclusively for observable-to-template
  binding.

**Rationale**: Signals provide fine-grained, synchronous
reactivity that aligns with OnPush change detection and
eliminates common subscription-leak bugs.

### III. Standalone & Minimal Components

Every component MUST be standalone (Angular 21+ default) and
follow the single-responsibility principle.

- Do NOT set `standalone: true` explicitly — it is the default.
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in every
  `@Component` decorator.
- Use `input()` and `output()` functions — decorators are
  PROHIBITED.
- Prefer inline templates for components with < 20 lines of
  markup.
- Use `class` bindings instead of `ngClass`; `style` bindings
  instead of `ngStyle`.
- Use `host` object in decorators — `@HostBinding` and
  `@HostListener` are PROHIBITED.
- Use `inject()` for dependency injection — constructor injection
  is PROHIBITED.
- Use `NgOptimizedImage` for all static images (except inline
  base64).

**Rationale**: Standalone components eliminate NgModule
indirection. OnPush + signals guarantee predictable rendering.
Consistent API choices reduce cognitive load.

### IV. Type Safety

TypeScript strict mode MUST remain enabled. The `any` type is
PROHIBITED in application code.

- Prefer type inference when the type is obvious from context.
- Use `unknown` when the type is genuinely uncertain, then narrow
  with guards.
- Generic constraints MUST be as narrow as practical.
- External API responses MUST be validated or typed at the
  boundary.

**Rationale**: Strict typing catches entire categories of bugs
at compile time and makes refactoring safe.

### V. Simplicity & Restraint

Every abstraction MUST justify its existence with a concrete,
current need. Speculative design is PROHIBITED.

- Do NOT create helpers, utilities, or abstractions for one-time
  operations.
- Three similar lines of code are preferable to a premature
  abstraction.
- Do NOT add error handling or validation for scenarios that
  cannot occur in practice.
- Do NOT add features, configuration, or extensibility points
  beyond what is explicitly requested.
- Prefer native Angular/platform APIs over third-party libraries
  when capability is equivalent.

**Rationale**: Unused abstraction is negative value — it adds
maintenance cost, cognitive overhead, and indirection without
delivering benefit.

### VI. Test Discipline

All features MUST have corresponding test coverage using Vitest.
Tests MUST be meaningful — they verify behavior, not
implementation details.

- Use Vitest (`vitest`) as the sole test runner.
- Test user-visible behavior and public APIs, not internal
  implementation.
- Prefer integration-style component tests over isolated unit
  tests where practical.
- Tests MUST run in CI and block merge on failure.

**Rationale**: Tests are a safety net for refactoring and a
living specification. Testing behavior over implementation keeps
tests stable across refactors.

## Technology Constraints

The following technology choices are non-negotiable for Happie:

| Layer          | Technology          | Version   |
|----------------|---------------------|-----------|
| Framework      | Angular             | 21+       |
| Language       | TypeScript (strict) | 5.9+      |
| Styling        | Tailwind CSS        | 4+        |
| Test Runner    | Vitest              | 4+        |
| Build          | Angular CLI         | 21+       |
| Formatting     | Prettier            | —         |

- Templates MUST use native control flow (`@if`, `@for`,
  `@switch`). Structural directives (`*ngIf`, `*ngFor`,
  `*ngSwitch`) are PROHIBITED.
- Reactive Forms MUST be used for all form handling.
  Template-driven forms are PROHIBITED.
- Arrow functions in templates are NOT supported and MUST NOT
  be used.
- Template expressions MUST NOT reference globals (e.g.,
  `new Date()`).

## Development Workflow

- Components MUST pass AXE accessibility checks before code
  review.
- All PRs MUST pass linting, formatting, and test suites in CI.
- Commit after each logical unit of work — not in bulk.
- Run `git pull --rebase` before pushing to avoid unnecessary
  merge commits.
- Feature routes MUST use lazy loading.

## Governance

This constitution is the highest-authority document for Happie
development decisions. When a PR, design choice, or code review
conflicts with a principle above, the constitution wins.

**Amendment procedure**:

1. Propose the change with rationale in a dedicated PR or issue.
2. Document the before/after principle text.
3. Include a migration plan if existing code is affected.
4. Update the constitution version per SemVer:
   - MAJOR: Principle removed or fundamentally redefined.
   - MINOR: New principle added or existing one materially
     expanded.
   - PATCH: Wording clarification or typo fix.
5. Update `LAST_AMENDED_DATE` to the merge date.

**Compliance review**: Every PR review MUST include a check
that the changes do not violate any active principle.

**Version**: 1.0.0 | **Ratified**: 2026-04-04 | **Last Amended**: 2026-04-04
