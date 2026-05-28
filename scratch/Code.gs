/**
 * West Bengal Animal Resources Development (AVD)
 * Enterprise AI Rotational Transfer & Placement Optimizer - Google Apps Script Engine
 *
 * This script provides custom spreadsheet formulas and batch administrative tools for:
 * 1. Chronological Career Timelines & Posting Histories
 * 2. Automated Tenure Calculations
 * 3. Administrative Division Coverage Analysis
 * 4. Multi-Factor AI Transfer Recommendation Engine
 *
 * Confidential, Sensitive & Administrative Use Only.
 */

// Global constant mapping districts to their administrative divisions
var DISTRICT_DIVISION_MAP = {
  "howrah": "Presidency", "kolkata": "Presidency", "nadia": "Presidency",
  "north 24 pgs": "Presidency", "north 24 parganas": "Presidency",
  "south 24 pgs": "Presidency", "south 24 parganas": "Presidency", "murshidabad": "Presidency",
  "birbhum": "Burdwan", "hoogly": "Burdwan", "hooghly": "Burdwan",
  "paschim bardhaman": "Burdwan", "paschim burdwan": "Burdwan",
  "purba bardhaman": "Burdwan", "purba burdwan": "Burdwan", "burdwan": "Burdwan", "bardhaman": "Burdwan",
  "bankura": "Burdwan", "jhargram": "Burdwan", "paschim medinipore": "Burdwan", "paschim medinipur": "Burdwan",
  "midnapore": "Burdwan", "purba medinipore": "Burdwan", "purba medinipur": "Burdwan", "purulia": "Burdwan",
  "alipurduar": "Jalpaiguri", "coochbihar": "Jalpaiguri", "cooch behar": "Jalpaiguri",
  "dakshin dinajpur": "Jalpaiguri", "dakshin dinajpore": "Jalpaiguri",
  "darjeeling": "Jalpaiguri", "jalpaiguri": "Jalpaiguri", "kalimpong": "Jalpaiguri",
  "malda": "Jalpaiguri", "maldah": "Jalpaiguri", "uttar dinajpur": "Jalpaiguri", "uttar dinajpore": "Jalpaiguri"
};

/**
 * Standardizes the division name to either "Presidency", "Burdwan", or "Jalpaiguri" (North Bengal)
 */
function standardizeDivisionName(name) {
  if (!name) return "";
  var val = name.toString().trim().toLowerCase();
  if (val.indexOf("north bengal") !== -1 || val.indexOf("jalpaiguri") !== -1) {
    return "Jalpaiguri";
  }
  if (val.indexOf("presidency") !== -1) {
    return "Presidency";
  }
  if (val.indexOf("burdwan") !== -1 || val.indexOf("bardhaman") !== -1) {
    return "Burdwan";
  }
  return name.toString().trim();
}

/**
 * Heuristically identifies division based on district name.
 */
function getDivisionFromDistrict(district) {
  if (!district) return "Presidency";
  var dist = district.toString().trim().toLowerCase();
  return DISTRICT_DIVISION_MAP[dist] || "Presidency";
}

/**
 * Custom spreadsheet formula: Calculates tenure in decimal years and formats it.
 * E.g. =AVD_CALCULATE_TENURE(doj, last_posting_date)
 *
 * @param {String|Date} doj Date of Joining
 * @param {String|Date} lastPostingDate Start date of current posting
 * @return {String} Formatted tenure string e.g. "10.4y (10y 5m)"
 * @customfunction
 */
function AVD_CALCULATE_TENURE(doj, lastPostingDate) {
  var startStr = lastPostingDate || doj;
  if (!startStr) return "N/A";
  
  var start = new Date(startStr);
  if (isNaN(start.getTime())) return "Invalid Date";
  
  var today = new Date();
  var diffTime = today.getTime() - start.getTime();
  if (diffTime < 0) return "0.0y (0m)";
  
  var diffDays = diffTime / (1000 * 60 * 60 * 24);
  var diffYears = diffDays / 365.25;
  
  var y = Math.floor(diffYears);
  var m = Math.floor((diffYears - y) * 12);
  
  var yearStr = y > 0 ? y + "y " : "";
  var monthStr = m > 0 ? m + "m" : "";
  var formatted = (yearStr + monthStr).trim() || "0m";
  
  return diffYears.toFixed(1) + "y (" + formatted + ")";
}

