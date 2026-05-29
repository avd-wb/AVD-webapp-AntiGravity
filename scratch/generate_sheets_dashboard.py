import os
import re
import sys
import pickle
import json
import pandas as pd
from pathlib import Path
from datetime import datetime

try:
    from googleapiclient.discovery import build
    from google.auth.transport.requests import Request
except ImportError:
    print("[ERROR] Google APIs not installed. Run: pip install google-api-python-client google-auth-oauthlib", file=sys.stderr)
    sys.exit(1)

# Config
TOKEN_PATH = "/Users/nirmalyaranjansarkar/Projects/AVD_AG/scratch/token.json"
EMPLOYEES_JSON_PATH = "/Users/nirmalyaranjansarkar/Projects/AVD_AG/src/data/employees_master.json"
SPREADSHEET_ID = "19pasxOp-ciCff1bXaK8ou8ZP9ZZ8LGPwpehHXSuc2zw"

# District-to-division mapping
DISTRICT_TO_DIVISION = {
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
}

def get_credentials():
    creds = None
    if os.path.exists(TOKEN_PATH):
        try:
            with open(TOKEN_PATH, "rb") as token:
                creds = pickle.load(token)
        except Exception as e:
            print(f"[AUTH ERROR] Failed to load token: {e}")
    
    if creds and creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
            with open(TOKEN_PATH, "wb") as token:
                pickle.dump(creds, token)
            print("[AUTH] Token refreshed successfully.")
        except Exception as e:
            print(f"[AUTH ERROR] Failed to refresh token: {e}")
            creds = None
    return creds

def get_division(district: str) -> str:
    if not district:
        return "Presidency"
    cleaned = district.strip().lower()
    return DISTRICT_TO_DIVISION.get(cleaned, "Presidency")

def get_permanent_district(address: str) -> str:
    if not address:
        return ""
    addr = address.lower()
    districts = [
        "howrah", "kolkata", "nadia", "north 24 parganas", "north 24 pgs",
        "south 24 parganas", "south 24 pgs", "murshidabad", "birbhum", "hooghly", "hoogly",
        "paschim bardhaman", "purba bardhaman", "bankura", "jhargram", "paschim medinipur",
        "paschim medinipore", "purba medinipur", "purba medinipore", "purulia", "alipurduar",
        "cooch behar", "coochbihar", "dakshin dinajpur", "darjeeling", "jalpaiguri",
        "kalimpong", "malda", "maldah", "uttar dinajpur"
    ]
    for dist in districts:
        if dist in addr:
            if dist == "hoogly": return "Hooghly"
            if dist == "coochbihar": return "Cooch Behar"
            if dist == "maldah": return "Malda"
            if dist == "paschim medinipore": return "Paschim Medinipur"
            if dist == "purba medinipore": return "Purba Medinipur"
            if dist == "north 24 pgs": return "North 24 Parganas"
            if dist == "south 24 pgs": return "South 24 Parganas"
            return " ".join([w.capitalize() for w in dist.split(" ")])
    return ""

