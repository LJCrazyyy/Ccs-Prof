# ITEW6 Project Setup Guide

This project currently uses:
- Node.js backend (Express) in `backend/`
- React + Vite frontend in `frontend--/`

## Prerequisites

Install the following before running the project:
- Node.js 18+ (Node.js 20 LTS recommended)
- npm (included with Node.js)

## 1) Backend Setup and Run

Open a terminal in the project root, then run:

```bash
cd backend
npm install
npm run dev
```

Backend runs at:
- http://127.0.0.1:8080

### Backend Notes

- Data is stored in `backend/data/db.json`.
- Default backend port is `8080`.
- To change the backend port (PowerShell):

```powershell
$env:PORT=9000
npm run dev
```

## 2) Frontend Setup and Run

Open another terminal in the project root, then run:

```bash
cd frontend--
npm install
npm run dev
```

Frontend default URL:
- http://localhost:5173

If port `5173` is already in use, Vite will auto-switch (for example to `5174`).

## 3) Run Both at the Same Time

Use two terminals:

Terminal 1 (backend):

```bash
cd backend
npm run dev
```

Terminal 2 (frontend):

```bash
cd frontend--
npm run dev
```

## 4) Production Build (Frontend)

```bash
cd frontend--
npm run build
npm run preview
```

## 5) Quick Troubleshooting

- `npm error Missing script: "dev"`
  - You are likely in the wrong folder. Run commands inside `backend/` or `frontend--/`.
- `Cannot find package 'dotenv'`
  - Run `npm install` in `backend/`.
- `Port 5173 is in use`
  - This is expected behavior; Vite will choose another available port.

## Project Structure (Relevant Folders)

- `backend/` - Node.js API server
- `backend/src/` - Backend source code
- `backend/data/` - JSON data store
- `frontend--/` - React + Vite frontend
