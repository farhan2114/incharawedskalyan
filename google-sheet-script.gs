/**
 * =======================================================================
 * 💍 INCHARA & KALYAN WEDDING — GOOGLE SHEETS RSVP WEBHOOK & DASHBOARD
 * =======================================================================
 * 
 * FEATURES:
 * 1. EXECUTIVE DASHBOARD WITH LIVE METRICS & FORMULAS (Nikhil-style):
 *    - Total Submissions
 *    - Total Headcount (All Guests)
 *    - Total Headcount for Haldi
 *    - Total Headcount for Sangeet
 *    - Total Headcount for Wedding
 *    - Event Breakdown (Parties Attending)
 * 
 * 2. INDEPENDENT EVENT COLUMNS (No merged events, No song suggestions):
 *    - Col A: Timestamp
 *    - Col B: Guest Name
 *    - Col C: Contact (Phone / Email)
 *    - Col D: Total Guests
 *    - Col E: Haldi (Yes / No)
 *    - Col F: Sangeet (Yes / No)
 *    - Col G: Wedding (Yes / No)
 *    - Col H: Warm Wishes / Blessings
 * 
 * 3. SMART IN-PLACE EDITING:
 *    - When a guest updates their RSVP, it finds their existing row (by contact or name)
 *      and updates that exact row in-place!
 *    - The dashboard metric formulas automatically recalculate instantly.
 * 
 * =======================================================================
 * HOW TO SET UP:
 * 1. Open Google Sheets -> Extensions -> Apps Script.
 * 2. Paste this entire code into Code.gs (replacing everything).
 * 3. Press Ctrl + S to save.
 * 4. In the toolbar function dropdown, select "setupSheet" and click "Run".
 *    (Grant Google permissions if prompted: Advanced -> Go to project (unsafe)).
 * 5. Click "Deploy" (top right) -> "New deployment" (or "Manage deployments" -> edit).
 *    - Type: Web app
 *    - Execute as: "Me"
 *    - Who has access: "Anyone" (CRITICAL: Do NOT choose "Only myself")
 *    - Click "Deploy" and copy the Web App URL.
 * =======================================================================
 */

var SHEET_NAME = "RSVP Responses";

var HEADERS = [
  "Timestamp",
  "Guest Name",
  "Contact (Phone / Email)",
  "Total Guests",
  "Haldi",
  "Sangeet",
  "Wedding",
  "Warm Wishes / Blessings"
];

/**
 * Normalizes phone numbers to digits only for accurate matching
 */
function cleanContact(c) {
  if (!c) return "";
  return String(c).trim().toLowerCase();
}

/**
 * Searches the sheet to find an existing row for this guest.
 * Returns the 1-based row number (e.g. 8, 9...) if found, or -1 if new.
 */
function findExistingRowIndex(sheet, data, startRow) {
  var lastRow = sheet.getLastRow();
  if (lastRow < startRow) return -1;

  var numRows = lastRow - startRow + 1;
  // Read Col B (Name) & Col C (Contact) from startRow to lastRow
  var values = sheet.getRange(startRow, 2, numRows, 2).getValues();

  var targetContact = cleanContact(data.contact || data.email || data.phone);
  var targetOrigContact = cleanContact(data.originalEmail || data.originalContact || data.original_phone);
  var targetName = cleanContact(data.name || data.fullName);
  var targetOrigName = cleanContact(data.originalName || data.original_name);

  // 1. Primary check: Contact / Email / Phone match (searches newest rows first)
  if (targetContact || targetOrigContact) {
    for (var i = values.length - 1; i >= 0; i--) {
      var rowContact = cleanContact(values[i][1]); // Col C
      if (rowContact && rowContact !== "-") {
        if (targetContact && (rowContact === targetContact || rowContact.replace(/\D/g, "") === targetContact.replace(/\D/g, ""))) {
          return startRow + i;
        }
        if (targetOrigContact && (rowContact === targetOrigContact || rowContact.replace(/\D/g, "") === targetOrigContact.replace(/\D/g, ""))) {
          return startRow + i;
        }
      }
    }
  }

  // 2. Secondary check: Name match
  if (targetName || targetOrigName) {
    for (var j = values.length - 1; j >= 0; j--) {
      var rowName = cleanContact(values[j][0]); // Col B
      if (rowName && rowName.length > 2) {
        if (targetName && rowName === targetName) {
          return startRow + j;
        }
        if (targetOrigName && rowName === targetOrigName) {
          return startRow + j;
        }
      }
    }
  }

  return -1; // New guest RSVP
}