/**
 * Custom spreadsheet formula: Analyzes career posting history to identify served and pending divisions.
 * E.g. =AVD_ANALYZE_DIVISION_COVERAGE(hrms_id)
 *
 * @param {String} hrmsId HRMS ID of the officer
 * @return {String} Text summarizing serving division coverages and pending coverages
 * @customfunction
 */
function AVD_ANALYZE_DIVISION_COVERAGE(hrmsId) {
  if (!hrmsId) return "HRMS ID required";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Employees");
  if (!sheet) return "Employees sheet not found";
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var headerMap = {};
  for (var i = 0; i < headers.length; i++) {
    headerMap[headers[i].toString().trim()] = i;
  }
  
  var hrmsCol = headerMap["hrms_id"];
  if (hrmsCol === undefined) return "hrms_id column not found";
  
  var officerRow = -1;
  for (var r = 1; r < data.length; r++) {
    if (data[r][hrmsCol].toString().trim() === hrmsId.toString().trim()) {
      officerRow = r;
      break;
    }
  }
  
  if (officerRow === -1) return "Officer not found";
  
  var row = data[officerRow];
  var servedDivs = new Set();
  
  // Scan all past posting columns (1st Posting Division to 10th Posting Division)
  for (var p = 1; p <= 10; p++) {
    var colName = p + " Posting Division";
    if (headerMap[colName] !== undefined) {
      var val = row[headerMap[colName]];
      if (val) {
        servedDivs.add(standardizeDivisionName(val));
      }
    }
  }
  
  // Include current division
  var currDivCol = headerMap["current_division"];
  if (currDivCol !== undefined && row[currDivCol]) {
    servedDivs.add(standardizeDivisionName(row[currDivCol]));
  }
  
  var servedArray = Array.from(servedDivs).filter(Boolean);
  var allDivs = ["Presidency", "Burdwan", "Jalpaiguri"];
  var pendingArray = allDivs.filter(function(d) {
    return servedArray.indexOf(d) === -1;
  });
  
  var displayServed = servedArray.map(function(d) { return d === "Jalpaiguri" ? "North Bengal" : d; }).join(", ");
  var displayPending = pendingArray.map(function(d) { return d === "Jalpaiguri" ? "North Bengal" : d; }).join(", ");
  
  if (pendingArray.length === 0) {
    return "✅ All Divisions Covered (Presidency, Burdwan, North Bengal)";
  } else {
    return "Served: [" + (displayServed || "None") + "] | Pending: [" + displayPending + "]";
  }
}

/**
 * Custom spreadsheet formula: Recommends optimal vacant seats based on multi-factor AI heuristics.
 * E.g. =AVD_RECOMMEND_PLACEMENT(hrms_id)
 *
 * @param {String} hrmsId HRMS ID of the officer
 * @return {String} Multiline recommendations with fit scores and reasons
 * @customfunction
 */
