import admin from 'firebase-admin';
import { createFacultyUser } from '../src/store-services/authService.js';
import { firestore } from '../src/firestore.js';

const payload = {
  email: process.env.PROF_EMAIL || 'prof.ccs@school.com',
  password: process.env.PROF_PASSWORD || 'Prof@12345',
  name: process.env.PROF_NAME || 'Prof CCS',
  department: process.env.PROF_DEPARTMENT || 'Computer Science',
  specialization: process.env.PROF_SPECIALIZATION || 'Software Engineering',
  phone: process.env.PROF_PHONE || '09170000099',
  office: process.env.PROF_OFFICE || 'CCS Faculty Room',
};

const now = () => new Date().toISOString();

const upsertFacultyProfile = async (uid, data) => {
  const timestamp = now();
  await firestore.collection('faculties').doc(uid).set(
    {
      id: uid,
      facultyId: uid,
      role: 'faculty',
      email: data.email,
      name: data.name,
      department: data.department,
      specialization: data.specialization,
      phone: data.phone,
      office: data.office,
      updatedAt: timestamp,
      updated_at: timestamp,
      createdAt: timestamp,
      created_at: timestamp,
    },
    { merge: true }
  );
};

const main = async () => {
  try {
    const result = await createFacultyUser(payload);
    await upsertFacultyProfile(result.uid, payload);
    console.log('[create-prof] CREATED', JSON.stringify(result));
    return;
  } catch (error) {
    const code = error?.code || error?.errorInfo?.code || '';
    const message = String(error?.message || error || '');

    if (code.includes('email-already-exists') || message.toLowerCase().includes('email-already-exists')) {
      const existing = await admin.auth().getUserByEmail(payload.email);
      await upsertFacultyProfile(existing.uid, payload);
      console.log('[create-prof] EXISTS', JSON.stringify({ uid: existing.uid, email: payload.email }));
      return;
    }

    throw error;
  }
};

main().catch((error) => {
  console.error('[create-prof] FAILED', error?.message || error);
  process.exit(1);
});
