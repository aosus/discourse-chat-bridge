---
title: refactor: long-term modernization backlog
type: refactor
date: 2026-02-21
---

# Refactor: Long-Term Modernization Backlog

## Overview

This plan converts the repo-wide review into an execution-ready modernization backlog with PR-sized work items, strict quality gates, and a test-first rollout.

This backlog explicitly follows these constraints:

- Long-term solutions only.
- Deprecated or high-risk dependency chains are replaced, not hardened in place.
- Testing is a first-class deliverable in every milestone.

## Research Summary (Local)

- Runtime is Node.js ESM with direct module-level config reads and many sync disk operations in hot paths.
- Matrix runtime currently uses `matrix-bot-sdk` with transitive `request` and `request-promise`.
- `matrix-bot-sdk@0.8.0` still depends on `request` and `request-promise`.
- Polling/event ingestion currently tracks only one latest post per interval.
- HTML-formatted outbound messages interpolate unescaped user/content fields.
- No automated test suite or coverage gates exist today.
- No institutional learnings were found under `docs/solutions/` (directory not present).

Key current-code references:

- `package.json`
- `index.js`
- `matrix/index.js`
- `matrix/EventPosts.js`
- `matrix/EventReply.js`
- `matrix/sendFile.js`
- `telegram/EventPosts_.js`
- `module/getBuffer.js`
- `discourse/EventPosts.js`
- `module/translation.js`
- `translation/en.json`
- `translation/ar.json`
- `.github/workflows/codeql.yml`
- `.github/workflows/codacy.yml`

## Long-Term Target State

- Runtime baseline: Node 22 LTS+.
- Matrix stack: `matrix-js-sdk` (bot client patterns), no `request` dependency in production graph.
- Network stack: native `fetch`/`undici` semantics, no `node-fetch`.
- Persistence: async repository layer backed by SQLite (single-node durability) with migration from JSON files.
- Event processing: cursor-based ingestion and idempotent fanout.
- Message safety: strict URL allowlist + SSRF protections + HTML escaping/sanitization.
- Test baseline:
  - Unit tests for all core modules.
  - Integration tests for Telegram and Matrix bridges.
  - Security regression tests for SSRF and message injection.
  - End-to-end smoke tests in CI.
- CI gates:
  - coverage thresholds enforced,
  - security scans signal-focused,
  - dependency review and image scan required for merge.

## Architecture Decisions Required Up Front

- ADR-001: Replace `matrix-bot-sdk` with `matrix-js-sdk` instead of upgrading in place.
- ADR-002: Replace JSON-file hot-path persistence with SQLite repository pattern.
- ADR-003: Standardize on Node 22+ and native `fetch`; remove `node-fetch`.
- ADR-004: Keep CodeQL for security findings and move style/static lint noise out of security scanning.

## Milestones

### M0: Program Setup and Guardrails

Exit criteria:

- ADRs for dependency replacement, storage redesign, and runtime baseline are merged.
- Work breakdown and sequencing approved.
- CI branch protections list new required jobs (tests, coverage, security, dependency review).

Backlog items:

- [ ] MB-0001 Create ADRs and migration constraints document.
  - Scope: `docs/plans/`, `README.md`, `docs/source/installation.md`
  - Acceptance: ADRs clearly state why replacement is required and what is deprecated.
  - Tests: N/A (docs-only).
- [ ] MB-0002 Add project-level modernization checklist and milestone dashboard.
  - Scope: `docs/plans/`, `.github/`
  - Acceptance: all backlog IDs traceable to milestones.
  - Tests: N/A (docs-only).

### M1: Runtime and Dependency Foundation

Exit criteria:

- Node 22+ baseline declared and validated in CI.
- Centralized config loading is initialized before platform modules boot.
- `node-fetch` is removed.

Backlog items:

- [ ] MB-0101 Add Node engine/version policy and runtime bootstrap entrypoint.
  - Scope: `package.json`, `index.js`, new `module/config/*`
  - Acceptance: startup fails fast on unsupported Node versions.
  - Tests: unit tests for bootstrap and environment validation.
