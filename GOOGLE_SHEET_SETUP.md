# 💍 Inchara & Kalyan Wedding — Google Sheets Setup Guide

Follow these quick steps to format your Google Sheet with **Royal Maroon headers** and enable **Smart In-Place RSVP Row Updates** (just like Hanisha's spreadsheet). When a guest edits their RSVP on the website, it will automatically find and update their existing row instead of adding a duplicate row.

---

### Step 1: Open Google Sheets Apps Script
1. Open your **Google Sheet** for Inchara & Kalyan's wedding RSVPs.
2. In the top menu, click **Extensions** > **Apps Script**.
3. Clear out whatever code is currently in the editor (`Code.gs`).

---

### Step 2: Paste the Master Script
1. Open [`google-sheet-script.gs`](./google-sheet-script.gs) in this project folder.
2. Copy the entire contents of [`google-sheet-script.gs`](./google-sheet-script.gs) and paste it into the Apps Script editor.
3. Click the 💾 **Save** icon (or press `Ctrl+S`).

---

### Step 3: Run `setupSheet` (Formats Headers Like Hanisha)
1. In the toolbar at the top of Apps Script, locate the function dropdown menu (it currently says `doPost`).
2. Click the dropdown and select **`setupSheet`**.
3. Click **▶ Run**.
4. *(If prompted, click "Review permissions", select your Google account, click "Advanced" > "Go to Untitled project (unsafe)", and click "Allow")*.
5. Switch back to your Google Sheet:
   - You will see Row 1 formatted in **Royal Maroon & White** with all 10 columns:
     `Timestamp`, `Guest Name`, `Email / Contact`, `Total Guests`, `Haldi`, `Sangeet`, `Wedding Ceremony`, `Attending Events`, `Declined Events`, `Warm Wishes / Notes`.
   - A sample test row will also be added and column widths will be neatly adjusted!

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
If you generated a brand new Web App URL, paste it into [`src/wedding.config.ts`](./src/wedding.config.ts) under `rsvp`:
```ts
rsvp: {
  googleSheetWebhookUrl: 'https://script.google.com/macros/s/YOUR_NEW_DEPLOYMENT_ID/exec',
},
```
Then save and push to GitHub!

---

### How It Works:
- **First submission**: Appends a clean new row to the sheet.
- **Editing RSVP**: When the user clicks "Edit my RSVP" on the website and submits changes, the script matches their email/contact or name, **replaces the exact same row in-place**, and appends `(Edited)` to the timestamp. No duplicate rows!
