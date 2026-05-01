import { randomUUID } from 'node:crypto';
import {
  getAll,
  loadDb,
  normalizeRecord,
  nowIso,
  saveDb,
  updateRecord,
  withWriteLock,
} from './core.js';

export const listAdmins = async () => {
  const users = await getAll('users');
  return (users ?? []).filter((user) => String(user.role).toLowerCase() === 'admin');
};

export const assignFacultySubject = async (facultyId, subject) =>
  withWriteLock(async () => {
    const db = await loadDb();
    const normalizedSubject = String(subject ?? '').trim();

    if (!normalizedSubject) {
      return null;
    }

    const allFaculties = (db.faculties ?? []).map(normalizeRecord);
    const allSubjects = (db.subjects ?? []).map(normalizeRecord);
    const allCourses = (db.courses ?? []).map(normalizeRecord);
    const allSchedules = (db.schedules ?? []).map(normalizeRecord);

    const facultyIndex = allFaculties.findIndex((faculty) => String(faculty.id) === String(facultyId));
    if (facultyIndex === -1) {
      return null;
    }

    const now = nowIso();
    const normalizedInput = normalizedSubject.toLowerCase();

    const matchedCourse = allCourses.find((course) => {
      const candidates = [course.id, course.code, course.name]
        .map((value) => String(value ?? '').trim().toLowerCase())
        .filter(Boolean);
      return candidates.includes(normalizedInput);
    });

    const matchesSubject = (record) => {
      const candidates = [record.id, record.code, record.name]
        .map((value) => String(value ?? '').trim().toLowerCase())
        .filter(Boolean);

      if (candidates.includes(normalizedInput)) {
        return true;
      }

      if (!matchedCourse) {
        return false;
      }

      const courseLinkedCandidates = [
        record.course_id,
        record.courseId,
        record.subject_id,
        record.subjectId,
      ]
        .map((value) => String(value ?? '').trim().toLowerCase())
        .filter(Boolean);

      return courseLinkedCandidates.includes(String(matchedCourse.id).toLowerCase());
    };

    const matchesSchedule = (record) => {
      const candidates = [
        record.id,
        record.classId,
        record.course_id,
        record.courseId,
        record.subject_id,
        record.subjectId,
        record.code,
        record.courseCode,
        record.name,
        record.courseName,
      ]
        .map((value) => String(value ?? '').trim().toLowerCase())
        .filter(Boolean);

      if (candidates.includes(normalizedInput)) {
        return true;
      }

      if (!matchedCourse) {
        return false;
      }

      const courseCandidates = [matchedCourse.id, matchedCourse.code, matchedCourse.name]
        .map((value) => String(value ?? '').trim().toLowerCase())
        .filter(Boolean);

      return courseCandidates.some((candidate) => candidates.includes(candidate));
    };

    const updatedFaculty = normalizeRecord({
      ...allFaculties[facultyIndex],
      subject: normalizedSubject,
      assigned_subject: normalizedSubject,
      specialization: normalizedSubject,
      updated_at: now,
      updatedAt: now,
    });
    allFaculties[facultyIndex] = updatedFaculty;

    db.subjects = allSubjects.map((subjectRecord) => {
      if (!matchesSubject(subjectRecord)) {
        return subjectRecord;
      }

      return normalizeRecord({
        ...subjectRecord,
        faculty_id: String(facultyId),
        facultyId: String(facultyId),
        updated_at: now,
        updatedAt: now,
      });
    });

    db.schedules = allSchedules.map((scheduleRecord) => {
      if (!matchesSchedule(scheduleRecord)) {
        return scheduleRecord;
      }

      return normalizeRecord({
        ...scheduleRecord,
        faculty_id: String(facultyId),
        facultyId: String(facultyId),
        updated_at: now,
        updatedAt: now,
      });
    });

    db.faculties = allFaculties;
    await saveDb(db);
    return updatedFaculty;
  });

export const assignFacultyEvent = async (facultyId, eventId) =>
  updateRecord('faculties', facultyId, { event_id: eventId, eventId });

export const messageStudent = async (payload) =>
  withWriteLock(async () => {
    const db = await loadDb();
    const timestamp = nowIso();
    const message = normalizeRecord({
      id: randomUUID(),
      ...payload,
      created_at: timestamp,
      updated_at: timestamp,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    db.messages = [...(db.messages ?? []), message];
    await saveDb(db);
    return message;
  });

export const reassignScheduleFaculty = async (scheduleId, facultyId) =>
  updateRecord('schedules', scheduleId, { faculty_id: facultyId, facultyId });