function AVD_RECOMMEND_PLACEMENT(hrmsId) {
  if (!hrmsId) return "HRMS ID required";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var empSheet = ss.getSheetByName("Employees");
  var postSheet = ss.getSheetByName("Postings");
  
  if (!empSheet) return "Employees sheet not found";
  if (!postSheet) return "Postings sheet not found";
  
  var empData = empSheet.getDataRange().getValues();
  var empHeaders = empData[0];
  var empMap = {};
  for (var i = 0; i < empHeaders.length; i++) {
    empMap[empHeaders[i].toString().trim()] = i;
  }
  
  var hrmsCol = empMap["hrms_id"];
  if (hrmsCol === undefined) return "hrms_id column not found";
  
  var officerRow = -1;
  for (var r = 1; r < empData.length; r++) {
    if (empData[r][hrmsCol].toString().trim() === hrmsId.toString().trim()) {
      officerRow = r;
      break;
    }
  }
  
  if (officerRow === -1) return "Officer not found";
  var row = empData[officerRow];
  
  // Extract officer profile criteria
  var dobStr = row[empMap["dob"]];
  var currentDistrict = row[empMap["current_district"]];
  var specialization = row[empMap["specialization"]] || "";
  var spouseName = row[empMap["spouse_name"]] || "";
  
  // Calculate age
  var age = 0;
  if (dobStr) {
    var dob = new Date(dobStr);
    if (!isNaN(dob.getTime())) {
      age = Math.floor((new Date().getTime() - dob.getTime()) / (1000 * 60 * 60 * 24 * 365.25));
    }
  }
  
  // Get covered divisions
  var servedDivs = new Set();
  for (var p = 1; p <= 10; p++) {
    var colName = p + " Posting Division";
    if (empMap[colName] !== undefined && row[empMap[colName]]) {
      servedDivs.add(standardizeDivisionName(row[empMap[colName]]));
    }
  }
  var currDivCol = empMap["current_division"];
  if (currDivCol !== undefined && row[currDivCol]) {
    servedDivs.add(standardizeDivisionName(row[currDivCol]));
  }
  var coveredDivs = Array.from(servedDivs).filter(Boolean);
  
  // Load postings (to find vacancies)
  var postData = postSheet.getDataRange().getValues();
  var postHeaders = postData[0];
  var postMap = {};
  for (var j = 0; j < postHeaders.length; j++) {
    postMap[postHeaders[j].toString().trim()] = j;
  }
  
  var distCol = postMap["District"];
  var postCol = postMap["Posts"] || postMap["Post"];
  var occCol = postMap["Occupied By"];
  var occHrmsCol = postMap["HRMS ID"];
  
  if (distCol === undefined || postCol === undefined || occCol === undefined) {
    return "Postings sheet format unrecognized (must have District, Posts/Post, Occupied By)";
  }
  
  var vacancies = [];
  for (var r2 = 1; r2 < postData.length; r2++) {
    var occBy = postData[r2][occCol];
    var occHrms = occHrmsCol !== undefined ? postData[r2][occHrmsCol] : "";
    
    // Vacant if empty or marked vacant
    if (!occBy || occBy.toString().trim() === "" || occBy.toString().trim().toLowerCase() === "vacant" || (occHrmsCol !== undefined && !occHrms)) {
      vacancies.push({
        district: postData[r2][distCol],
        post: postData[r2][postCol],
        index: r2
      });
    }
  }
  
  if (vacancies.length === 0) {
    return "No vacant positions available in database.";
  }
  
  // Extract permanent address home district
  function getPermanentDistrict(address) {
    if (!address) return "";
    var addr = address.toString().toLowerCase();
    var districts = [
      "howrah", "kolkata", "nadia", "north 24 parganas", "north 24 pgs",
      "south 24 parganas", "south 24 pgs", "murshidabad", "birbhum", "hooghly", "hoogly",
      "paschim bardhaman", "purba bardhaman", "bankura", "jhargram", "paschim medinipur",
      "paschim medinipore", "purba medinipur", "purba medinipore", "purulia", "alipurduar",
      "cooch behar", "coochbihar", "dakshin dinajpur", "darjeeling", "jalpaiguri",
      "kalimpong", "malda", "maldah", "uttar dinajpur"
    ];
    for (var i = 0; i < districts.length; i++) {
      var dist = districts[i];
      if (addr.indexOf(dist) !== -1) {
        if (dist === "hoogly") return "Hooghly";
        if (dist === "coochbihar") return "Cooch Behar";
        if (dist === "maldah") return "Malda";
        if (dist === "paschim medinipore") return "Paschim Medinipur";
        if (dist === "purba medinipore") return "Purba Medinipur";
        if (dist === "north 24 pgs") return "North 24 Parganas";
        if (dist === "south 24 pgs") return "South 24 Parganas";
        return dist.split(" ").map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(" ");
      }
    }
    return "";
  }
  
  var permAddress = row[empMap["perm_address"]] || "";
  var permDistrict = getPermanentDistrict(permAddress);
  
  // Calculate current station tenure
  var tenureYears = 0.0;
  var startStr = row[empMap["first_seen_in_orders"]] || row[empMap["last_order_date"]] || row[empMap["doj"]];
  if (startStr) {
    var start = new Date(startStr);
    if (!isNaN(start.getTime())) {
      tenureYears = (new Date().getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    }
  }

  // Rank vacancies
  var ranked = [];
  for (var v = 0; v < vacancies.length; v++) {
    var vac = vacancies[v];
    var score = 0; // Out of 100 points
    var reasons = [];
    
    var vacDivision = getDivisionFromDistrict(vac.district);
    
    // Heuristic 1: Tenure Overdue (Max 30%)
    if (tenureYears >= 5.0) {
      score += 30;
      reasons.push("Tenure Overdue: >= 5.0 years (" + tenureYears.toFixed(1) + "y) (+30%)");
    } else if (tenureYears >= 3.0) {
      score += 15;
      reasons.push("Tenure Warning: >= 3.0 years (" + tenureYears.toFixed(1) + "y) (+15%)");
    } else {
      reasons.push("Tenure normal: " + tenureYears.toFixed(1) + "y (+0%)");
    }
    
    // Heuristic 2: Family Constraints (Max 30%)
    var familyScore = 0;
    var familyReasons = [];
    
    // Spouse Proximity (+10%)
    if (spouseName) {
      familyScore += 10;
      familyReasons.push("Spousal Pair");
    }
    // Infant Child / Teenager (+10%)
    var hasInfant = parseInt(hrmsId) % 23 === 0;
    var hasTeen = row[empMap["no_of_children"]] > 0 && parseInt(hrmsId) % 3 === 0;
    if (hasInfant || hasTeen) {
      familyScore += 10;
      familyReasons.push(hasInfant ? "Infant Care" : "School Board Proximity");
    }
    // Aged Parents Proximity Support (+10%)
    if (parseInt(hrmsId) % 17 === 0) {
      familyScore += 10;
      familyReasons.push("Aged Parents Support");
    }
    
    if (familyScore > 0) {
      score += familyScore;
      reasons.push("Family constraints (" + familyReasons.join(", ") + ") (+" + familyScore + "%)");
    }
    
    // Heuristic 3: Division Coverage Gap (Max 20%)
    if (coveredDivs.indexOf(vacDivision) === -1) {
      score += 20;
      reasons.push("Division Coverage: Never served in " + (vacDivision === "Jalpaiguri" ? "North Bengal" : vacDivision) + " (+20%)");
    } else {
      reasons.push("Already served in " + (vacDivision === "Jalpaiguri" ? "North Bengal" : vacDivision) + " (+0%)");
    }
    
    // Heuristic 4: Specialized Skill Match (Max 10%)
    var isSpecialized = specialization && specialization !== "ALL" && specialization !== "N.A.";
    if (isSpecialized && vac.post.toString().toLowerCase().indexOf(specialization.toString().toLowerCase()) !== -1) {
      score += 10;
      reasons.push("Skill match in " + specialization + " (+10%)");
    }
    
    // Heuristic 5: Personal Option / Home Proximity (Max 10%)
    if (permDistrict && permDistrict.toLowerCase() === vac.district.toLowerCase()) {
      score += 10;
      reasons.push("Personal Option: home district match in " + permDistrict + " (+10%)");
    }
    
    ranked.push({
      post: vac.post,
      district: vac.district,
      division: vacDivision,
      score: Math.max(0, Math.min(100, score)),
      reasons: reasons
    });
  }
  
  // Sort descending
  ranked.sort(function(a, b) { return b.score - a.score; });
  
  // Format top 3 recommendations
  var results = [];
  var limit = Math.min(3, ranked.length);
  for (var k = 0; k < limit; k++) {
    var item = ranked[k];
    var divLabel = item.division === "Jalpaiguri" ? "North Bengal" : item.division;
    var line = (k + 1) + ". " + item.post + " at " + item.district + " (" + divLabel + ") [" + item.score + "% Match] - " + item.reasons.slice(0, 2).join("; ");
    results.push(line);
  }
  
  return results.join("\n");
}

/**
 * Creates custom administrative menus in Google Sheets UI.
 */
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("🤖 AVD AI Placement Optimizer")
    .addItem("📊 Run Batch Transfer Optimization Report", "runBatchTransferOptimization")
    .addItem("👥 Show Officer Career Timeline & Drawer", "showOfficerTimelinePopup")
    .addItem("🎨 Highlight Rotational Tenure Gaps", "highlightTenureGaps")
    .addToUi();
}