- [ ] MB-0102 Introduce centralized config schema validation.
  - Scope: new `module/config.js`, updates across `telegram/`, `matrix/`, `discourse/`, `module/`
  - Acceptance: no module reads raw `config.json` at top-level import time.
  - Tests: unit tests for precedence and invalid config failure modes.
- [ ] MB-0103 Replace `node-fetch` usage with native `fetch`.
  - Scope: `discourse/*.js`, `telegram/*.js`, `matrix/*.js`, `module/getBuffer.js`
  - Acceptance: `node-fetch` removed from dependencies and lockfile.
  - Tests: unit tests with mocked HTTP responses; integration smoke for major flows.
- [ ] MB-0104 Secret handling cleanup and runtime secret policy.
  - Scope: docs + startup checks
  - Acceptance: runtime rejects unsafe secret placement and documents secure secret injection.
  - Tests: unit tests for secret validation rules.

### M2: Security Hardening by Replacement and Safe-by-Default APIs

Exit criteria:

- SSRF-safe media fetching implemented and tested.
- HTML-formatted outputs are escaped/sanitized in both bridges.
- No direct unsafe HTML concatenation remains on outbound message paths.

Backlog items:

- [ ] MB-0201 Build `safeRemoteFetch` module with strict URL policy.
  - Scope: new `module/security/safeRemoteFetch.js`, replace `module/getBuffer.js` callers
  - Acceptance: only allowed protocols/hosts; private IP ranges denied; redirects re-validated.
  - Tests: security unit tests covering loopback, RFC1918, link-local, IPv6 local, and DNS rebinding scenarios.
- [ ] MB-0202 Replace brittle image-preview extraction pipeline.
  - Scope: `matrix/sendFile.js`, `matrix/EventPosts.js`, `telegram/EventPosts_.js`
  - Acceptance: no temp-file misuse; media flow works from buffer/stream pipeline.
  - Tests: integration tests for image and non-image topics.
- [ ] MB-0203 Add channel-specific HTML escaping and safe formatter utilities.
  - Scope: new formatter module; replace message composition in matrix/telegram flows
  - Acceptance: all user/content fields are escaped before HTML output.
  - Tests: security regression tests with malicious topic titles/usernames/content.
- [ ] MB-0204 Content sanitization policy for Discourse cooked/raw fields.
  - Scope: message rendering modules
  - Acceptance: defined allowed tags/attributes and consistent fallback to plain text.
  - Tests: unit tests for sanitizer policy and edge cases.

### M3: Matrix Stack Replacement (No Deprecated Request Chain)

Exit criteria:

- `matrix-bot-sdk` removed from production dependencies.
- Matrix runtime works on `matrix-js-sdk` with feature parity for required bot flows.
- Auto-join and encryption behaviors are implemented from real config flags.

Backlog items:

- [ ] MB-0301 Introduce platform adapter interface for matrix/telegram bridge operations.
  - Scope: new abstraction layer + minimal integration changes
  - Acceptance: matrix implementation can be swapped without touching discourse logic.
  - Tests: adapter contract tests.
- [ ] MB-0302 Implement Matrix client runtime using `matrix-js-sdk`.
  - Scope: replace `matrix/index.js` startup/event wiring
  - Acceptance: message receive, reply context, send message/media all function.
  - Tests: integration tests for room messages, direct messages, and bot-self filtering.
- [ ] MB-0303 Rebuild reply and post fanout paths on new matrix adapter.
  - Scope: `matrix/EventReply.js`, `matrix/EventPosts.js`, related menu modules
  - Acceptance: reply-to-topic comment bridge behavior preserved.
  - Tests: integration tests for reply parsing and comment posting path.
- [ ] MB-0304 Implement config-driven autojoin and encryption behavior.
  - Scope: matrix runtime + config docs
  - Acceptance: `matrix_autojoin` and `matrix_encryption` settings are active and test-covered.
  - Tests: integration tests for join flow and encrypted media/message path.
- [ ] MB-0305 Remove legacy matrix SDK code and dependencies.
  - Scope: `package.json`, lockfile, matrix modules
  - Acceptance: dependency tree no longer includes `request` or `request-promise`.
  - Tests: `npm ls` check in CI + matrix regression suite green.

### M4: Event Ingestion and Persistence Modernization

Exit criteria:

