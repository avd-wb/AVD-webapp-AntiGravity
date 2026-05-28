# Changelog — WBAH&VS Portal

All notable changes to the West Bengal Animal Husbandry & Veterinary Services (WBAH&VS) WebApp and Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-05-28

### Added
- **Repository Exclusions:** Updated `.gitignore` to permanently exclude `_Trash/` and `scratch/` directories to prevent bulky temporary scripts and backups from cluttering version control on GitHub.
- **Persistent Changelog:** Created this master `CHANGELOG.md` at the repository root to record historical and future updates, securing the project for web-only multi-machine operations.

### Changed
- **Server Entrypoint Resolution:** Patched `vercel.json` functions matching pattern from `api/index.js` to `api/*.js` to ensure proper dynamic path matching across serverless modules.
- **Production Bundler Target:** Configured standard Vite production bundling parameters to handle chunk warnings and output a highly optimized 6.9MB client distribution alongside the esbuild compiled `server.cjs` backend.

### Removed
- **Redundant Scripts:** Moved temporary developer scripts (`fetch_api_data.cjs`, `fetch_apis.cjs`, `test_image_jpg.ts`, `test_local.ts`, `test_server.ts`, and `verify_microlink.js`) from the repository root into `_Trash/`.

---

## [1.1.0] - 2026-05-28

### Added
- **Enriched Veterinarian Roster:** Added **217 missing active veterinary officers** who were previously missing from the main active databases, expanding the catalog from 1,334 to **1,551 active officers** (HRMS ID validated).
- **Posting History Integration:** Reconciled **99 columns** for every single veterinarian, mapping detailed historical parameters for 1st through 9th postings (Designations, Places, Districts, Divisions, and Durations).
- **Demographics & Profile Attributes:** Integrated blood groups, permanent addresses, pin codes, cast/category designations, highest qualification profiles, and alternate mobile/WhatsApp numbers.
- **Order Linking Recovery:** Identified and merged **13 missing confirmed officer-to-order links** from staging records into the portal, bringing total cataloged database links from 841 to **854 items**.

### Changed
- **Master Sheet Seeding:** Completely refreshed the `Employees` tab inside `AVD_Master_Sheet.xlsx` with professional styling, HSL navy headers, and automatic sheet filtering.
- **JSON Serialization Fix:** Handled NumPy/Pandas native scalar type serializations inside raw JSON writers to prevent serialization errors.

### Cleaned
- **Duplicate Knowledge Base Removals:** Relocated `02. AVD_Staging/ARD_KnowledgeBase 2/` (an exact copy duplicate of the primary knowledge base) into `_Trash/`.
- **Duplicate Sheet Assets:** Moved identical staging file replicas (`employees_master.csv`, `officer_order_links.csv`, and `orders_master_index.csv`) and the outdated root `00. About_AVD/AVD_Master_Sheet.xlsx` backup to `_Trash/`.

---

## [1.0.0] - 2026-05-19

### Added
- **Interactive UI Portal:** Initialized a responsive Vite + React + TypeScript single page portal utilizing clean aesthetics, modern tailwind styling, custom loaders, and visual card decks.
- **Express Backend:** Configured a hybrid Node.js Express server to serve API routes, handle caching via node-cache, and integrate secure third-party communication layers.
- **Google Sheets Connector:** Formulated `/api/sync-sheet` which links and pushes metadata records to 6 master tabs: `Employees`, `Postings`, `Transfer Orders`, `Service Confirmations`, `Rules & Acts`, and `Admin Logins`.
- **Firebase Seeding Suite:** Designed an administrative `/api/seed-firestore` endpoint utilizing batched Firestore writes of 500 records to load initial master database schemas in seconds.