/**
 * INITIALIZES THE LUXURY DASHBOARD & STYLED DATA TABLE
 * Run this from Apps Script editor!
 */
function setupSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getActiveSheet();
  sheet.clear();

  // Set column widths for optimal viewing
  sheet.setColumnWidth(1, 160); // Timestamp
  sheet.setColumnWidth(2, 190); // Guest Name
  sheet.setColumnWidth(3, 210); // Contact (Phone / Email)
  sheet.setColumnWidth(4, 110); // Total Guests
  sheet.setColumnWidth(5, 110); // Haldi
  sheet.setColumnWidth(6, 110); // Sangeet
  sheet.setColumnWidth(7, 110); // Wedding
  sheet.setColumnWidth(8, 320); // Warm Wishes / Blessings

  // =========================================================================
  // ROW 1: MASTER TITLE BANNER
  // =========================================================================
  sheet.getRange("A1:H1").merge()
    .setValue("✨ INCHARA & KALYAN — WEDDING CELEBRATIONS RSVP DASHBOARD ✨")
    .setBackground("#7D0A0A") // Royal Maroon
    .setFontColor("#FFDF78")  // Royal Gold
    .setFontFamily("Georgia")
    .setFontSize(13)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(1, 38);

  // =========================================================================
  // ROW 2: DASHBOARD METRIC LABELS (Nikhil-style)
  // =========================================================================
  sheet.getRange("A2:C2").merge().setValue("📊 TOTAL RESPONSES").setHorizontalAlignment("center");
  sheet.getRange("D2").setValue("👥 TOTAL GUESTS").setHorizontalAlignment("center");
  sheet.getRange("E2").setValue("💛 TOTAL FOR HALDI").setHorizontalAlignment("center");
  sheet.getRange("F2").setValue("🎶 TOTAL FOR SANGEET").setHorizontalAlignment("center");
  sheet.getRange("G2").setValue("💍 TOTAL FOR WEDDING").setHorizontalAlignment("center");
  sheet.getRange("H2").setValue("🎉 PARTIES ATTENDING (COUNT)").setHorizontalAlignment("center");

  // Style Metric Headers
  sheet.getRange("A2:C2").setBackground("#2C0707").setFontColor("#FFE5B4").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("D2").setBackground("#7D0A0A").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("E2").setBackground("#B8860B").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("F2").setBackground("#6A1B9A").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("G2").setBackground("#7D0A0A").setFontColor("#FFFFFF").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.getRange("H2").setBackground("#2C0707").setFontColor("#FFE5B4").setFontSize(9).setFontWeight("bold").setVerticalAlignment("middle");
  sheet.setRowHeight(2, 24);

  // =========================================================================
  // ROW 3: LIVE METRIC FORMULAS (Recalculate automatically with every RSVP)
  // =========================================================================
  sheet.getRange("A3:C3").merge().setFormula('=COUNTA(B8:B)');
  sheet.getRange("D3").setFormula('=SUM(D8:D)');
  sheet.getRange("E3").setFormula('=SUMIF(E8:E, "Yes", D8:D)'); // Total Headcount for Haldi
  sheet.getRange("F3").setFormula('=SUMIF(F8:F, "Yes", D8:D)'); // Total Headcount for Sangeet
  sheet.getRange("G3").setFormula('=SUMIF(G8:G, "Yes", D8:D)'); // Total Headcount for Wedding
  sheet.getRange("H3").setFormula('="Haldi: " & COUNTIF(E8:E, "Yes") & " | Sangeet: " & COUNTIF(F8:F, "Yes") & " | Wedding: " & COUNTIF(G8:G, "Yes")');

  // Format Metric Values
  var valRange = sheet.getRange("A3:H3");
  valRange.setFontFamily("Georgia")
    .setFontSize(15)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, "#8C6D37", SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(3, 34);

  // Custom Card Backgrounds
  sheet.getRange("A3:C3").setBackground("#FFFDF9").setFontColor("#2C0707");
  sheet.getRange("D3").setBackground("#FFF8E7").setFontColor("#7D0A0A").setFontSize(17); // Big Grand Total
  sheet.getRange("E3").setBackground("#FFFBEA").setFontColor("#8B6508").setFontSize(16); // Haldi Total
  sheet.getRange("F3").setBackground("#FBF4FF").setFontColor("#5B146F").setFontSize(16); // Sangeet Total
  sheet.getRange("G3").setBackground("#FFF0F2").setFontColor("#7D0A0A").setFontSize(16); // Wedding Total
  sheet.getRange("H3").setBackground("#FFFDF9").setFontColor("#2C0707").setFontSize(10);

  // Empty separator rows
  sheet.setRowHeight(4, 8);
  sheet.setRowHeight(5, 8);

  // =========================================================================
  // ROW 6: TABLE SECTION BANNER
  // =========================================================================
  sheet.getRange("A6:H6").merge()
    .setValue("  📋 DETAILED GUEST RESPONSES (SMART IN-PLACE UPDATING)")
    .setBackground("#F8F3EA")
    .setFontColor("#5A0707")
    .setFontFamily("Georgia")
    .setFontSize(10)
    .setFontWeight("bold")
    .setVerticalAlignment("middle");
  sheet.setRowHeight(6, 24);

  // =========================================================================
  // ROW 7: COLUMN HEADERS
  // =========================================================================
  sheet.getRange(7, 1, 1, HEADERS.length).setValues([HEADERS]);
  var headerRange = sheet.getRange("A7:H7");
  headerRange.setBackground("#7D0A0A") // Royal Maroon
    .setFontColor("#FFFFFF")
    .setFontFamily("Georgia")
    .setFontSize(10)
    .setFontWeight("bold")
    .setHorizontalAlignment("center")
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, "#FFDF78", SpreadsheetApp.BorderStyle.SOLID);
  sheet.setRowHeight(7, 30);

  // Freeze top 7 rows so dashboard & headers stay locked when scrolling
  sheet.setFrozenRows(7);

  // =========================================================================
  // ROW 8: SAMPLE TEST ROW
  // =========================================================================
  var testRow = [
    new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" }),
    "Sample Guest (Example)",
    "sample.guest@example.com",
    2,
    "Yes",
    "Yes",
    "Yes",
    "Heartiest congratulations to Inchara & Kalyan! Wishing you both a lifetime of happiness."
  ];

  sheet.appendRow(testRow);
  formatDataRow(sheet, 8, "Yes", "Yes", "Yes");

  Logger.log("🎉 SUCCESS! Dashboard initialized with live Haldi, Sangeet & Wedding totals!");
  return "SUCCESS: Dashboard initialized with live Haldi, Sangeet & Wedding totals!";
}

