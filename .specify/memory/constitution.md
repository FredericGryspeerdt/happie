<!--
Sync Impact Report
- Version change: 1.6.0 → 1.6.1 (remove NON-NEGOTIABLE label from Principle I)
- Added principles:
  - VII. Collaborative by Default
  - VIII. Feature Isolation
- Modified principles:
  - II. Signal-Driven Reactivity — slimmed to high-level intent;
    implementation rules deferred to CLAUDE.md
  - III. Standalone & Minimal Components — slimmed to high-level intent;
    implementation rules deferred to CLAUDE.md
- Modified sections:
  - Technology Constraints — reduced to policy-level; references CLAUDE.md
  - Development Workflow — expanded lifecycle guidance; removed
    duplication with Principle I
- Removed sections: none
- Templates requiring updates:
  - .specify/templates/plan-template.md — ✅ no updates needed
  - .specify/templates/spec-template.md — ✅ no updates needed
  - .specify/templates/tasks-template.md — ✅ no updates needed
  - .specify/templates/commands/ — ✅ no command files exist
  - AGENTS.md — ✅ no updates needed
- Follow-up TODOs: none
-->

# Happie Constitution

## Mission

Happie is a household management tool that simplifies daily
domestic life. It provides shared features — such as todo lists,
shopping lists, and energy consumption dashboards — that all
members of a household can access and act on together.

**Target users**: Members of a shared household (families,
housemates, partners).

**Guiding goal**: Every feature MUST reduce friction in a real
household task. Features that do not map to a concrete daily
activity MUST NOT be added.

## Core Principles

### I. Accessibility-First

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

Component state MUST be modelled with Angular Signals. Observable
patterns are permitted only at service boundaries (HTTP, router).
Derived state MUST be expressed with `computed()` — never
duplicated or manually synced. All transformations MUST be pure.

See CLAUDE.md for the specific signal API rules.

**Rationale**: Signals provide fine-grained, synchronous
reactivity that aligns with OnPush change detection and
eliminates common subscription-leak bugs.

### III. Standalone & Minimal Components

Every component MUST be standalone and follow the
single-responsibility principle. Components MUST use OnPush
change detection. Dependencies MUST be injected via `inject()`.

See CLAUDE.md for the full list of API choices and prohibited
patterns.

**Rationale**: Standalone components eliminate NgModule
indirection. OnPush + signals guarantee predictable rendering.
Consistent API choices reduce cognitive load across the codebase.

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
- Do NOT add features, configuration, or extensibility points
  beyond what is explicitly requested.
- Prefer Angular Material components over custom implementations.
  A custom component is only justified when Angular Material
  provably cannot meet the requirement.
- Prefer native Angular/platform APIs over third-party libraries
  when capability is equivalent.

**Rationale**: Unused abstraction is negative value — it adds
maintenance cost, cognitive overhead, and indirection without
delivering benefit.

### VI. Test Discipline

All features MUST have corresponding test coverage using Vitest.
Tests MUST verify behavior, not implementation details.

- Use Vitest as the sole test runner.
- Test user-visible behavior and public APIs.
- Prefer integration-style component tests over isolated unit
  tests where practical.
- Tests MUST run in CI and block merge on failure.

**Rationale**: Tests are a safety net for refactoring and a
living specification. Testing behavior over implementation keeps
tests stable across refactors.

### VII. Collaborative by Default

Happie is a multi-user product. Every feature MUST be designed
with shared access in mind from the start.

- Data that belongs to a household MUST be accessible to all
  members of that household.
- UI state MUST reflect the current server state — stale or
  member-local views are not acceptable for shared data.
- Conflict handling MUST be considered at design time for any
  feature where two members could act on the same data
  simultaneously.
- Features MUST NOT assume a single owner or single actor.

**Rationale**: Collaborative behaviour is Happie's defining
characteristic. Designing for a single user and retrofitting
multi-user is one of the most expensive architectural mistakes
possible.

### VIII. Feature Isolation

Each Happie feature (e.g., shopping list, energy dashboard) MUST
be a self-contained, independently navigable module.

