# Backend (Node.js + Express)

This backend is a Node.js Express API used by the frontend admin and user pages.

## Prerequisites

- Node.js 18+ (Node.js 20 LTS recommended)
- npm

## Setup

From this folder (`backend/`):

```bash
npm install
```

## Run

Development:

```bash
npm run dev
```

Production-style start:

```bash
npm start
```

Default server URL:

- http://127.0.0.1:8080

## Configuration

- The backend reads `PORT` from environment variables.
- If `PORT` is not set, it defaults to `8080`.

PowerShell example:

```powershell
$env:PORT=9000
npm run dev
```

## Data Storage

- Data is file-backed in `data/db.json`.
- No separate SQL database is required for local development.

## Main API Routes

- `GET /health`
- `GET /admin/:collectionName`
- `GET /admin/:collectionName/:id`
- `POST /admin/:collectionName`
- `PUT /admin/:collectionName/:id`
- `DELETE /admin/:collectionName/:id`
- `GET /admin/users/admins`
- `PUT /admin/faculty/:facultyId/assign-subject`
- `PUT /admin/faculty/:facultyId/assign-event`
- `POST /admin/faculty/message-student`
- `PUT /admin/schedules/:scheduleId/reassign`
- `GET /student/discipline-records`

## Troubleshooting

- `npm error Missing script: "dev"`
	- Run the command inside `backend/`, not the project root.
- `Error [ERR_MODULE_NOT_FOUND]: Cannot find package 'dotenv'`
	- Run `npm install` in `backend/`.