/**
 * Styles a guest row with clean fonts and colorful badges for attendance
 */
function formatDataRow(sheet, rowNum, haldi, sangeet, wedding) {
  var rowRange = sheet.getRange(rowNum, 1, 1, 8);
  rowRange.setFontFamily("Arial")
    .setFontSize(10)
    .setVerticalAlignment("middle")
    .setBorder(true, true, true, true, true, true, "#E0E0E0", SpreadsheetApp.BorderStyle.SOLID);

  sheet.setRowHeight(rowNum, 28);

  // Center Total Guests & Event columns
  sheet.getRange(rowNum, 4, 1, 4).setHorizontalAlignment("center");
  sheet.getRange(rowNum, 4).setFontWeight("bold"); // Bold total guests

  // Badge colors for Haldi (Col E)
  var cellHaldi = sheet.getRange(rowNum, 5);
  if (haldi === "Yes") {
    cellHaldi.setBackground("#FFF9C4").setFontColor("#F57F17").setFontWeight("bold"); // Yellow badge
  } else {
    cellHaldi.setBackground("#F5F5F5").setFontColor("#9E9E9E");
  }

  // Badge colors for Sangeet (Col F)
  var cellSangeet = sheet.getRange(rowNum, 6);
  if (sangeet === "Yes") {
    cellSangeet.setBackground("#F3E5F5").setFontColor("#6A1B9A").setFontWeight("bold"); // Purple badge
  } else {
    cellSangeet.setBackground("#F5F5F5").setFontColor("#9E9E9E");
  }

  // Badge colors for Wedding (Col G)
  var cellWedding = sheet.getRange(rowNum, 7);
  if (wedding === "Yes") {
    cellWedding.setBackground("#FFEBEE").setFontColor("#C62828").setFontWeight("bold"); // Rose badge
  } else {
    cellWedding.setBackground("#F5F5F5").setFontColor("#9E9E9E");
  }
}