- Topic ingestion processes all unseen topics per poll cycle.
- Persistence is async and transaction-safe.
- JSON-state migration to SQLite is complete and documented.

Backlog items:

- [ ] MB-0401 Replace single-item poll logic with cursor-based ingestion.
  - Scope: `discourse/EventPosts.js`
  - Acceptance: multiple new topics between intervals are all emitted once.
  - Tests: unit tests simulating skipped intervals and bursts.
- [ ] MB-0402 Add idempotency keys and duplicate suppression layer.
  - Scope: event pipeline modules + persistence
  - Acceptance: duplicate topic notifications are prevented across restarts.
  - Tests: restart/replay tests with repeated payloads.
- [ ] MB-0403 Introduce repository layer and async persistence API.
  - Scope: new `module/repository/*`; replace sync `fs` database calls
  - Acceptance: no `readJsonSync/writeJsonSync` in message hot paths.
  - Tests: unit tests for repository semantics and concurrency behavior.
- [ ] MB-0404 Implement SQLite schema and migration tooling.
  - Scope: new storage module + migration scripts + docs
  - Acceptance: old JSON data migrates losslessly and idempotently.
  - Tests: migration tests on sample real-world fixture data.
- [ ] MB-0405 Add queue-based fanout with retry/backoff and dead-letter capture.
  - Scope: event dispatch modules
  - Acceptance: transient downstream failures do not lose events.
  - Tests: integration tests for retry behavior and dead-letter recording.

### M5: Test Program (Mandatory and Parallel)

Exit criteria:

- Test suite runs in CI on pull requests.
- Coverage gates are enforced at meaningful thresholds.
- Security regression tests are mandatory for merge.

Backlog items:

- [ ] MB-0501 Introduce test framework and fixtures.
  - Scope: `package.json`, new `test/` tree, coverage config
  - Acceptance: single-command local and CI test execution.
  - Tests: framework bootstrap verification job.
- [ ] MB-0502 Unit tests for Discourse API modules.
  - Scope: `discourse/*`
  - Acceptance: success/error/timeouts/retry behaviors are covered.
  - Tests: mocked HTTP test suite.
- [ ] MB-0503 Unit tests for config, translation, and formatting/security modules.
  - Scope: `module/config*`, `module/translation.js`, formatter/security utilities
  - Acceptance: missing keys and invalid inputs produce deterministic outcomes.
  - Tests: unit suites with failure-mode coverage.
- [ ] MB-0504 Integration tests for Telegram command and wizard flows.
  - Scope: `telegram/*`
  - Acceptance: `/start`, activation, discourse linking, post/comment flows are covered.
  - Tests: integration suite with fake Telegram client transport.
- [ ] MB-0505 Integration tests for Matrix message routing and replies.
  - Scope: `matrix/*`
  - Acceptance: matrix room/direct flows and reply bridge are covered.
  - Tests: integration suite with matrix client mocks or local test homeserver.
- [ ] MB-0506 Security regression suite.
  - Scope: `test/security/*`
  - Acceptance: SSRF and HTML injection regressions are prevented by tests.
  - Tests: malicious fixture corpus and expected-safe output assertions.
- [ ] MB-0507 End-to-end smoke tests in containerized CI.
  - Scope: `.github/workflows/*`, test infra scripts
  - Acceptance: end-to-end happy path passes on every PR.
  - Tests: full smoke pipeline including storage and network mocks.
- [ ] MB-0508 Coverage thresholds and policy.
  - Scope: CI + test config
  - Acceptance: minimum thresholds:
    - line coverage >= 85%
    - branch coverage >= 75%
    - changed-files coverage >= 90%
  - Tests: CI coverage gate enforcement.

### M6: CI/CD Signal Quality, Security, and Documentation

Exit criteria:

- Security scanning is signal-rich and not dominated by style lint.
- Modernized workflows are stable and required for merge.
- Operator docs and migration runbooks are complete.

Backlog items:

- [ ] MB-0601 Add dedicated CI workflow for lint, tests, coverage, and artifact publishing.
  - Scope: `.github/workflows/ci.yml`
  - Acceptance: PR checks are consolidated and deterministic.
  - Tests: workflow validation on pull requests.
