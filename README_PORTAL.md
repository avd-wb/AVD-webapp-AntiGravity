# WBAH&VS Member Portal & Orders Repository - Live Integration Guide

Welcome! I have successfully integrated the **Member Portal & Orders Repository** directly into your downloaded React + Vite + TypeScript + Tailwind CSS v4 codebase! 

The application is now 100% fully functional and responsive offline and locally. The portal uses real seed databases compiled into high-speed JSON stores inside `src/data/` representing the actual roster of 1,551 veterinarians and 1,325 cataloged government orders!

---

## 🛠️ Codebase Modifications & Additions

I have cleanly integrated the new pages and database stores without disturbing your existing code:

1. **[NEW] [src/pages/Portal.tsx](src/pages/Portal.tsx)**: 
   * A premium React + TypeScript component.
   * Matches the visual styles and animation parameters of your homepage.
   * Renders the **Employee Sign-In Dashboard** (with direct test-account sandbox shortcuts).
   * Renders a highly-detailed **Officer Profile Card** (DOB, DOJ, DOB, mobile, email, council registration).
   * Renders a **Personalized Timeline** showing confirmed, CAS/MCAS, and transfer orders matching the logged-in doctor.
   * Renders a **General Orders Repository** table supporting keyword searches, order category dropdown filters, sorting, and direct Drive PDF download triggers.
2. **[NEW] Local JSON Database Seeds**:
   * [src/data/employees_master.json](src/data/employees_master.json): Consolidated list of all 1,551 active WBAH&VS officers.
   * [src/data/orders_master_index.json](src/data/orders_master_index.json): Unified catalog of all 1,325 cataloged orders.
   * [src/data/employee_order_links.json](src/data/employee_order_links.json): Map of matched roster-to-document links.
3. **[MODIFIED] [src/App.tsx](src/App.tsx)**: Registered the new `/portal` route inside the central router and wrapped it under the global `Layout`.
4. **[MODIFIED] [src/components/Header.tsx](src/components/Header.tsx)**: Added a "Member Portal" page link to the desktop and mobile menus, and mounted a beautiful saffron CTA button on the right side of the desktop navbar.

---

## 🚀 How to Run and Test Locally

To run the application on your computer and test the portal:

1. Open your terminal, navigate to the codebase directory, and install dependencies:
   ```bash
   cd "/Users/nirmalyaranjansarkar/Downloads/-LIVE--AVD-GAIS-main"
   npm install
   ```
2. Start the local Vite development server:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:5173/portal` (or click **Member Portal** in the header navigation menu).
4. **Sandbox Testing**: In the sign-in section, click one of the sandbox buttons (e.g. *Dr. A.H.M. Abidur Rahaman* or *Dr. Abani Kanta Chand*) to instantly login, view their actual real-world service profile, and interact with their actual service confirmation and transfer order timelines!

---

## 🤖 How to Interact with Google AI Studio (GAIS)

Since you communicate with Google AI Studio primarily via prompts and by uploading codebase files, here are the exact files to upload and the prompts to paste to achieve the next phases:

### 1. Connecting the Portal to a Live Firebase Firestore Database
> **Files to Upload to AI Studio:**
> * `src/pages/Portal.tsx`
> * `package.json`
> 
> **Prompt to Paste in AI Studio:**
> ```
> I have uploaded 'src/pages/Portal.tsx' which currently pulls the roster, index, and order links from local JSON files.
> I want to shift this page to pull dynamically from a live Cloud Firestore database when a user signs in.
> Using the Firebase configuration already present in package.json, help me write a React Custom Hook or helper file (e.g., 'src/lib/firebasePortal.ts') that:
> 1. Initializes Firebase Auth.
> 2. Queries the 'employees' Firestore collection for the signed-in user's profile card details.
> 3. Queries the 'officer_order_links' collection where 'hrms_id' matches the user's uid to list their personal order timeline.
> 4. Queries the 'orders' collection to populate the general repository list, supporting client-side filtering.
> Show me the exact code to drop into 'src/pages/Portal.tsx' to replace the local JSON imports.
> ```

### 2. Auto-generating a Node.js Seed Script
> **Prompt to Paste in AI Studio:**
> ```
> Based on our local JSON database seeds, help me write a Node.js seed script 'seed_firestore.js' to upload our 1,551 employee records, 1,325 order records, and 854 linking maps to a live Firebase Firestore instance. Use batch writes in blocks of 500 records to prevent Firestore rate limits.
> ```