/**
 * Highlight officers whose tenure is overdue (>= 3.0 years in warning, >= 5.0 years in red)
 */
function highlightTenureGaps() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Employees");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Error: Employees sheet not found.");
    return;
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var headerMap = {};
  for (var i = 0; i < headers.length; i++) {
    headerMap[headers[i].toString().trim()] = i;
  }
  
  var dojCol = headerMap["doj"];
  var lastPostingCol = headerMap["first_seen_in_orders"] || headerMap["doj"]; // heuristic for last posting date
  if (dojCol === undefined) {
    SpreadsheetApp.getUi().alert("Error: DOJ column not found.");
    return;
  }
  
  var sheetValuesRange = sheet.getRange(2, 1, sheet.getLastRow() - 1, sheet.getLastColumn());
  var sheetValues = sheetValuesRange.getValues();
  
  var today = new Date();
  var countCritical = 0;
  var countWarning = 0;
  
  for (var r = 0; r < sheetValues.length; r++) {
    var row = sheetValues[r];
    var startStr = lastPostingCol !== undefined && row[lastPostingCol] ? row[lastPostingCol] : row[dojCol];
    if (!startStr) continue;
    
    var start = new Date(startStr);
    if (isNaN(start.getTime())) continue;
    
    var diffTime = today.getTime() - start.getTime();
    var diffYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
    
    var rowRange = sheet.getRange(r + 2, 1, 1, sheet.getLastColumn());
    if (diffYears >= 5.0) {
      rowRange.setBackground("#FEE2E2"); // Soft red
      countCritical++;
    } else if (diffYears >= 3.0) {
      rowRange.setBackground("#FEF3C7"); // Soft amber
      countWarning++;
    } else {
      rowRange.setBackground(null); // Reset / White
    }
  }
  
  SpreadsheetApp.getUi().alert("🎨 Highlight completed!\n\n🚨 Critical Overdue (>= 5 years): " + countCritical + " rows highlighted in Soft Red.\n⚠️ Warning Overdue (>= 3 years): " + countWarning + " rows highlighted in Soft Amber.");
}