- [ ] MB-0602 Re-scope Codacy/style findings out of security dashboard path.
  - Scope: `.github/workflows/codacy.yml`, repository code scanning config
  - Acceptance: security dashboards primarily show actionable security issues.
  - Tests: verify SARIF uploads and rule categorizations post-change.
- [ ] MB-0603 Keep CodeQL as primary security scanner with tuned configuration.
  - Scope: `.github/workflows/codeql.yml`
  - Acceptance: CodeQL runs on PR + schedule with manageable runtime.
  - Tests: successful CodeQL run with expected language matrix.
- [ ] MB-0604 Add image and dependency vulnerability scanning gates.
  - Scope: Docker/build workflows
  - Acceptance: container image scan and dependency audit block high/critical findings.
  - Tests: CI policy tests with intentionally vulnerable fixtures.
- [ ] MB-0605 Documentation rewrite for runtime/env consistency and migration.
  - Scope: `README.md`, `docs/source/installation.md`, Arabic docs parity
  - Acceptance: env var names are consistent (`LANGUAGE`, `DATAPATH`, etc.) and behavior documented.
  - Tests: docs validation + manual quickstart verification script.
- [ ] MB-0606 Add operational runbooks.
  - Scope: new docs for rollback, incident response, migration verification
  - Acceptance: deploy/rollback and data migration procedures are explicit and reproducible.
  - Tests: tabletop run-through and migration dry run checklist.

## Replacement Policy (Enforced)

The following are explicitly disallowed:

- Upgrading `matrix-bot-sdk` while keeping deprecated `request` chain.
- Keeping `node-fetch` on modern Node runtime.
- Keeping sync JSON reads/writes in request/message hot paths.
- Shipping security fixes without regression tests.

## Test Strategy Details

Test layers and expectations:

- Unit:
  - pure logic, parsing, config, validation, repositories.
- Integration:
  - platform bridge behavior with mocked clients and controlled network responses.
- Security:
  - SSRF policy tests, HTML escaping/sanitization tests, malformed payload tests.
- End-to-end:
  - containerized smoke path from Discourse event ingestion through outbound bridge.

Required policy:

- Every backlog item touching runtime logic includes at least one new test.
- Every security change includes both positive and negative regression cases.
- Bug fixes must include a failing test first, then passing implementation.

## Sequencing and Dependencies

Recommended execution order:

1. M0 + MB-0501 (test framework bootstrap immediately).
2. M1 foundation and config cleanup.
3. M2 security modules and formatter migration.
4. M3 matrix replacement to remove deprecated chain.
5. M4 ingestion/persistence redesign with migration.
6. M5 deep test coverage expansion and thresholds.
7. M6 CI signal cleanup, docs, and runbooks.

Parallelizable tracks:

- M5 test expansion can run in parallel with M2-M4 once fixtures exist.
- M6 workflow modernization can start after MB-0501 and MB-0601 scaffolding.

## Risk Register

- Matrix behavior parity risk during SDK migration.
  - Mitigation: adapter contract tests, side-by-side fixture tests, staged rollout.
- Data migration risk from JSON to SQLite.
  - Mitigation: idempotent migration scripts, checksums, dry-run mode, rollback doc.
- Increased delivery time due to strict test gates.
  - Mitigation: parallelize by milestone and enforce small PR slices.

## Definition of Done (Program-Level)

The modernization program is complete when all conditions are true:

- No deprecated high-risk dependency chains remain in production runtime graph.
- Matrix runtime is fully on `matrix-js-sdk` with required feature parity.
- Polling/event ingestion is idempotent and loss-resistant.
- Hot-path storage access is async and transaction-safe.
- Security and coverage gates are green in CI:
  - 0 critical and 0 high open dependency vulnerabilities,
  - mandatory security regression suite passing,
  - coverage thresholds met.
- Installation and operations docs are consistent and verified.

## Immediate Next Execution Batch

If implementation starts now, execute these first PRs:

- [ ] MB-0501 Test framework bootstrap.
- [ ] MB-0101 Runtime baseline + bootstrap.
- [ ] MB-0102 Central config schema and startup ordering.
- [ ] MB-0201 Safe remote fetch policy module.
- [ ] MB-0301 Matrix adapter interface scaffold.

