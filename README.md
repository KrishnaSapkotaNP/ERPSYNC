# ERP Attendance Extension

A browser extension that extracts attendance data directly from ERP webpages and converts it into a clean, structured format.

The project is designed to work across different college and university ERP systems instead of being tied to a single institution.

---

##  Features

-  Automatically detects attendance tables
-  Extracts course code and subject name
-  Extracts present and absent counts
-  Calculates attendance percentage automatically
-  Runs directly inside the browser
-  No need to manually copy attendance data
---

##  How It Works

The extension runs a content script on ERP webpages.

It:

1. Scans the webpage for tables.
2. Identifies tables that contain attendance information.
3. Reads the table headers and rows.
4. Extracts relevant attendance fields.
5. Normalizes the data into a common structure.
6. Calculates the attendance percentage.

### Attendance Calculation

The extension calculates attendance using:

```text
Attendance % = Present Count / Total Count × 100
```
## How to Install

- Download and extract this repository.
- Go to Chrome Extensions(chrome://extensions/) or Extension page of any desired browser.
- Enable developer mode
- Then click Load Unpacked.
- Then Select the folder and you are good to go.
