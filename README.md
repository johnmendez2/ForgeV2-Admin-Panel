# ForgeV2 Admin Panel

This README explains how to run the **backend** and **frontend** for the ForgeV2 Admin Panel in local development.

---

## How to Run

### 1) Backend

#### macOS / Linux
```bash
cd backend
chmod +x start.sh   # only needed once
./start.sh
```

#### Windows
Use one of the following:

**Git Bash (recommended)**
```bash
cd backend
./start.sh
```

**Windows Subsystem for Linux (WSL)**
```powershell
wsl
cd /mnt/c/path/to/ForgeV2/backend
./start.sh
```

> Note: If running from plain Command Prompt/PowerShell, you’ll need a POSIX shell to execute `start.sh` or run the equivalent commands from that script manually.

---

### 2) Frontend
```bash
cd frontend
npm install
npm start
```

By default the app will be available at http://localhost:3000 unless configured otherwise.

---

## Notes
- Start the **backend first**, then the **frontend**.
- Ensure any required environment variables are set (e.g., `.env` files for backend/frontend).
- If you run into port conflicts, stop any processes using the same ports or update the configuration.
