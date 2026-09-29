# 💍 Inchara & Kalyan Wedding — Google Sheets Dashboard & RSVP Setup Guide

This guide explains how to set up your Google Sheet with the **Nikhil-style Executive Dashboard**, **live event totals (Haldi, Sangeet, Wedding)**, and **Smart In-Place RSVP Row Updates**.

---

### Key Features of this Setup:
1. **Executive Dashboard (Rows 1–3)**:
   - **Total Responses**: `=COUNTA(B8:B)`
   - **Total Guests (Headcount)**: `=SUM(D8:D)`
   - **Total for Haldi**: `=SUMIF(E8:E, "Yes", D8:D)` *(Live headcount attending Haldi)*
   - **Total for Sangeet**: `=SUMIF(F8:F, "Yes", D8:D)` *(Live headcount attending Sangeet)*
   - **Total for Wedding**: `=SUMIF(G8:G, "Yes", D8:D)` *(Live headcount attending Wedding)*
   - **Parties Attending Breakdown**: Live count of parties per event
2. **Dedicated Event Columns (Rows 7+)**:
   - `Timestamp`
   - `Guest Name`
   - `Contact (Phone / Email)`
   - `Total Guests`
   - `Haldi` *(Yes / No with yellow badge styling)*
   - `Sangeet` *(Yes / No with purple badge styling)*
   - `Wedding` *(Yes / No with rose badge styling)*
   - `Warm Wishes / Blessings`
   *(No merged events column, No song suggestions!)*
3. **Smart In-Place Editing**:
   - When a guest edits their RSVP on the website, it locates their existing row by email/phone or name and **updates that exact row** instead of creating a duplicate.
   - All live formulas in the dashboard immediately recalculate!

---

### Step 1: Open Google Sheets Apps Script
1. Open your **Google Sheet** for Inchara & Kalyan's wedding.
2. In the top menu, click **Extensions** > **Apps Script**.
3. Select all existing text in the editor (`Code.gs`) and delete it.

---

### Step 2: Paste the Master Script
1. Open [`google-sheet-script.gs`](./google-sheet-script.gs) in this repository.
2. Copy the entire contents of [`google-sheet-script.gs`](./google-sheet-script.gs) and paste it into the Apps Script editor.
3. Click the 💾 **Save** icon (or press `Ctrl+S`).

---

### Step 3: Run `setupSheet`
1. In the toolbar at the top of Apps Script, find the function dropdown menu (it currently says `doPost`).
2. Click the dropdown and select **`setupSheet`**.
3. Click **▶ Run**.
4. *(If prompted, click "Review permissions", select your Google account, click "Advanced" > "Go to Untitled project (unsafe)", and click "Allow")*.
5. Switch back to your Google Sheet:
   - You will see the **Executive Dashboard** at the top with:
     - Master Title Banner in Royal Maroon & Gold
     - Live metric cards showing **Total Responses**, **Total Guests**, **Total for Haldi**, **Total for Sangeet**, and **Total for Wedding**
     - Table headers in Row 7 in Royal Maroon
     - Sample test row at Row 8 with badge styling
     - Top 7 rows frozen so the dashboard stays visible as you scroll!

---

### Step 4: Deploy as Webhook
1. In Apps Script, click the blue **Deploy** button (top right) and choose **Manage deployments** (or **New deployment**).
2. If updating an existing deployment:
   - Click the ✏️ **Edit** icon next to the active deployment.
   - Set **Version** to: **`New version`**.
3. If creating a new deployment:
   - Click **Select type** (gear icon) > **Web app**.
   - Description: `Inchara & Kalyan RSVP Webhook`
4. **CRITICAL SETTINGS**:
   - **Execute as**: `Me (your email)`
   - **Who has access**: `Anyone` *(DO NOT select "Only myself" or the website cannot send RSVPs)*.
5. Click **Deploy**.
6. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 5: (Optional) Update Webhook URL in Project
If you generated a brand new Web App URL, paste it into [`src/wedding.config.ts`](./src/wedding.config.ts) and [`src/lib/supabase.ts`](./src/lib/supabase.ts):
```ts
export const GOOGLE_SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec';
```
Then commit and push!