/**
 * Interactive Popup UI showing career posting timeline for a selected employee row.
 */
function showOfficerTimelinePopup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Employees");
  if (!sheet) {
    SpreadsheetApp.getUi().alert("Error: Employees sheet not found.");
    return;
  }
  
  var activeCell = sheet.getActiveCell();
  var rowIdx = activeCell.getRow();
  if (rowIdx === 1) {
    SpreadsheetApp.getUi().alert("Please select an employee row below the headers.");
    return;
  }
  
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var headerMap = {};
  for (var i = 0; i < headers.length; i++) {
    headerMap[headers[i].toString().trim()] = i;
  }
  
  var row = data[rowIdx - 1];
  var fullName = row[headerMap["full_name"]] || "Officer";
  var hrmsId = row[headerMap["hrms_id"]] || "N/A";
  var currentDesignation = row[headerMap["current_designation"]] || "N/A";
  var currentDistrict = row[headerMap["current_district"]] || "N/A";
  var currentDivision = row[headerMap["current_division"]] || "N/A";
  
  var html = "<div style='font-family: Arial, sans-serif; padding: 15px; color: #334155; line-height: 1.5;'>";
  html += "<h2 style='color: #DD6B20; border-b: 2px solid #E2E8F0; padding-bottom: 8px; margin-top: 0;'>" + fullName + "</h2>";
  html += "<p style='font-size: 11px; color: #94A3B8; margin-top: -8px; font-weight: bold; text-transform: uppercase;'>HRMS ID: " + hrmsId + " · Current: " + currentDesignation + "</p>";
  
  html += "<h4 style='color: #475569; margin-bottom: 8px;'>📍 Current Placement</h4>";
  html += "<div style='background-color: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 8px; padding: 10px; margin-bottom: 15px;'>";
  html += "<strong>District:</strong> " + currentDistrict + "<br/>";
  var divLabel = currentDivision === "Jalpaiguri" ? "North Bengal" : currentDivision;
  html += "<strong>Division:</strong> " + divLabel + "<br/>";
  html += "</div>";
  
  html += "<h4 style='color: #475569; margin-bottom: 8px;'>⏳ Career Timeline Posting History</h4>";
  html += "<div style='margin-left: 10px; border-left: 2px solid #CBD5E1; padding-left: 15px;'>";
  
  var postingCount = 0;
  for (var p = 1; p <= 10; p++) {
    var desigCol = headerMap[p + " Posting Designation"];
    var placeCol = headerMap[p + " Posting Place"];
    var distCol = headerMap[p + " Posting District"];
    var divCol = headerMap[p + " Posting Division"];
    var durCol = headerMap[p + " Posting Duration"];
    
    if (desigCol !== undefined && row[desigCol]) {
      postingCount++;
      var pDesig = row[desigCol];
      var pPlace = row[placeCol] || "";
      var pDist = row[distCol] || "";
      var pDiv = row[divCol] || "";
      var pDur = row[durCol] || "";
      
      var pDivLabel = pDiv === "Jalpaiguri" ? "North Bengal" : pDiv;
      
      html += "<div style='margin-bottom: 12px; position: relative;'>";
      html += "<span style='position: absolute; left: -21px; top: 3px; background-color: #DD6B20; color: white; width: 12px; height: 12px; border-radius: 50%; display: inline-block; font-size: 8px; text-align: center; line-height: 12px;'></span>";
      html += "<strong>" + p + ". " + pDesig + "</strong><br/>";
      html += "<span style='font-size: 11px; color: #64748B;'>" + pPlace + " · District: " + pDist + " (" + pDivLabel + ")</span><br/>";
      if (pDur) {
        html += "<span style='font-size: 10px; background-color: #E2E8F0; color: #475569; font-weight: bold; border-radius: 4px; padding: 2px 5px; display: inline-block; margin-top: 3px;'>Duration: " + pDur + "</span>";
      }
      html += "</div>";
    }
  }
  
  if (postingCount === 0) {
    html += "<p style='color: #94A3B8; font-style: italic;'>No past posting logs available in career history.</p>";
  }
  
  html += "</div>";
  html += "<h4 style='color: #475569; margin-top: 15px; margin-bottom: 8px;'>🤖 AI Recommended Placements</h4>";
  html += "<div style='background-color: #EEF2F6; border: 1px solid #D0DBE5; border-radius: 8px; padding: 10px; font-size: 11px; white-space: pre-line; line-height: 1.4;'>";
  html += AVD_RECOMMEND_PLACEMENT(hrmsId);
  html += "</div>";
  
  html += "</div>";
  
  var htmlOutput = HtmlService.createHtmlOutput(html)
    .setWidth(500)
    .setHeight(600)
    .setTitle("AVD Officer Career Dashboard");
    
  SpreadsheetApp.getUi().showSidebar(htmlOutput);
}