/**
 * Ensures table structure exists before receiving webhooks
 */
function ensureInitialized(sheet) {
  if (sheet.getLastRow() < 7 || sheet.getRange(7, 1).getValue() !== "Timestamp") {
    setupSheet();
  }
}

/**
 * Handles RSVP submissions and edits from the website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(10000);

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    ensureInitialized(sheet);

    var data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Determine if data starts at row 8 (dashboard mode) or row 2 (flat mode)
    var startRow = 8;
    if (sheet.getRange(1, 1).getValue() === "Timestamp") {
      startRow = 2;
    } else if (sheet.getRange(7, 1).getValue() === "Timestamp") {
      startRow = 8;
    }

    var baseTimestamp = data.timestamp ? new Date(data.timestamp).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }) : new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    var name = (data.name || data.fullName || "-").toString().trim();
    var contact = (data.contact || data.email || data.phone || "-").toString().trim();
    var guestCount = Number(data.guest_count !== undefined ? data.guest_count : (data.guestCount || 1));

    // Independent event attendance (Yes / No)
    var haldi = (data.haldi === "Yes" || data.haldi === "yes" || (data.attending_events && data.attending_events.indexOf("Haldi") !== -1)) ? "Yes" : "No";
    var sangeet = (data.sangeet === "Yes" || data.sangeet === "yes" || (data.attending_events && data.attending_events.indexOf("Sangeet") !== -1)) ? "Yes" : "No";
    var wedding = (data.wedding === "Yes" || data.wedding === "yes" || (data.attending_events && data.attending_events.indexOf("Wedding") !== -1)) ? "Yes" : "No";

    var note = (data.note || data.warm_wishes || data.message || "-").toString().trim();

    // Check for existing RSVP (Smart In-Place Edit)
    var existingRow = findExistingRowIndex(sheet, data, startRow);
    var isUpdate = (existingRow > 0);
    var targetRow = isUpdate ? existingRow : Math.max(startRow, sheet.getLastRow() + 1);
    var displayTimestamp = isUpdate ? (baseTimestamp + " (Edited)") : baseTimestamp;

    var rowValues = [
      displayTimestamp,
      name,
      contact,
      guestCount,
      haldi,
      sangeet,
      wedding,
      note
    ];

    sheet.getRange(targetRow, 1, 1, rowValues.length).setValues([rowValues]);
    formatDataRow(sheet, targetRow, haldi, sangeet, wedding);

    SpreadsheetApp.flush();

    var actionTaken = isUpdate ? "updated" : "created";
    Logger.log("RSVP " + actionTaken + " successfully at row " + targetRow + " for " + name);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      action: actionTaken,
      message: isUpdate ? "RSVP updated in same row in Google Sheets" : "RSVP recorded in Google Sheets",
      name: name,
      rowNumber: targetRow
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log("Error in doPost: " + error.toString());
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint for testing in browser
 */
function doGet(e) {
  return ContentService.createTextOutput("💍 Inchara & Kalyan Wedding RSVP Webhook is ACTIVE and connected! Ready to receive RSVPs.")
    .setMimeType(ContentService.MimeType.TEXT);
}
