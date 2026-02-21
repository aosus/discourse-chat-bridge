# Repository Guidelines

## Project Structure & Module Organization
Core runtime starts at `index.js` and initializes both bridges:
- `telegram/`: Telegraf bot commands, scenes, and event handlers.
- `matrix/`: Matrix bot setup, menus, and event processing.
- `discourse/`: Discourse API interaction modules (posts, comments, categories, DMs).
- `module/`: shared helpers (menu routing, storage helpers, translation utilities).
- `translation/`: language JSON files (`en.json`, `ar.json`).
- `storage/`: runtime data files (configured by `dataPath` / `DATAPATH`).
- `docs/`: MkDocs documentation source and site config.

Keep new feature logic close to its platform (`telegram/` or `matrix/`) and put cross-platform utilities in `module/`.

## Build, Test, and Development Commands
- `npm install`: install dependencies for local development.
- `npm start` or `node index.js`: start the bridge locally.
- `npm run generate_matrix_token`: generate and store Matrix access token in `config.json`.
- `docker compose up -d`: run containerized deployment (see `docs/source/installation.md`).
- `pip install -r docs/requirements.txt && mkdocs serve -f docs/mkdocs.yml`: run docs locally.

## Coding Style & Naming Conventions
This project uses Node.js ESM (`"type": "module"`), so prefer `import`/`export`.
- Match existing file naming: lower camel case or descriptive action names (for example `getCategories.js`, `sendMessagePrivate.js`).
- Keep modules focused: one responsibility per file (command handler, event hook, or API helper).
- Follow existing formatting in surrounding files (current codebase is not enforced by ESLint/Prettier).
- Use clear function and variable names that reflect chat/discourse domain behavior.

## Testing Guidelines
There is no automated test suite yet. Validate changes with targeted manual checks:
- Start bot and confirm both Telegram and Matrix clients connect.
- Exercise affected commands (for example `start`, `get_latest_posts`, `sendComment`).
- Verify Discourse side effects (post/comment/DM creation) and storage file updates under `storage/`.
Document manual verification steps in PR descriptions.

## Commit & Pull Request Guidelines
Recent history favors short, imperative commit subjects (for example `Fix security vulnerabilities`, `Refactor MatrixBot...`).
- Use one focused commit per logical change.
- Keep subject lines concise and action-oriented.
- In PRs, include: purpose, behavior changes, config/env impact, and manual test evidence.
- Link related issues and include screenshots/log snippets when changing user-visible bot flows or docs.
