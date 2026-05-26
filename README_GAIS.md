# AVD Member Portal — Google AI Studio (GAIS) Maintenance Guide

Respectful Greetings! You are assisting in the maintenance and iterative evolution of the **AVD Member Portal (West Bengal Animal Husbandry & Veterinary Services)**.

This codebase is a hybrid Vite + React + TypeScript frontend integrated with an Express serverless backend optimized to run **100% on Free Tier resources** (Vercel Hobby, Firebase/Firestore Spark, and Google Drive).

---

## 1. Unified Architecture & Single Source of Truth

The system partitions data so that binary files stay on Google Drive, and only text metadata is stored in Cloud Firestore:

1. **Storage (Google Drive - 5 TB free space)**:
   - Contains a Master Google Sheet `AVD_Master_Sheet.xlsx` with six core tabs: `Employees`, `Postings`, `Transfer Orders`, `Service Confirmations`, `Rules & Acts`, `Admin Logins`.
   - Contains an `Orders_PDFs/` folder hosting PDF, JPG, and PNG documents.
2. **Database & Auth (Firebase Cloud Firestore & Auth - Spark Free Tier)**:
   - Firestore holds lightweight collections: `employees`, `orders`, `employee_order_links`.
   - Firebase Auth manages standard user logins and administrator permissions.
3. **Hosting & Cron Serverless Engine (Vercel - Hobby Free Tier)**:
   - Houses the frontend Single Page App.
   - Triggers the automated daily sync at 5:00 PM (`/api/sync-sheet`) to read the Google Sheet, organize staged files, and upload metadata to Firestore.
   - Provides a one-click database seeder (`/api/seed-firestore`) to bulk-seed Firestore from local JSON assets.

---

## 2. Directory Structure Mappings

* `/src/pages/Portal.tsx`: The primary member dashboard, timeline compiler, responsive directory, and administrative insights console.
* `/src/lib/firebase.ts`: Initializes Firebase Auth and Firestore, and provides client-side database query wrappers.
* `/server.ts`: The Express backend containing scrapers, staging synchronizers, Google Drive link builders, and bulk-seeding controllers.
* `/api/index.ts`: Exposes the Express monolithic server to Vercel's serverless environment.
* `/vercel.json`: Handles routing rewrites and sets up the daily 5:00 PM cron schedule.
* `/firebase-applet-config.json`: Project identifiers for Firebase.
* `/src/data/`: Backups and seed JSON files (`employees_master.json`, `orders_master_index.json`, `employee_order_links.json`).

---

## 3. Maintenance Protocols for GAIS

When requested to add features, refine layouts, or adapt sync logic:
1. **Maintain Free-Tier Boundaries**: Ensure heavy files are never uploaded directly to Firestore or Vercel. Always generate Google Drive public URLs and index them as text metadata inside Firestore docs.
2. **Uphold Mobile-First USABILITY**: 99% of veterinary officers access this portal on mobile. Always enforce stacked responsive cards (`block md:hidden`) on mobile and keep tables restricted to desktop (`hidden md:block`). Enforce horizontal swipe bars for scrollable nav buttons without wrapping.
3. **Safe Serverless Writes**: Ensure all Firestore write blocks are wrapped in graceful try-catch statements, logging warning events in `/api/sync-sheet` logs without halting execution.
4. **Preserve Roster Seniority & Tenure Rules**:
   - Rotational transfers are due after **3.0 years** at a single station.
   - Retirement countdown is computed as **DOB + 60 years**.
   - MCAS benefits occur at **8-year** (Scale 1) and **15-year** (Scale 2) career milestones.
