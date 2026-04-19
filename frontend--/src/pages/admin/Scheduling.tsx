import React, { useEffect, useMemo, useState } from 'react';
import { useAsync } from '../../hooks/useAsync';
import { schedulesDB, facultyDB, studentDB } from '../../lib/database';
import { Card, EmptyState, ErrorMessage, LoadingSpinner } from '../../components/ui/shared';
import { emitSyncEvent, onSyncEvent } from '../../lib/syncEvents';

interface Schedule {
  id: string;
  subject_id?: string;
  subjectId?: string;
  course_id?: string;
  courseId?: string;
  faculty_id?: string;
  facultyId?: string;
  student_id?: string;
  studentId?: string;
  student_ids?: string[];
  students?: string[];
  day?: string;
  start_time?: string;
  end_time?: string;
  startTime?: string;
  endTime?: string;
  room?: string;
  section?: string;
}

interface Faculty {
  id: string | number;
  name: string;
  email?: string;
  department?: string;
}

interface Student {
  id: string | number;
  name: string;
  email?: string;
  idNumber?: string;
  year?: string;
  program?: string;
}

interface Subject {
  id: string | number;
  name?: string;
  code?: string;
  yearLevel?: string;
  department?: string;
}

interface ScheduleFormData {
  subjectId: string;
  facultyId: string;
  section: string;
  yearLevel: string;
  type: 'Lecture' | 'Lab' | 'Both';
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

interface ScheduleFormData {
  facultyId: string;
  courseId: string;
  studentId: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  section: string;
}

type ScheduleFormErrors = Partial<Record<keyof ScheduleFormData, string>>;

type ToastState = {
  type: 'success' | 'error';
  message: string;
} | null;

export const AdminScheduling: React.FC = () => {
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8080';

  const { data: schedules, loading, error, execute: fetchSchedules } = useAsync<Schedule[]>(() =>
    schedulesDB.getAllSchedules().then((data: any) => data as Schedule[])
  );
  const { data: faculties, execute: fetchFaculties } = useAsync<Faculty[]>(() =>
    facultyDB.getAllFaculty().then((data: any) => data as Faculty[])
  );
  const { data: students, execute: fetchStudents } = useAsync<Student[]>(() =>
    studentDB.getAllStudents().then((data: any) => data as Student[])
  );
  const { data: subjects, execute: fetchSubjects } = useAsync<Subject[]>(() =>
    fetch(`${API_BASE}/admin/subjects`).then((response) => response.json()) as Promise<Subject[]>
  );
  const [formData, setFormData] = useState<ScheduleFormData>({
    facultyId: '',
    courseId: '',
    studentId: '',
    day: '',
    startTime: '',
    endTime: '',
    room: '',
    section: '',
  });
  const [formErrors, setFormErrors] = useState<ScheduleFormErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState>(null);

  const [formData, setFormData] = useState<ScheduleFormData>({
    subjectId: '',
    facultyId: '',
    section: '',
    yearLevel: '1st',
    type: 'Lecture',
    day: 'Monday',
    startTime: '08:00',
    endTime: '09:00',
    room: '',
  });
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchSchedules();
    fetchFaculties();
    fetchStudents();
    fetchSubjects();

    // Listen for sync events to refresh data
    const unsubscribe = onSyncEvent(({ detail }) => {
      if (detail.type === 'subjectCreated' || detail.type === 'subjectUpdated' || detail.type === 'subjectDeleted') {
        fetchSubjects();
      }
      if (detail.type === 'facultyCreated' || detail.type === 'facultyUpdated' || detail.type === 'facultyDeleted') {
        fetchFaculties();
      }
      if (detail.type === 'studentCreated' || detail.type === 'studentUpdated' || detail.type === 'studentDeleted') {
        fetchStudents();
      }
    });

    return unsubscribe;
  }, [fetchSchedules, fetchFaculties, fetchStudents, fetchSubjects]);

  useEffect(() => {
    if (!toast) return;
    const timeoutId = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timeoutId);
  }, [toast]);

  const facultyById = useMemo(() => {
    const map = new Map<string, Faculty>();
    (faculties || []).forEach((f) => map.set(String(f.id), f));
    return map;
  }, [faculties]);

  const studentById = useMemo(() => {
    const map = new Map<string, Student>();
    (students || []).forEach((s) => map.set(String(s.id), s));
    return map;
  }, [students]);

  const subjectById = useMemo(() => {
    const map = new Map<string, Subject>();
    (subjects || []).forEach((s) => map.set(String(s.id), s));
    return map;
  }, [subjects]);

  const getCourseLabel = (schedule: Schedule) => {
    const subjectId = schedule.subject_id || schedule.subjectId || schedule.course_id || schedule.courseId;
    if (!subjectId) return '-';
    const subject = subjectById.get(String(subjectId));
    if (!subject) return String(subjectId);
    return subject.code ? `${subject.code}${subject.name ? ` - ${subject.name}` : ''}` : subject.name || String(subjectId);
  };

  const getTimeLabel = (schedule: Schedule) => {
    const start = schedule.start_time || schedule.startTime;
    const end = schedule.end_time || schedule.endTime;
    return start && end ? `${start} - ${end}` : '-';
  };

  const getCourseOptionLabel = (course: Course) => {
    if (course.code && course.name) return `${course.code} - ${course.name}`;
    return course.code || course.name || String(course.id);
  };

  const updateField = <K extends keyof ScheduleFormData>(field: K, value: ScheduleFormData[K]) => {
    setFormData((previous) => ({ ...previous, [field]: value }));
    setFormErrors((previous) => {
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  const validateForm = (data: ScheduleFormData): ScheduleFormErrors => {
    const errors: ScheduleFormErrors = {};

    if (!data.facultyId.trim()) errors.facultyId = 'Faculty is required.';
    if (!data.courseId.trim()) errors.courseId = 'Course or subject is required.';
    if (!data.day.trim()) errors.day = 'Day is required.';
    if (!data.startTime.trim()) errors.startTime = 'Start time is required.';
    if (!data.endTime.trim()) errors.endTime = 'End time is required.';
    if (!data.room.trim()) errors.room = 'Room is required.';

    if (data.startTime && data.endTime && data.startTime >= data.endTime) {
      errors.endTime = 'End time must be later than start time.';
    }

    return errors;
  };

  const resetForm = () => {
    setFormData({
      facultyId: '',
      courseId: '',
      studentId: '',
      day: '',
      startTime: '',
      endTime: '',
      room: '',
      section: '',
    });
    setFormErrors({});
  };

  const handleCreateSchedule = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const validationErrors = validateForm(formData);

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setToast({ type: 'error', message: 'Please fix the highlighted fields before submitting.' });
      return;
    }

    const payload: Record<string, any> = {
      faculty_id: formData.facultyId,
      facultyId: formData.facultyId,
      course_id: formData.courseId,
      courseId: formData.courseId,
      subject_id: formData.courseId,
      subjectId: formData.courseId,
      day: formData.day,
      start_time: formData.startTime,
      end_time: formData.endTime,
      startTime: formData.startTime,
      endTime: formData.endTime,
      room: formData.room,
      section: formData.section || undefined,
    };

    if (formData.studentId) {
      payload.student_id = formData.studentId;
      payload.studentId = formData.studentId;
      payload.student_ids = [formData.studentId];
      payload.students = [formData.studentId];
    }

    try {
      setSubmitting(true);
      const createdScheduleId = await schedulesDB.addSchedule(payload);

      if (formData.studentId && createdScheduleId) {
        try {
          const studentRecord = (await studentDB.getStudent(formData.studentId)) as Record<string, any> | null;
          const currentEnrolled = [
            ...((studentRecord?.enrolled_classes as string[] | undefined) ?? []),
            ...((studentRecord?.enrolledClasses as string[] | undefined) ?? []),
          ]
            .map((value) => String(value ?? '').trim())
            .filter(Boolean);

          const nextEnrolled = Array.from(new Set([...currentEnrolled, String(createdScheduleId)]));

          await studentDB.updateStudent(formData.studentId, {
            enrolled_classes: nextEnrolled,
            enrolledClasses: nextEnrolled,
          });
        } catch {
          // Schedule was created successfully; enrollment linkage can be retried manually.
        }
      }

      setToast({ type: 'success', message: 'Schedule created successfully.' });
      resetForm();
      await fetchSchedules();
    } catch (createError) {
      const message = createError instanceof Error ? createError.message : 'Failed to create schedule.';
      setToast({ type: 'error', message });
    } finally {
      setSubmitting(false);
    }
  };

  const facultySchedules = useMemo(() => {
    return (schedules || []).filter((schedule) => !!(schedule.faculty_id || schedule.facultyId));
  }, [schedules]);

  const subjectSchedules = useMemo(() => {
    return (schedules || []).filter((schedule) => !!(schedule.subject_id || schedule.subjectId || schedule.course_id || schedule.courseId));
  }, [schedules]);

  const studentSchedules = useMemo(() => {
    return (schedules || []).filter(
      (schedule) =>
        !!(schedule.student_id || schedule.studentId) ||
        (Array.isArray(schedule.student_ids) && schedule.student_ids.length > 0) ||
        (Array.isArray(schedule.students) && schedule.students.length > 0)
    );
  }, [schedules]);

  const parseTimeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const getScheduleDurationHours = (schedule: Schedule) => {
    const start = schedule.start_time || schedule.startTime;
    const end = schedule.end_time || schedule.endTime;
    if (!start || !end) return 0;
    const diff = parseTimeToMinutes(end) - parseTimeToMinutes(start);
    return diff > 0 ? diff / 60 : 0;
  };

  const getFacultyWeeklyHours = (facultyId: string) =>
    (facultySchedules || [])
      .filter((schedule) => String(schedule.faculty_id || schedule.facultyId || '') === facultyId)
      .reduce((total, schedule) => total + getScheduleDurationHours(schedule), 0);

  const validateAssignment = () => {
    if (!formData.facultyId) return 'Please select a faculty member.';
    if (!formData.subjectId) return 'Please select a subject.';
    if (!formData.section) return 'Please enter a section.';
    if (!formData.day) return 'Please select a day.';
    if (!formData.startTime || !formData.endTime) return 'Please enter both start and end times.';

    const startMinutes = parseTimeToMinutes(formData.startTime);
    const endMinutes = parseTimeToMinutes(formData.endTime);
    if (endMinutes <= startMinutes) return 'End time must be after start time.';

    const duration = (endMinutes - startMinutes) / 60;
    const currentHours = getFacultyWeeklyHours(formData.facultyId);
    if (currentHours + duration > 21) return 'This assignment would exceed the faculty member’s 21-hour weekly limit.';

    const conflict = facultySchedules.some((schedule) => {
      const scheduleFacultyId = String(schedule.faculty_id || schedule.facultyId || '');
      if (scheduleFacultyId !== formData.facultyId) return false;
      if ((schedule.day || '').toLowerCase() !== formData.day.toLowerCase()) return false;

      const existingStart = parseTimeToMinutes(schedule.start_time || schedule.startTime || '00:00');
      const existingEnd = parseTimeToMinutes(schedule.end_time || schedule.endTime || '00:00');
      return startMinutes < existingEnd && endMinutes > existingStart;
    });

    if (conflict) return 'This time conflicts with an existing assignment for the selected faculty.';

    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);

    const validationError = validateAssignment();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    try {
      const scheduleToSave = {
        ...formData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await schedulesDB.addSchedule(scheduleToSave as any);
      setFormSuccess('Schedule assigned successfully.');
      setFormData({
        subjectId: '',
        facultyId: '',
        section: '',
        yearLevel: '1st',
        type: 'Lecture',
        day: 'Monday',
        startTime: '08:00',
        endTime: '09:00',
        room: '',
      });
      fetchSchedules();
      emitSyncEvent('scheduleCreated', scheduleToSave, 'Scheduling');
    } catch (submitError) {
      setFormError('Failed to save schedule assignment.');
      console.error(submitError);
    }
  };

  const selectedFacultyHours = formData.facultyId ? getFacultyWeeklyHours(formData.facultyId) : 0;

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50">
          <div
            className={`min-w-[280px] max-w-sm rounded-lg px-4 py-3 shadow-lg text-sm font-medium border ${
              toast.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-700'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
            role="status"
            aria-live="polite"
          >
            {toast.message}
          </div>
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800 mb-2">Scheduling Management</h1>
      <p className="text-gray-600 mb-8">Assign faculty to subjects, sections, and meeting times while keeping weekly load under 21 hours.</p>

      {loading && <LoadingSpinner fullScreen={false} />}
      {error && <ErrorMessage message="Failed to load schedules from backend." />}

<<<<<<< HEAD
      <Card title="Create Schedule" className="mb-6">
        <form onSubmit={handleCreateSchedule} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Faculty</label>
              <select
                value={formData.facultyId}
                onChange={(event) => updateField('facultyId', event.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  formErrors.facultyId ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select faculty</option>
=======
      <Card title="Assign Faculty to Subject" className="mb-6">
        {formError && <ErrorMessage message={formError} />}
        {formSuccess && <div className="rounded-lg bg-green-50 border border-green-200 p-4 text-green-800">{formSuccess}</div>}
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={formData.subjectId}
                onChange={(e) => setFormData({ ...formData, subjectId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Subject</option>
                {(subjects || []).map((subject) => (
                  <option key={subject.id} value={String(subject.id)}>
                    {subject.code ? `${subject.code} - ${subject.name}` : subject.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Faculty</label>
              <select
                value={formData.facultyId}
                onChange={(e) => setFormData({ ...formData, facultyId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select Faculty</option>
>>>>>>> ea6091d96e8feaa8a9551935f7cc418dee245e70
                {(faculties || []).map((faculty) => (
                  <option key={faculty.id} value={String(faculty.id)}>
                    {faculty.name}
                  </option>
                ))}
              </select>
<<<<<<< HEAD
              {formErrors.facultyId && <p className="text-red-600 text-xs mt-1">{formErrors.facultyId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course / Subject</label>
              <select
                value={formData.courseId}
                onChange={(event) => updateField('courseId', event.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  formErrors.courseId ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select course / subject</option>
                {(courses || []).map((course) => (
                  <option key={course.id} value={String(course.id)}>
                    {getCourseOptionLabel(course)}
                  </option>
                ))}
              </select>
              {formErrors.courseId && <p className="text-red-600 text-xs mt-1">{formErrors.courseId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
              <select
                value={formData.day}
                onChange={(event) => updateField('day', event.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  formErrors.day ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Select day</option>
=======
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Section</label>
              <input
                type="text"
                value={formData.section}
                onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. A"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year Level</label>
              <select
                value={formData.yearLevel}
                onChange={(e) => setFormData({ ...formData, yearLevel: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value as ScheduleFormData['type'] })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab</option>
                <option value="Both">Both</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Day</label>
              <select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
>>>>>>> ea6091d96e8feaa8a9551935f7cc418dee245e70
                <option value="Monday">Monday</option>
                <option value="Tuesday">Tuesday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Thursday">Thursday</option>
                <option value="Friday">Friday</option>
<<<<<<< HEAD
                <option value="Saturday">Saturday</option>
              </select>
              {formErrors.day && <p className="text-red-600 text-xs mt-1">{formErrors.day}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Room</label>
              <input
                type="text"
                value={formData.room}
                onChange={(event) => updateField('room', event.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  formErrors.room ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="e.g. Room 301"
                required
              />
              {formErrors.room && <p className="text-red-600 text-xs mt-1">{formErrors.room}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(event) => updateField('startTime', event.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  formErrors.startTime ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {formErrors.startTime && <p className="text-red-600 text-xs mt-1">{formErrors.startTime}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(event) => updateField('endTime', event.target.value)}
                className={`w-full px-3 py-2 border rounded-lg ${
                  formErrors.endTime ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {formErrors.endTime && <p className="text-red-600 text-xs mt-1">{formErrors.endTime}</p>}
=======
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
              <input
                type="time"
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
              <input
                type="time"
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
>>>>>>> ea6091d96e8feaa8a9551935f7cc418dee245e70
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
<<<<<<< HEAD
              <label className="block text-sm font-medium text-gray-700 mb-1">Section (Optional)</label>
              <input
                type="text"
                value={formData.section}
                onChange={(event) => updateField('section', event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                placeholder="e.g. BSIT 2A"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Student (Optional)</label>
              <select
                value={formData.studentId}
                onChange={(event) => updateField('studentId', event.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="">No specific student</option>
                {(students || []).map((student) => (
                  <option key={student.id} value={String(student.id)}>
                    {student.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-2 rounded-lg font-medium"
            >
              {submitting ? 'Creating...' : 'Create Schedule'}
            </button>
            <button
              type="button"
              onClick={resetForm}
              disabled={submitting}
              className="bg-gray-100 hover:bg-gray-200 disabled:bg-gray-50 text-gray-700 px-6 py-2 rounded-lg font-medium"
            >
              Reset
            </button>
          </div>
=======
              <label className="block text-sm font-medium text-gray-700 mb-2">Room</label>
              <input
                type="text"
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. IT-101"
              />
            </div>
            <div className="flex flex-col justify-end">
              <div className="text-sm text-gray-600 mb-2">Faculty weekly load</div>
              <div className="rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-sm text-gray-700">
                {formData.facultyId
                  ? `${subjectById.get(formData.subjectId)?.name ? subjectById.get(formData.subjectId)?.name : 'Selected faculty'} has ${selectedFacultyHours.toFixed(1)} / 21 hours assigned.`
                  : 'Select a faculty member to preview current weekly hours.'}
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
          >
            Assign Schedule
          </button>
>>>>>>> ea6091d96e8feaa8a9551935f7cc418dee245e70
        </form>
      </Card>

      <Card title="Faculty Schedule Details">
        {!facultySchedules || facultySchedules.length === 0 ? (
          <EmptyState
            icon="Calendar"
            title="No faculty schedules found"
            description="No faculty schedule records are available from the backend."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-500 text-xs uppercase">
                  <th className="text-left p-4">Faculty</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Department</th>
                  <th className="text-left p-4">Course / Subject</th>
                  <th className="text-left p-4">Section</th>
                  <th className="text-left p-4">Day</th>
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Room</th>
                </tr>
              </thead>
              <tbody>
                {facultySchedules.map((schedule) => {
                  const facultyId = String(schedule.faculty_id || schedule.facultyId || '');
                  const faculty = facultyById.get(facultyId);
                  return (
                    <tr key={`faculty-${schedule.id}`} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{faculty?.name || facultyId || '-'}</td>
                      <td className="p-4">{faculty?.email || '-'}</td>
                      <td className="p-4">{faculty?.department || '-'}</td>
                      <td className="p-4">{getCourseLabel(schedule)}</td>
                      <td className="p-4">{schedule.section || '-'}</td>
                      <td className="p-4">{schedule.day || '-'}</td>
                      <td className="p-4">{getTimeLabel(schedule)}</td>
                      <td className="p-4">{schedule.room || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card title="Student Schedule Details" className="mt-6">
        {!studentSchedules || studentSchedules.length === 0 ? (
          <EmptyState
            icon="Calendar"
            title="No student schedules found"
            description="No student schedule records are available from the backend."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b text-gray-500 text-xs uppercase">
                  <th className="text-left p-4">Student</th>
                  <th className="text-left p-4">ID Number</th>
                  <th className="text-left p-4">Program / Year</th>
                  <th className="text-left p-4">Faculty</th>
                  <th className="text-left p-4">Course / Subject</th>
                  <th className="text-left p-4">Day</th>
                  <th className="text-left p-4">Time</th>
                  <th className="text-left p-4">Room</th>
                </tr>
              </thead>
              <tbody>
                {studentSchedules.map((schedule) => {
                  const primaryStudentId = String(
                    schedule.student_id ||
                      schedule.studentId ||
                      (Array.isArray(schedule.student_ids) && schedule.student_ids[0]) ||
                      (Array.isArray(schedule.students) && schedule.students[0]) ||
                      ''
                  );
                  const student = studentById.get(primaryStudentId);
                  const facultyId = String(schedule.faculty_id || schedule.facultyId || '');
                  const faculty = facultyById.get(facultyId);

                  return (
                    <tr key={`student-${schedule.id}`} className="border-b hover:bg-gray-50">
                      <td className="p-4 font-medium">{student?.name || primaryStudentId || '-'}</td>
                      <td className="p-4">{student?.idNumber || '-'}</td>
                      <td className="p-4">{student ? `${student.program || '-'} / ${student.year || '-'}` : '-'}</td>
                      <td className="p-4">{faculty?.name || facultyId || '-'}</td>
                      <td className="p-4">{getCourseLabel(schedule)}</td>
                      <td className="p-4">{schedule.day || '-'}</td>
                      <td className="p-4">{getTimeLabel(schedule)}</td>
                      <td className="p-4">{schedule.room || '-'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
};