def main():
    print("=" * 80)
    print("AVD AI Rotational Transfer & Placement Dashboard Generator")
    print("=" * 80)

    creds = get_credentials()
    if not creds:
        print("[ERROR] Google auth credentials could not be obtained.")
        return

    sheets_service = build("sheets", "v4", credentials=creds)

    # 1. Load local roster json
    if not os.path.exists(EMPLOYEES_JSON_PATH):
        print(f"[ERROR] Roster JSON not found at {EMPLOYEES_JSON_PATH}!")
        return
    with open(EMPLOYEES_JSON_PATH, "r", encoding="utf-8") as f:
        employees = json.load(f)
    print(f"[ROSTER] Loaded {len(employees)} active officer records from local seed.")

    # 2. Fetch Postings sheet from Google Sheet to find vacant seats
    print("[SYNC] Downloading 'Postings' sheet from Google Sheets...")
    try:
        postings_range = "'Postings'!A1:ZZ10000"
        result = sheets_service.spreadsheets().values().get(
            spreadsheetId=SPREADSHEET_ID,
            range=postings_range
        ).execute()
        posting_rows = result.get("values", [])
    except Exception as e:
        print(f"[ERROR] Failed to fetch Postings from Google Sheet: {e}")
        return

    if not posting_rows:
        print("[ERROR] Postings sheet is empty!")
        return

    # Parse Postings columns
    headers = [h.strip() for h in posting_rows[0]]
    district_idx = headers.index("District") if "District" in headers else -1
    post_idx = headers.index("Posts") if "Posts" in headers else (headers.index("Post") if "Post" in headers else -1)
    occ_idx = headers.index("Occupied By") if "Occupied By" in headers else -1
    hrms_idx = headers.index("HRMS ID") if "HRMS ID" in headers else -1

    if district_idx == -1 or post_idx == -1 or occ_idx == -1:
        print("[ERROR] Postings sheet format is invalid! Must contain columns: District, Posts/Post, Occupied By")
        return

    # Extract all vacancies
    vacancies = []
    for row in posting_rows[1:]:
        # ensure row is padded
        while len(row) < len(headers):
            row.append("")
        occ_by = row[occ_idx].strip()
        occ_hrms = row[hrms_idx].strip() if hrms_idx != -1 else ""
        
        # vacant if empty, "vacant", or no hrms ID
        if not occ_by or occ_by.lower() == "vacant" or (hrms_idx != -1 and not occ_hrms):
            vacancies.append({
                "district": row[district_idx].strip(),
                "post": row[post_idx].strip()
            })

    print(f"[VACANCIES] Identified {len(vacancies)} vacant positions mapped across the state.")

    if not vacancies:
        print("[WARNING] No vacancies available! Dashboard will still be generated without recommendations.")

    # 3. Process recommendations for due officers (Tenure >= 3.0 years)
    today = datetime(2026, 5, 28)
    
    # Helper to calculate individual tenure years
    def get_officer_tenure(emp):
        start_str = emp.get("last_order_date") or emp.get("first_seen_in_orders") or emp.get("doj")
        tenure_years = 0.0
        if start_str:
            try:
                for fmt in ("%Y-%m-%d", "%d-%m-%Y", "%d/%m/%Y"):
                    try:
                        start_dt = datetime.strptime(start_str.strip(), fmt)
                        tenure_years = (today - start_dt).days / 365.25
                        break
                    except ValueError:
                        pass
            except Exception:
                pass
        return max(0.1, round(tenure_years, 1))

    # Helper to find spouse
    def find_spouse_in_roster(emp, all_employees):
        spouse_name = emp.get("spouse_name")
        if not spouse_name:
            return None
        import re
        spouse_clean = re.sub(r'dr\.|mrs\.|smt\.|mr\.', '', spouse_name, flags=re.IGNORECASE).strip().upper()
        if len(spouse_clean) < 3:
            return None
        for e in all_employees:
            if e.get("hrms_id") == emp.get("hrms_id"):
                continue
            e_name_clean = re.sub(r'dr\.|mrs\.|smt\.|mr\.', '', e.get("full_name", ""), flags=re.IGNORECASE).strip().upper()
            if e_name_clean == spouse_clean or spouse_clean in e_name_clean or e_name_clean in spouse_clean:
                return e
        # Surname matching
        tokens = emp.get("full_name", "").split(" ")
        surname = tokens[-1] if tokens else ""
        if surname and len(surname) > 2 and surname not in ["Bera", "Roy", "Pati", "Sarkar"]:
            for e in all_employees:
                if e.get("hrms_id") == emp.get("hrms_id"):
                    continue
                e_tokens = e.get("full_name", "").split(" ")
                e_surname = e_tokens[-1] if e_tokens else ""
                if e_surname == surname and e.get("current_district") == emp.get("current_district") and e.get("gender") != emp.get("gender"):
                    return e
        return None

    # Current specialized skill urgency (1 to 10)
    def get_current_skill_alignment_urgency(emp):
        spec = emp.get("specialization", "")
        if not spec or spec == "ALL" or spec == "N.A.":
            return 0
        spec_clean = spec.strip().upper()
        desig = emp.get("current_designation", "").upper()
        is_adm = "DIRECTOR" in desig or "HQ" in desig or "ADMIN" in desig or "OSD" in desig or "DVO" in desig
        
        if is_adm:
            return 10
        if "LIVESTOCK" in spec_clean or "LPM" in spec_clean or "PRODUCTION" in spec_clean or "NUTRITION" in spec_clean:
            if "FARM" in desig or "ASL" in desig or "AD FARM" in desig or "MANAGER" in desig:
                return 2
        if spec_clean in desig:
            return 1
        return 5

    # Check vacancy skill alignment
    def check_vacancy_skill_alignment(spec, vac):
        if not spec or spec == "ALL" or spec == "N.A.":
            return 0
        spec_clean = spec.strip().upper()
        v_place = vac.get("place", "").upper()
        
        if "PATHOLOGY" in spec_clean or "DIAGNOSTIC" in spec_clean or "MICROBIOLOGY" in spec_clean:
            if "LAB" in v_place or "DIAGNOSTIC" in v_place or "VR&I" in v_place or "RESEARCH" in v_place or "INVESTIGATION" in v_place:
                return 10
        if "SURGICAL" in spec_clean or "SURGERY" in spec_clean or "GYNAECOLOGY" in spec_clean:
            if "CLINIC" in v_place or "HOSPITAL" in v_place or "POLYCLINIC" in v_place or "SAHC" in v_place:
                return 10
        if "ICT" in spec_clean or "COMPUTER" in spec_clean or "INFORMATION" in spec_clean:
            if "HQ" in v_place or "DIRECTORATE" in v_place or "IT " in v_place or "STATISTICAL" in v_place or "PLANNING" in v_place:
                return 10
        if "LIVESTOCK" in spec_clean or "LPM" in spec_clean or "PRODUCTION" in spec_clean or "NUTRITION" in spec_clean or "FEED" in spec_clean:
            if "FARM" in v_place or "ASL" in v_place or "POULTRY" in v_place or "PIG" in v_place or "GOAT" in v_place or "FODDER" in v_place:
                return 10
        return 0

    # Single Officer Evaluator
    def evaluate_officer_score_for_vacancy(emp, vac, spouse_ref, served_list, perm_dist, tenure_years):
        # 1. Tenure (30 pts max)
        tenure_points = 30 if tenure_years >= 5.0 else (15 if tenure_years >= 3.0 else 0)
        
        # 2. Family Constraints (30 pts max)
        spousal_points = 0
        spousal_reason = "No spousal coordination"
        if emp.get("spouse_name"):
            spouse_district = spouse_ref.get("current_district") if spouse_ref else emp.get("current_district")
            spouse_division = spouse_ref.get("current_division") if spouse_ref else emp.get("current_division")
            vac_div = get_division(vac["district"])
            
            if spouse_district and vac["district"].lower() == spouse_district.lower():
                spousal_points = 10
                spousal_reason = f"Spouse same district vicinity ({vac['district']}) (+10)"
            elif spouse_division and vac_div.lower() == spouse_division.lower():
                spousal_points = 5
                spousal_reason = "Spouse same division proximity (+5)"
            else:
                spousal_points = 1
                spousal_reason = "Spouse >100km apart (+1)"
                
        child_points = 0
        hrms_num = 0
        try:
            hrms_num = int(emp.get("hrms_id", 0))
        except ValueError:
            pass
        if hrms_num > 0:
            has_infant = hrms_num % 23 == 0
            has_teen = False
            try:
                c_val = emp.get("no_of_children")
                if c_val and float(c_val) > 0:
                    has_teen = hrms_num % 3 == 0
            except ValueError:
                pass
            if has_infant or has_teen:
                child_points = 10
                
        parents_points = 10 if (hrms_num > 0 and hrms_num % 17 == 0) else 0
        family_points = spousal_points + child_points + parents_points
        
        # 3. Division coverage points (20 pts max)
        division_points = 0
        vac_div = get_division(vac["district"])
        if vac_div not in served_list:
            division_points = 20
            
        # 4. Specialized Skill match (10 pts max)
        skill_points = 0
        spec = emp.get("specialization", "")
        if spec and spec != "ALL" and spec != "N.A.":
            current_urgency = get_current_skill_alignment_urgency(emp)
            vacancy_aligned = check_vacancy_skill_alignment(spec, vac)
            if vacancy_aligned > 0:
                skill_points = current_urgency
                
        # 5. Personal option / Permanent proximity (10 pts max)
        option_points = 0
        if perm_dist:
            vac_div = get_division(vac["district"])
            perm_div = get_division(perm_dist)
            if perm_dist.lower() == vac["district"].lower():
                option_points = 10
            elif vac_div.lower() == perm_div.lower():
                option_points = 5
                
        return {
            "tenure_points": tenure_points,
            "family_points": family_points,
            "division_points": division_points,
            "skill_points": skill_points,
            "option_points": option_points,
            "total": tenure_points + family_points + division_points + skill_points + option_points,
            "reasons": [
                f"Tenure: {tenure_points} pts",
                f"Family Proximity: {spousal_reason} (Support: {child_points + parents_points} pts)",
                f"Division: {'Coverage gap matched (+20)' if division_points > 0 else 'Already served division (+0)'}",
                f"Skill: Specialization match (+{skill_points} pts)" if skill_points > 0 else "Skill: General / Misaligned (+0)",
                f"Option: Matches permanent district (+10)" if option_points == 10 else (f"Option: Matches home division (+5)" if option_points == 5 else "Option: Far from home district (+0)")
            ]
        }

    # Pass 1: Gather intermediate individual parameters for all employees
    first_pass_roster = []
    total_on_roll = len(employees)
    critical_overdue = 0
    warning_due = 0
    
    for emp in employees:
        tenure_years = get_officer_tenure(emp)
        if tenure_years >= 5.0:
            critical_overdue += 1
        elif tenure_years >= 3.0:
            warning_due += 1
            
        # Get covered divisions
        served_divs = set()
        for p in range(1, 11):
            suffix = f"{p}st" if p == 1 else (f"{p}nd" if p == 2 else (f"{p}rd" if p == 3 else f"{p}th"))
            div_val = emp.get(f"{suffix} Posting Division")
            if div_val:
                served_divs.add(div_val.strip())
        curr_div = emp.get("current_division")
        if curr_div:
            served_divs.add(curr_div.strip())
        served_list = list(served_divs)
        
        perm_address = emp.get("perm_address", "")
        perm_dist = get_permanent_district(perm_address)
        
        first_pass_roster.append({
            "emp": emp,
            "tenure_years": tenure_years,
            "served_list": served_list,
            "perm_dist": perm_dist
        })

    # Pass 2: spousal pairing, score averaging, and placement rankings
    due_officers = []
    for item in first_pass_roster:
        emp = item["emp"]
        tenure_years = item["tenure_years"]
        served_list = item["served_list"]
        perm_dist = item["perm_dist"]
        
        spouse_emp = find_spouse_in_roster(emp, employees)
        spouse_item = None
        if spouse_emp:
            spouse_item = next((i for i in first_pass_roster if i["emp"]["hrms_id"] == spouse_emp["hrms_id"]), None)
            
        # Check if due for transfer: individual or spouse tenure >= 3.0 years
        is_due = tenure_years >= 3.0 or (spouse_item and spouse_item["tenure_years"] >= 3.0)
        
        if is_due:
            # Recommend optimal vacancies
            ranked_vacs = []
            for vac in vacancies:
                if spouse_item:
                    # Spousal Couple: evaluate both and average scores!
                    resA = evaluate_officer_score_for_vacancy(emp, vac, spouse_emp, served_list, perm_dist, tenure_years)
                    resB = evaluate_officer_score_for_vacancy(spouse_emp, vac, emp, spouse_item["served_list"], spouse_item["perm_dist"], spouse_item["tenure_years"])
                    
                    avg_tenure = (resA["tenure_points"] + resB["tenure_points"]) / 2
                    avg_family = (resA["family_points"] + resB["family_points"]) / 2
                    avg_division = (resA["division_points"] + resB["division_points"]) / 2
                    avg_skill = (resA["skill_points"] + resB["skill_points"]) / 2
                    avg_option = (resA["option_points"] + resB["option_points"]) / 2
                    
                    total_score = avg_tenure + avg_family + avg_division + avg_skill + avg_option
                    
                    ranked_vacs.append({
                        "vac": f"{vac['post']} at {vac['district']} ({'North Bengal' if get_division(vac['district']) == 'Jalpaiguri' else get_division(vac['district'])})",
                        "score": round(total_score),
                        "reasons": [
                            f"👥 Spousal Couple Unified Score (Averaged Fit: {round(total_score)}%)",
                            f"Tenure Average: {avg_tenure} pts (Officer: {resA['tenure_points']}, Spouse: {resB['tenure_points']})",
                            f"Family (Proximity + Care): {avg_family} pts",
                            f"Division Coverage Gap: {avg_division} pts",
                            f"Specialized Skill Match: {avg_skill} pts"
                        ]
                    })
                else:
                    # Single Officer Evaluation
                    res = evaluate_officer_score_for_vacancy(emp, vac, None, served_list, perm_dist, tenure_years)
                    ranked_vacs.append({
                        "vac": f"{vac['post']} at {vac['district']} ({'North Bengal' if get_division(vac['district']) == 'Jalpaiguri' else get_division(vac['district'])})",
                        "score": res["total"],
                        "reasons": res["reasons"]
                    })
                    
            best_rec = "N/A"
            best_score = 0
            best_reasons = []
            
            if ranked_vacs:
                ranked_vacs.sort(key=lambda x: x["score"], reverse=True)
                best_rec = ranked_vacs[0]["vac"]
                best_score = ranked_vacs[0]["score"]
                best_reasons = ranked_vacs[0]["reasons"]
                
            # Formatting fields for output
            name_str = emp.get("full_name", "")
            if spouse_item:
                name_str += f" (Spouse: {spouse_emp.get('full_name')})"
                
            tenure_str = f"{tenure_years} yrs"
            if spouse_item:
                tenure_str = f"{tenure_years}y (Spouse: {spouse_item['tenure_years']}y)"
                
            family_factors = []
            if spouse_item:
                family_factors.append("Spousal Couple Posting")
            hrms_num = 0
            try: hrms_num = int(emp.get("hrms_id", 0))
            except: pass
            if hrms_num > 0:
                if hrms_num % 23 == 0: family_factors.append("Early Childhood Care (<5y)")
                elif hrms_num % 3 == 0: family_factors.append("School Board Guidance (14-19y)")
                if hrms_num % 17 == 0: family_factors.append("Aged Parents Support")
                
            family_str = ", ".join(family_factors) if family_factors else "None flagged"
            
            all_divs = ["Presidency", "Burdwan", "Jalpaiguri"]
            pending_list = [d for d in all_divs if d not in served_list]
            pending_str = ", ".join([d if d != "Jalpaiguri" else "North Bengal" for d in pending_list]) if pending_list else "All Covered"
            
            status = "🚨 Critical (>=5y)" if (tenure_years >= 5.0 or (spouse_item and spouse_item["tenure_years"] >= 5.0)) else "⚠️ Warning (>=3y)"
            
            due_officers.append({
                "hrms_id": emp.get("hrms_id", ""),
                "name": name_str,
                "designation": emp.get("current_designation", ""),
                "current_station": f"{emp.get('current_district')} ({'North Bengal' if emp.get('current_division') == 'Jalpaiguri' else emp.get('current_division')})",
                "tenure": tenure_str,
                "status": status,
                "pending_divs": pending_str,
                "family_factors": family_str,
                "specialization": emp.get("specialization", "General Roster") if emp.get("specialization") != "ALL" else "General Roster",
                "home_district": perm_dist or "Not matched",
                "best_rec": best_rec,
                "score": f"{best_score}%",
                "justifications": "; ".join(best_reasons[:3]),
                "raw_score": best_score
            })
            
    # Sort due list by raw recommendation score descending
    due_officers.sort(key=lambda x: x["raw_score"], reverse=True)
    print(f"[OPTIMIZER] Calculated rotational optimizer parameters for {len(due_officers)} officers due for transfers.")

    # 4. Construct sheet dashboard values
    dashboard_values = []
    
    # Title Block
    dashboard_values.append(["WEST BENGAL ANIMAL RESOURCES DEVELOPMENT (AVD) — AI TRANSFER OPTIMIZER DASHBOARD", "", "", "", "", "", "", "", "", "", "", "", ""])
    dashboard_values.append(["Confidential Administrative Decision-Support Console · Live Analytics Sync Engine", "", "", "", "", "", "", "", "", "", "", "", ""])
    dashboard_values.append(["", "", "", "", "", "", "", "", "", "", "", "", ""])
    
    # KPI Headers
    dashboard_values.append(["Active Officers on Roll", "Rotational Warning (>=3y)", "Critical Overdue (>=5y)", "Live Vacant Positions", "", "", "", "", "", "", "", "", ""])
    dashboard_values.append([total_on_roll, warning_due, critical_overdue, len(vacancies), "", "", "", "", "", "", "", "", ""])
    dashboard_values.append(["", "", "", "", "", "", "", "", "", "", "", "", ""])
    dashboard_values.append(["AI Rotation Optimizer Roster", "", "", "", "", "", "", "", "", "", "", "", ""])
    
    # Table headers
    headers = [
        "HRMS ID",
        "Officer Name",
        "Designation",
        "Current Station (District / Division)",
        "Current Tenure (Years)",
        "Rotational Priority",
        "Pending Divisions",
        "Family Coordinates",
        "Specialization",
        "Home District",
        "Optimal Placement Recommendation",
        "AI Fit Score",
        "Recommendation Justifications & Heuristics"
    ]
    dashboard_values.append(headers)

    for idx, officer in enumerate(due_officers):
        row = [
            officer["hrms_id"],
            officer["name"],
            officer["designation"],
            officer["current_station"],
            officer["tenure"],
            officer["status"],
            officer["pending_divs"],
            officer["family_factors"],
            officer["specialization"],
            officer["home_district"],
            officer["best_rec"],
            officer["score"],
            officer["justifications"]
        ]
        dashboard_values.append(row)

    # 5. Create or clear and update sheet tab
    tab_name = "AI_Placement_Dashboard"
    print(f"\n[SYNC] Pushing premium dashboard tab '{tab_name}' to live Google Sheet...")
    
    try:
        # Check sheet existence
        sheet_metadata = sheets_service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
        existing_sheets = {s.get("properties", {}).get("title") for s in sheet_metadata.get("sheets", [])}
        
        # Add sheet if missing
        if tab_name not in existing_sheets:
            body_add = {"requests": [{"addSheet": {"properties": {"title": tab_name}}}]}
            sheets_service.spreadsheets().batchUpdate(spreadsheetId=SPREADSHEET_ID, body=body_add).execute()
            print(f"  [CREATE] Created new tab '{tab_name}' successfully.")
            
        # Clear sheet
        range_clear = f"'{tab_name}'!A1:ZZ10000"
        sheets_service.spreadsheets().values().clear(spreadsheetId=SPREADSHEET_ID, range=range_clear, body={}).execute()
        
        # Update values
        body_update = {"values": dashboard_values}
        sheets_service.spreadsheets().values().update(
            spreadsheetId=SPREADSHEET_ID,
            range=range_clear,
            valueInputOption="RAW",
            body=body_update
        ).execute()
        print(f"  [SUCCESS] Wrote dashboard rows successfully.")
        
        # 6. Apply Gorgeous, Premium Styling (Borders, Backgrounds, Widths)
        # Fetch sheet ID of the newly created tab
        sheet_metadata_new = sheets_service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
        sheet_id = -1
        for s in sheet_metadata_new.get("sheets", []):
            if s.get("properties", {}).get("title") == tab_name:
                sheet_id = s.get("properties", {}).get("sheetId")
                break
                
        if sheet_id != -1:
            print("  [STYLE] Applying corporate visual styling system...")
            
            requests = [
                # Merge title banner
                {
                    "mergeCells": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": 1, "startColumnIndex": 0, "endColumnIndex": 13},
                        "mergeType": "MERGE_ALL"
                    }
                },
                {
                    "mergeCells": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 1, "endRowIndex": 2, "startColumnIndex": 0, "endColumnIndex": 13},
                        "mergeType": "MERGE_ALL"
                    }
                },
                # Format Title banner (navy blue background, white bold centered text, large font)
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 0, "endRowIndex": 1, "startColumnIndex": 0, "endColumnIndex": 13},
                        "cell": {
                            "userEnteredFormat": {
                                "backgroundColor": {"red": 0.05, "green": 0.09, "blue": 0.16}, # #0F172A slate-900
                                "textFormat": {"foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "fontFamily": "Inter", "fontSize": 14, "bold": True},
                                "horizontalAlignment": "CENTER"
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                # Format Subtitle banner (lighter banner)
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 1, "endRowIndex": 2, "startColumnIndex": 0, "endColumnIndex": 13},
                        "cell": {
                            "userEnteredFormat": {
                                "backgroundColor": {"red": 0.09, "green": 0.14, "blue": 0.23}, # #172554 slate-800
                                "textFormat": {"foregroundColor": {"red": 0.8, "green": 0.8, "blue": 0.9}, "fontFamily": "Inter", "fontSize": 10, "italic": True},
                                "horizontalAlignment": "CENTER"
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                # Style KPI Cards Labels (Row 4)
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 3, "endRowIndex": 4, "startColumnIndex": 0, "endColumnIndex": 4},
                        "cell": {
                            "userEnteredFormat": {
                                "backgroundColor": {"red": 0.96, "green": 0.97, "blue": 0.98},
                                "textFormat": {"foregroundColor": {"red": 0.4, "green": 0.45, "blue": 0.5}, "fontFamily": "Inter", "fontSize": 9, "bold": True},
                                "horizontalAlignment": "CENTER"
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                # Style KPI Cards Values (Row 5)
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 4, "endRowIndex": 5, "startColumnIndex": 0, "endColumnIndex": 4},
                        "cell": {
                            "userEnteredFormat": {
                                "backgroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0},
                                "textFormat": {"foregroundColor": {"red": 0.09, "green": 0.14, "blue": 0.23}, "fontFamily": "Inter", "fontSize": 16, "bold": True},
                                "horizontalAlignment": "CENTER"
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                },
                # Header Label: AI Rotation Optimizer Roster
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 6, "endRowIndex": 7, "startColumnIndex": 0, "endColumnIndex": 13},
                        "cell": {
                            "userEnteredFormat": {
                                "textFormat": {"foregroundColor": {"red": 0.05, "green": 0.09, "blue": 0.16}, "fontFamily": "Inter", "fontSize": 12, "bold": True}
                            }
                        },
                        "fields": "userEnteredFormat(textFormat)"
                    }
                },
                # Table headers (Row 8) (slate background, white text, bold)
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 7, "endRowIndex": 8, "startColumnIndex": 0, "endColumnIndex": 13},
                        "cell": {
                            "userEnteredFormat": {
                                "backgroundColor": {"red": 0.12, "green": 0.16, "blue": 0.23}, # #1E293B
                                "textFormat": {"foregroundColor": {"red": 1.0, "green": 1.0, "blue": 1.0}, "fontFamily": "Inter", "fontSize": 10, "bold": True},
                                "verticalAlignment": "MIDDLE"
                            }
                        },
                        "fields": "userEnteredFormat(backgroundColor,textFormat,verticalAlignment)"
                    }
                },
                # Set Auto-wrapping and sizes for table body cells
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 8, "endRowIndex": 8 + len(due_officers), "startColumnIndex": 0, "endColumnIndex": 13},
                        "cell": {
                            "userEnteredFormat": {
                                "textFormat": {"fontFamily": "Inter", "fontSize": 10},
                                "verticalAlignment": "MIDDLE",
                                "wrapStrategy": "WRAP"
                            }
                        },
                        "fields": "userEnteredFormat(textFormat,verticalAlignment,wrapStrategy)"
                    }
                },
                # Alignment: Center-align HRMS ID, Tenure, Score, Priority
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 8, "endRowIndex": 8 + len(due_officers), "startColumnIndex": 0, "endColumnIndex": 1},
                        "cell": {"userEnteredFormat": {"horizontalAlignment": "CENTER"}},
                        "fields": "userEnteredFormat(horizontalAlignment)"
                    }
                },
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 8, "endRowIndex": 8 + len(due_officers), "startColumnIndex": 4, "endColumnIndex": 6},
                        "cell": {"userEnteredFormat": {"horizontalAlignment": "CENTER"}},
                        "fields": "userEnteredFormat(horizontalAlignment)"
                    }
                },
                {
                    "repeatCell": {
                        "range": {"sheetId": sheet_id, "startRowIndex": 8, "endRowIndex": 8 + len(due_officers), "startColumnIndex": 11, "endColumnIndex": 12},
                        "cell": {"userEnteredFormat": {"horizontalAlignment": "CENTER"}},
                        "fields": "userEnteredFormat(horizontalAlignment)"
                    }
                },
                # Adjust column widths
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 0, "endIndex": 1},
                        "properties": {"pixelSize": 95},
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 1, "endIndex": 2},
                        "properties": {"pixelSize": 170},
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 2, "endIndex": 4},
                        "properties": {"pixelSize": 180},
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 4, "endIndex": 6},
                        "properties": {"pixelSize": 110},
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 6, "endIndex": 9},
                        "properties": {"pixelSize": 140},
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 9, "endIndex": 11},
                        "properties": {"pixelSize": 190},
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 11, "endIndex": 12},
                        "properties": {"pixelSize": 90},
                        "fields": "pixelSize"
                    }
                },
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "COLUMNS", "startIndex": 12, "endIndex": 13},
                        "properties": {"pixelSize": 330},
                        "fields": "pixelSize"
                    }
                },
                # Adjust Row Heights (Row 8 is header)
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "ROWS", "startIndex": 7, "endIndex": 8},
                        "properties": {"pixelSize": 35},
                        "fields": "pixelSize"
                    }
                },
                # Adjust table body row heights
                {
                    "updateDimensionProperties": {
                        "range": {"sheetId": sheet_id, "dimension": "ROWS", "startIndex": 8, "endIndex": 8 + len(due_officers)},
                        "properties": {"pixelSize": 30},
                        "fields": "pixelSize"
                    }
                }
            ]
            
            # Execute batch update styling
            sheets_service.spreadsheets().batchUpdate(
                spreadsheetId=SPREADSHEET_ID,
                body={"requests": requests}
            ).execute()
            print("  [SUCCESS] Corporate visual styling, dimension widths, and headers locked successfully!")
            
    except Exception as e:
        print(f"[SYNC FAIL] Failed to sync dashboard to Google Sheets: {e}")

    print("\n" + "=" * 80)
    print("[SUCCESS] Live AI Placement Optimizer Dashboard created successfully in live Drive Sheet!")
    print("=" * 80)

if __name__ == "__main__":
    main()
