# Node Backend

This folder now runs a small Express API that matches the frontend admin/data routes.

## Run

```bash
npm install
npm run dev
```

The server starts on `http://127.0.0.1:8080` by default.

## Endpoints

- `GET /health`
- `GET /admin/:collection`
- `GET /admin/:collection/:id`
- `POST /admin/:collection`
- `PUT /admin/:collection/:id`
- `DELETE /admin/:collection/:id`
- `GET /admin/users/admins`
- `PUT /admin/faculty/:facultyId/assign-subject`
- `PUT /admin/faculty/:facultyId/assign-event`
- `POST /admin/faculty/message-student`
- `PUT /admin/schedules/:scheduleId/reassign`
- `GET /student/discipline-records`

## Storage

Data is stored in `data/db.json` as a simple JSON file so the API works without a separate database.