- Each feature MUST be implemented as a lazy-loaded Angular
  route module.
- Features MUST NOT import directly from other feature modules.
  Shared logic MUST live in a dedicated shared module.
- A feature MUST be deliverable and demonstrable independently
  without requiring other features to be complete.
- Adding or removing a feature MUST NOT break other features.

**Rationale**: Happie's feature set will grow over time. Isolation
keeps the codebase navigable, enables independent delivery, and
prevents one feature's complexity from leaking into others.

## Technology Constraints

Happie uses Angular 21+ with strict TypeScript, Tailwind CSS 4
for styling, and Vitest as the test runner. These choices are
non-negotiable for the lifetime of this constitution version.

**UI component library**: Angular Material (https://material.angular.dev)
is the standard component library for Happie. It MUST be used for
any UI element it covers (buttons, forms, dialogs, navigation,
tables, etc.). Custom components MUST NOT be built when an Angular
Material equivalent exists. When Angular Material does not cover a
need, a custom component MAY be created — this MUST be documented
in the PR explaining why Material was insufficient.

**Dependency versioning**: All dependencies MUST be kept on their
latest stable release. When adding a new dependency, the latest
stable version MUST be used. Pinning to an older version MUST be
justified in the PR with a documented reason and a remediation
plan (e.g., a linked issue to upgrade once a blocker is resolved).
Stale version pins MUST be reviewed and resolved within 30 days.

For the authoritative list of framework API choices, prohibited
patterns, and template conventions, see **CLAUDE.md**.

## Development Workflow

- All PRs MUST pass linting, formatting, and test suites in CI
  before merge.
- All PRs MUST include a constitution compliance check in the
  review (see Governance).
- Features MUST be developed on a dedicated branch and delivered
  via a pull request — direct commits to `develop` or `main` are
  PROHIBITED.
- Each PR SHOULD be scoped to a single feature or concern.
  Large PRs MUST be split unless technically inseparable.
- Run `git pull --rebase` before pushing to keep history clean.

## Documentation & Process Rules

### Documentation Separation of Concerns

Documentation follows strict separation between WHAT/WHY
(`spec.md`) and HOW (`plan.md`):

- **`spec.md` — Product Perspective (What & Why)**:
  - MUST remain technology-agnostic.
  - NO implementation details (frameworks, libraries, architecture
    patterns).
  - NO technical terminology except domain terms.
  - Focus: User Stories, Requirements, Success Criteria.
  - Question: *"What should the system do and why?"*
  - Target audience: Product Owner, Stakeholders, Domain Experts.

- **`plan.md` — Engineering Perspective (How)**:
  - Contains ALL technical details and implementation decisions.
  - Specifies frameworks, libraries, architecture patterns.
  - Defines Technical Context (Language, Dependencies, Storage,
    Testing).
  - Documents Constitution Checks and Complexity Tracking.
  - Question: *"How do we implement the requirements from
    spec.md?"*
  - Target audience: Developers, Tech Leads, Code Reviewers.

- **Violations & Enforcement**:
  - Technical details in `spec.md` are a blocker for merge.
  - `spec.md` reviews MUST verify technology-agnosticism.
  - All "HOW" discussions belong in `plan.md` or code comments.
  - Constitution Checks in `plan.md` validate separation.

**Rationale**: Clear separation prevents mixing of business
requirements and technical decisions. `spec.md` remains
maintainable even when the tech stack changes. Product
discussions focus on user value instead of implementation.

### Commits

All commits MUST follow
[Conventional Commits](https://conventionalcommits.org)
(e.g., `feat:`, `fix:`, `docs:`, `chore:`). This applies to
both manual and AI-assisted changes.

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
   - PATCH: Clarification, wording, or typo fix.
5. Update `LAST_AMENDED_DATE` to the merge date.

**Compliance review**: Every PR review MUST include a check
that the changes do not violate any active principle.

**Version**: 1.6.1 | **Ratified**: 2026-04-04 | **Last Amended**: 2026-04-05
