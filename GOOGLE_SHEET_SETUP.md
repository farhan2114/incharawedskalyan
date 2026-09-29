# 📊 Google Spreadsheet Setup Guide for RSVP

This website connects to your Google Spreadsheet via a Google Apps Script Web App.
When guests submit their RSVP, it logs their response. When they click **"Edit my RSVP"**, it **updates their existing row in-place** rather than creating a duplicate new row!

---

## 🛠️ Step-by-Step Instructions:

### Step 1: Open or Create your Google Sheet
1. Go to [Google Sheets](https://sheets.new) and create a new sheet (e.g. named `Inchara & Kalyan Wedding RSVPs`).
2. In the first row, you can optionally set these headers (the script will also create them automatically if empty):
   - **Column A**: Timestamp
   - **Column B**: Name
   - **Column C**: Contact / Email
   - **Column D**: Guests
   - **Column E**: Haldi
   - **Column F**: Sangeet
   - **Column G**: Wedding
   - **Column H**: Attending Events
   - **Column I**: Declined Events
   - **Column J**: Note

---

### Step 2: Add the Google Apps Script
1. In your Google Sheet, click **Extensions** in the top menu $\rightarrow$ select **Apps Script**.
2. Delete any existing code in the editor (`Code.gs`) and paste the following code:

```javascript
/**
 * Google Apps Script for Wedding RSVP with In-Place Row Update
 * Automatically updates the existing row if the guest edits their RSVP!
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = JSON.parse(e.postData.contents);
    
    // Create header row if sheet is brand new
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp", "Name", "Contact / Email", "Guests", 
        "Haldi", "Sangeet", "Wedding", "Attending Events", "Declined Events", "Note"
      ]);
      sheet.getRange(1, 1, 1, 10).setFontWeight("bold").setBackground("#FFF3D6");
    }
    
    var contactToMatch = (data.originalEmail || data.contact || data.email || "").toString().trim().toLowerCase();
    var nameToMatch = (data.originalName || data.name || "").toString().trim().toLowerCase();
    
    var values = sheet.getDataRange().getValues();
    var rowIndexToUpdate = -1;
    
    // Search existing rows for matching Contact/Email (Col 3) or Name (Col 2)
    for (var i = 1; i < values.length; i++) {
      var rowContact = (values[i][2] || "").toString().trim().toLowerCase();
      var rowName = (values[i][1] || "").toString().trim().toLowerCase();
      
      if ((contactToMatch && rowContact === contactToMatch) || 
          (nameToMatch && rowName === nameToMatch)) {
        rowIndexToUpdate = i + 1; // 1-indexed row number
        break;
      }
    }
    
    var rowData = [
      new Date(),
      data.name,
      data.email || data.contact,
      data.guest_count || data.guestCount || 1,
      data.haldi || "No",
      data.sangeet || "No",
      data.wedding || "No",
      data.attending_events || data.attendingEvents || "None",
      data.declined_events || data.declinedEvents || "None",
      data.note || ""
    ];
    
    if (rowIndexToUpdate > 0) {
      // ✅ UPDATE THE SAME ROW!
      sheet.getRange(rowIndexToUpdate, 1, 1, rowData.length).setValues([rowData]);
    } else {
      // ➕ INSERT NEW ROW
      sheet.appendRow(rowData);
    }
    
    return ContentService.createTextOutput(JSON.stringify({ 
      status: "success", 
      updatedRow: rowIndexToUpdate > 0 ? rowIndexToUpdate : sheet.getLastRow(),
      isUpdate: rowIndexToUpdate > 0
    })).setMimeType(ContentService.MimeType.JSON);
    
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ status: "error", message: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}
```

---

### Step 3: Deploy as Web App
1. At the top right of the Apps Script page, click **Deploy** $\rightarrow$ **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" $\rightarrow$ choose **Web app**.
3. Fill in:
   - **Description**: `RSVP Webhook`
   - **Execute as**: `Me` (your Google account)
   - **Who has access**: **`Anyone`** (⚠️ **Crucial**: Must be "Anyone" so guests' browsers can send RSVPs without logging in to Google).
4. Click **Deploy**.
5. Grant permissions if prompted (click "Advanced" $\rightarrow$ "Go to RSVP Webhook (unsafe)").
6. Copy the **Web App URL** (starts with `https://script.google.com/macros/s/.../exec`).

---

### Step 4: Paste URL into the Wedding Config
Open `src/wedding.config.ts` and set your Web App URL under `rsvp`:
```ts
// src/wedding.config.ts
rsvp: {
  googleSheetWebhookUrl: 'YOUR_COPIED_WEB_APP_URL',
}
```

Your RSVPs will now automatically populate into your spreadsheet in real time, and whenever a guest edits their response, the exact same row gets updated!