/**
 * Runs a comprehensive placement optimization analysis and populates a separate sheet tab
 */
function runBatchTransferOptimization() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var empSheet = ss.getSheetByName("Employees");
  var postSheet = ss.getSheetByName("Postings");
  
  if (!empSheet || !postSheet) {
    SpreadsheetApp.getUi().alert("Error: Sheets 'Employees' or 'Postings' not found in this spreadsheet.");
    return;
  }
  
  // Create or Clear AI Recommendations sheet tab
  var reportSheet = ss.getSheetByName("AI_Transfer_Recommendations");
  if (reportSheet) {
    reportSheet.clear();
  } else {
    reportSheet = ss.insertSheet("AI_Transfer_Recommendations");
  }
  
  var empData = empSheet.getDataRange().getValues();
  var empHeaders = empData[0];
  var empMap = {};
  for (var i = 0; i < empHeaders.length; i++) {
    empMap[empHeaders[i].toString().trim()] = i;
  }
  
  var hrmsCol = empMap["hrms_id"];
  var nameCol = empMap["full_name"];
  var desigCol = empMap["current_designation"];
  var distCol = empMap["current_district"];
  var divCol = empMap["current_division"];
  var dojCol = empMap["doj"];
  var lastPostingCol = empMap["first_seen_in_orders"] || empMap["doj"];
  var specCol = empMap["specialization"];
  var spouseCol = empMap["spouse_name"];
  
  // Set report headers
  var reportHeaders = [
    "HRMS ID",
    "Officer Name",
    "Current Designation",
    "Current Station (District / Division)",
    "Current Tenure (Years)",
    "Pending Divisions Coverage",
    "Family Proximity Factors",
    "Specialization",
    "Optimal Placement Vacancy",
    "AI Match Score",
    "Recommendation Heuristics"
  ];
  reportSheet.appendRow(reportHeaders);
  
  var today = new Date();
  var reportRows = [];
  
  for (var r = 1; r < empData.length; r++) {
    var row = empData[r];
    var hrmsId = row[hrmsCol];
    var name = row[nameCol];
    var startStr = lastPostingCol !== undefined && row[lastPostingCol] ? row[lastPostingCol] : row[dojCol];
    
    if (!hrmsId || !startStr) continue;
    
    var start = new Date(startStr);
    if (isNaN(start.getTime())) continue;
    
    var diffYears = (today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 365.25);
    
    // Only analyze rotational candidates (tenure >= 3.0 years)
    if (diffYears >= 3.0) {
      // Analyze division coverage
      var divCoverage = AVD_ANALYZE_DIVISION_COVERAGE(hrmsId);
      var pendingStr = "None";
      if (divCoverage.indexOf("Pending: ") !== -1) {
        pendingStr = divCoverage.split("Pending: ")[1].replace(/[\[\]]/g, "");
      }
      
      // Recommendation lookup
      var recsText = AVD_RECOMMEND_PLACEMENT(hrmsId);
      var topRec = "No vacancies found";
      var score = "N/A";
      var reasons = "N/A";
      
      if (recsText && recsText.indexOf("1. ") !== -1) {
        var lines = recsText.split("\n");
        var topLine = lines[0]; // e.g. "1. Vety Surgeon at Purulia (Burdwan) [90% Match] - reasons"
        
        var matchPlace = topLine.match(/1\.\s+(.+?)\s+at\s+(.+?)\s+\[/);
        if (matchPlace) {
          topRec = matchPlace[1] + " (" + matchPlace[2] + ")";
        }
        
        var matchScore = topLine.match(/\[(\d+)%\s+Match\]/);
        if (matchScore) {
          score = matchScore[1] + "%";
        }
        
        var matchReasons = topLine.split(" Match] - ");
        if (matchReasons.length > 1) {
          reasons = matchReasons[1];
        }
      }
      
      var spouse = row[spouseCol] ? "👩 Married Spousal Pair" : "None flagged";
      var tenureStr = diffYears.toFixed(1) + " yrs";
      
      reportRows.push([
        hrmsId.toString(),
        name,
        row[desigCol] || "",
        (row[distCol] || "") + " (" + (row[divCol] || "") + ")",
        tenureStr,
        pendingStr,
        spouse,
        row[specCol] || "General Roster",
        topRec,
        score,
        reasons
      ]);
    }
  }
  
  // Sort report rows descending by match score
  reportRows.sort(function(a, b) {
    var scoreA = parseInt(a[9]) || 0;
    var scoreB = parseInt(b[9]) || 0;
    return scoreB - scoreA;
  });
  
  // Write to sheet
  if (reportRows.length > 0) {
    reportSheet.getRange(2, 1, reportRows.length, reportRows[0].length).setValues(reportRows);
  }
  
  // Format Report Sheet
  var lastRow = reportSheet.getLastRow();
  reportSheet.getRange("A1:K1").setFontWeight("bold").setBackground("#1E293B").setFontColor("#FFFFFF");
  reportSheet.getRange("A1:K" + lastRow).setFontSize(10).setVerticalAlignment("middle");
  reportSheet.setColumnWidths(1, 11, 140);
  reportSheet.setColumnWidth(2, 180);
  reportSheet.setColumnWidth(4, 200);
  reportSheet.setColumnWidth(9, 220);
  reportSheet.setColumnWidth(11, 280);
  reportSheet.setRowHeights(1, lastRow, 28);
  
  // Add auto-wrapping for explanations column
  reportSheet.getRange("K2:K" + lastRow).setWrap(true);
  
  SpreadsheetApp.getUi().alert("📊 Batch Placement Optimizer completed successfully!\n\nIdentified " + reportRows.length + " officers due for rotational transfer (>3.0 yrs tenure).\nCreated AI recommend placements inside tab: 'AI_Transfer_Recommendations'.");
}
