export const userProfileSchema = {
  "name": "Profile details",
  "schema": {
    "title": "Candidate Profile Details",
    "description": "Information about the candidate including source, personal details, expected terms, and current employment status.",
    "fields": [
      {
        "key": "resume_upload",
        "type": "text",
        "label": "Import Profile/Resume (Drag & Drop)",
        "placeholder": "Upload CV to auto-fill...",
        "order": 1,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "source_of_profile",
        "type": "dropdown",
        "label": "Source of Profile",
        "placeholder": "Select Source",
        "order": 2,
        "default": null,
        "required": true,
        "readonly": false,
        "options": [
          { "label": "Internal", "value": "internal" },
          { "label": "Consultant", "value": "consultant" },
          { "label": "Referral", "value": "referral" },
          { "label": "Direct Application", "value": "direct" }
        ],
        "validation": {}
      },
      {
        "key": "name_of_source",
        "type": "text",
        "label": "Name of Source (e.g., Consultant/Employee Name)",
        "placeholder": "Enter source name",
        "order": 3,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "candidate_name",
        "type": "text",
        "label": "Candidate Name",
        "placeholder": "Enter full name",
        "order": 4,
        "default": "",
        "required": true,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "consent_to_use_details",
        "type": "dropdown",
        "label": "Consent to use personal details",
        "placeholder": "Select",
        "order": 5,
        "default": "Yes",
        "required": true,
        "readonly": false,
        "options": [
          { "label": "Yes", "value": "Yes" },
          { "label": "No", "value": "No" }
        ],
        "validation": {}
      },
      {
        "key": "email_id",
        "type": "text",
        "label": "Email ID",
        "placeholder": "Enter email",
        "order": 6,
        "default": "",
        "required": true,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "phone_number",
        "type": "text",
        "label": "Phone Number",
        "placeholder": "Enter phone number",
        "order": 7,
        "default": "",
        "required": true,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "emergency_contact",
        "type": "text",
        "label": "Emergency Contact",
        "placeholder": "Enter emergency contact",
        "order": 8,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      
      
      {
        "key": "expected_role",
        "type": "text",
        "label": "Expected Role",
        "placeholder": "Enter expected role",
        "order": 9,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "expected_designation",
        "type": "text",
        "label": "Expected Designation",
        "placeholder": "Enter expected designation",
        "order": 10,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "expected_salary_fixed",
        "type": "number",
        "label": "Expected Salary (Fixed)",
        "placeholder": "Enter fixed amount",
        "order": 11,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "expected_salary_variable",
        "type": "number",
        "label": "Expected Salary (Variable)",
        "placeholder": "Enter variable amount",
        "order": 12,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "expected_wfh",
        "type": "dropdown",
        "label": "WFH Preference",
        "placeholder": "Select preference",
        "order": 13,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [
          { "label": "Expected", "value": "Expected" },
          { "label": "Optional", "value": "Optional" },
          { "label": "Required", "value": "Required" }
        ],
        "validation": {}
      },
      {
        "key": "willing_to_wfo",
        "type": "dropdown",
        "label": "Willing to WFO",
        "placeholder": "Select willingness",
        "order": 14,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [
          { "label": "Yes", "value": "Yes" },
          { "label": "No", "value": "No" },
          { "label": "Open to all days", "value": "Open to all days" }
        ],
        "validation": {}
      },
      {
        "key": "open_to_travel",
        "type": "dropdown",
        "label": "Open to travel for WFO",
        "placeholder": "Select",
        "order": 15,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [
          { "label": "Yes", "value": "Yes" },
          { "label": "No", "value": "No" }
        ],
        "validation": {}
      },
      {
        "key": "willing_to_relocate",
        "type": "dropdown",
        "label": "Willing to Relocate",
        "placeholder": "Select",
        "order": 16,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [
          { "label": "Yes", "value": "Yes" },
          { "label": "No", "value": "No" }
        ],
        "validation": {}
      },
      
      
      {
        "key": "current_status",
        "type": "dropdown",
        "label": "Current Employment Status",
        "placeholder": "Select status",
        "order": 17,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [
          { "label": "Working", "value": "Working" },
          { "label": "Resigned/Serving NP", "value": "Serving NP" },
          { "label": "Not Working", "value": "Not Working" }
        ],
        "validation": {}
      },
      {
        "key": "current_role",
        "type": "text",
        "label": "Current Role",
        "placeholder": "Enter role",
        "order": 18,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "current_designation",
        "type": "text",
        "label": "Current Designation",
        "placeholder": "Enter designation",
        "order": 19,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "total_experience",
        "type": "number",
        "label": "Total Experience (YY.MM)",
        "placeholder": "e.g., 5.08",
        "order": 20,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "relevant_experience",
        "type": "number",
        "label": "Relevant Experience (YY.MM)",
        "placeholder": "e.g., 3.02",
        "order": 21,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "current_location",
        "type": "text",
        "label": "Current Location",
        "placeholder": "Enter location",
        "order": 22,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "current_salary_fixed",
        "type": "number",
        "label": "Current Salary (Fixed)",
        "placeholder": "Enter fixed amount",
        "order": 23,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "current_salary_variable",
        "type": "number",
        "label": "Current Salary (Variable)",
        "placeholder": "Enter variable amount",
        "order": 24,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "notice_period",
        "type": "text",
        "label": "Notice Period (Months/Days)",
        "placeholder": "e.g., 60 Days",
        "order": 25,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "last_working_day",
        "type": "date",
        "label": "Last Working Day (LWD)",
        "placeholder": "Select LWD",
        "order": 26,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "employment_gap",
        "type": "number",
        "label": "Employment Gap (YY.MM)",
        "placeholder": "e.g., 0.06",
        "order": 27,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "reason_for_change",
        "type": "textarea",
        "label": "Reason for Change",
        "placeholder": "Enter reason",
        "order": 28,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "preferred_role",
        "type": "text",
        "label": "Preferred Role",
        "placeholder": "Enter preferred role",
        "order": 29,
        "default": "",
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      },
      {
        "key": "available_f2f",
        "type": "dropdown",
        "label": "Available for F2F Interview",
        "placeholder": "Select Yes/No",
        "order": 30,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [
          { "label": "Yes", "value": "Yes" },
          { "label": "No", "value": "No" }
        ],
        "validation": {}
      },
      {
        "key": "f2f_tentative_date",
        "type": "date",
        "label": "F2F Tentative Date",
        "placeholder": "Select date",
        "order": 31,
        "default": null,
        "required": false,
        "readonly": false,
        "options": [],
        "validation": {}
      }
    ]
  }
}
