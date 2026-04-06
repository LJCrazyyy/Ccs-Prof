import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import {
  assignFacultyEvent,
  assignFacultySubject,
  createRecord,
  deleteRecord,
  getAll,
  getById,
  getDisciplineRecords,
  listAdmins,
  messageStudent,
  query,
  reassignScheduleFaculty,
  updateRecord,
} from './store.js';

const app = express();
const port = Number.parseInt(process.env.PORT ?? '8080', 10);

app.use(cors());
app.use(express.json());

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

app.get('/admin/users/admins', async (_request, response) => {
  const admins = await listAdmins();
  response.json(admins);
});

app.get('/student/discipline-records', async (request, response) => {
  const records = await getDisciplineRecords({
    studentId: request.query.studentId,
    email: request.query.email,
  });
  response.json(records);
});

app.put('/admin/faculty/:facultyId/assign-subject', async (request, response) => {
  const updated = await assignFacultySubject(request.params.facultyId, request.body.subject);
  if (!updated) {
    response.status(404).json({ message: 'Faculty not found' });
    return;
  }
  response.json(updated);
});

app.put('/admin/faculty/:facultyId/assign-event', async (request, response) => {
  const updated = await assignFacultyEvent(request.params.facultyId, request.body.event_id);
  if (!updated) {
    response.status(404).json({ message: 'Faculty not found' });
    return;
  }
  response.json(updated);
});

app.post('/admin/faculty/message-student', async (request, response) => {
  const message = await messageStudent(request.body);
  response.status(201).json(message);
});

app.put('/admin/schedules/:scheduleId/reassign', async (request, response) => {
  const updated = await reassignScheduleFaculty(request.params.scheduleId, request.body.faculty_id);
  if (!updated) {
    response.status(404).json({ message: 'Schedule not found' });
    return;
  }
  response.json(updated);
});

app.get('/admin/:collectionName', async (request, response) => {
  const { collectionName } = request.params;
  const filters = request.query;
  const records = Object.keys(filters).length > 0
    ? await query(collectionName, filters)
    : await getAll(collectionName);

  if (records === null) {
    response.status(404).json({ message: 'Collection not found' });
    return;
  }

  response.json(records);
});

app.get('/admin/:collectionName/:id', async (request, response) => {
  const record = await getById(request.params.collectionName, request.params.id);
  if (!record) {
    response.status(404).json({ message: 'Record not found' });
    return;
  }
  response.json(record);
});

app.post('/admin/:collectionName', async (request, response) => {
  const record = await createRecord(request.params.collectionName, request.body);
  if (!record) {
    response.status(404).json({ message: 'Collection not found' });
    return;
  }
  response.status(201).json({ id: record.id, ...record });
});

app.put('/admin/:collectionName/:id', async (request, response) => {
  const record = await updateRecord(request.params.collectionName, request.params.id, request.body);
  if (!record) {
    response.status(404).json({ message: 'Record not found' });
    return;
  }
  response.json(record);
});

app.delete('/admin/:collectionName/:id', async (request, response) => {
  const deleted = await deleteRecord(request.params.collectionName, request.params.id);
  if (!deleted) {
    response.status(404).json({ message: 'Record not found' });
    return;
  }
  response.status(204).send();
});

app.use((_request, response) => {
  response.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Node backend running on http://127.0.0.1:${port}`);
});