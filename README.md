# CampusConnect — VNR VJIET Campus Event Management

A responsive Flask + Oracle Database project for managing campus events and student registrations.

## Features
- Dashboard with event, student and registration totals
- Event creation and removal
- Event search and category filters
- Student registration modal with duplicate and capacity checks
- Registration ledger with live client-side search
- Reports using Oracle `JOIN`, `GROUP BY`, and aggregate functions
- Responsive sidebar and accessible interaction patterns
- Oracle-backed data storage

## Requirements
- Python 3.10+
- Oracle Database with a pluggable database such as `XEPDB1`
- An application schema user with permission to create tables

## Setup on Windows / VS Code
1. Open this folder in VS Code.
2. Create a virtual environment:
   ```powershell
   py -m venv .venv
   ```
3. Activate it:
   ```powershell
   .\.venv\Scripts\Activate.ps1
   ```
   If PowerShell blocks activation, run `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` in that terminal, then activate again.
4. Install dependencies:
   ```powershell
   python -m pip install -r requirements.txt
   ```
5. Set your real Oracle application-user credentials in the same terminal:
   ```powershell
   $env:DB_USER="CAMPUSCONNECT"
   $env:DB_PASSWORD="YOUR_ACTUAL_PASSWORD"
   $env:DB_DSN="127.0.0.1:1521/XEPDB1"
   ```
6. Start:
   ```powershell
   python app.py
   ```
7. Open `http://127.0.0.1:5000`.

The first run creates missing tables and inserts demo students/events only when the relevant tables are empty. Use a dedicated application schema, not the Oracle `SYSTEM` account, for normal use.

## Demo registrations
The app does not pre-create demo registrations. Register a student from an event card; the form creates their student record if the email is new.

## Pages
- `/` dashboard
- `/registrations` registration ledger
- `/reports` reports
- `/health` database connectivity check
- `/api/events` JSON event data

## Before real college deployment
This is a student project prototype, not an approved production college service. Before using it for real student data, add authentication and role-based access, CSRF protection, secure secret management, audit logging, backups, HTTPS, and approval from the college IT team. Do not expose the development server publicly.
