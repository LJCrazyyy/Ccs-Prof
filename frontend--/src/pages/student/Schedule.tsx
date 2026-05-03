import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { schedulesDB } from '../../lib/database';

interface ScheduleClass {
  classId: string;
  courseCode: string;
  courseName: string;
  schedule: string;
  section?: string;
  room?: string;
  units?: number;
  type?: string;
  materials?: ScheduleMaterial[];
  quizzes?: ScheduleAssessment[];
  exams?: ScheduleAssessment[];
  activities?: ScheduleAssessment[];
}

interface StudentScheduleData {
  studentId: string;
  enrolledClasses: ScheduleClass[];
  totalCourses: number;
}

interface ScheduleMaterial {
  id: string;
  title: string;
  type: string;
  url?: string;
  uploadedAt?: string;
}

interface ScheduleAssessment {
  id: string;
  title: string;
  dueDate?: string | null;
  date?: string | null;
  time?: string | null;
  status?: string;
}

interface ScheduleDetails extends ScheduleClass {
  faculty?: string;
  description?: string;
  materials?: ScheduleMaterial[];
  assessments?: {
    quizzes?: ScheduleAssessment[];
    exams?: ScheduleAssessment[];
    activities?: ScheduleAssessment[];
  };
}

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const StudentSchedule: React.FC = () => {
  const { user } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [details, setDetails] = useState<ScheduleDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const [enrollClassId, setEnrollClassId] = useState('');
  const [enrollMessage, setEnrollMessage] = useState<string | null>(null);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      setSchedule([]);
      setSelectedClassId('');
      setDetails(null);
      return;
    }

    const fetchSchedule = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = (await schedulesDB.getStudentSchedule(user.id)) as StudentScheduleData;
        const enrolledClasses = data?.enrolledClasses ?? [];
        setSchedule(enrolledClasses);
        setSelectedClassId((current) => current || enrolledClasses[0]?.classId || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load schedule');
        setSchedule([]);
        setSelectedClassId('');
      } finally {
        setLoading(false);
      }
    };

    void fetchSchedule();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id || !selectedClassId) {
      setDetails(null);
      return;
    }

    const fetchDetails = async () => {
      setDetailsLoading(true);
      setDetailsError(null);

      try {
        const data = (await schedulesDB.getStudentScheduleDetails(user.id, selectedClassId)) as ScheduleDetails;
        setDetails(data);
      } catch (err) {
        setDetails(null);
        setDetailsError(err instanceof Error ? err.message : 'Unable to load class details');
      } finally {
        setDetailsLoading(false);
      }
    };

    void fetchDetails();
  }, [selectedClassId, user?.id]);

  const selectedClass = useMemo(
    () => schedule.find((item) => String(item.classId) === String(selectedClassId)) ?? null,
    [schedule, selectedClassId]
  );

  const groupedByDay = useMemo(() => {
    return days.map((day) => ({
      day,
      classes: schedule.filter((item) => (item.schedule || '').toLowerCase().includes(day.toLowerCase())),
    }));
  }, [schedule]);

  const handleEnroll = async () => {
    if (!user?.id || !enrollClassId.trim()) return;

    try {
      setEnrolling(true);
      setEnrollMessage(null);
      await schedulesDB.enrollStudentCourse(user.id, enrollClassId.trim());
      setEnrollMessage('Enrollment request submitted. If there is no conflict, it will be sent for approval.');
      setEnrollClassId('');

      const refreshed = (await schedulesDB.getStudentSchedule(user.id)) as StudentScheduleData;
      const enrolledClasses = refreshed?.enrolledClasses ?? [];
      setSchedule(enrolledClasses);
      setSelectedClassId((current) => current || enrolledClasses[0]?.classId || '');
    } catch (err) {
      setEnrollMessage(err instanceof Error ? err.message : 'Unable to submit enrollment request');
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading schedule...</div>;
  }

  if (error) {
    return <div className="bg-red-100 text-red-800 p-4 rounded-lg">{error}</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Schedule</h1>
        <p className="text-gray-600 mt-2">Open a class to see materials, quizzes, exams, and activities.</p>
      </div>

      <div className="mb-8 card">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="enrollClassId">
              Request Enrollment for Irregular Class
            </label>
            <input
              id="enrollClassId"
              value={enrollClassId}
              onChange={(event) => setEnrollClassId(event.target.value)}
              placeholder="Enter class ID"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={handleEnroll}
            disabled={enrolling || enrollClassId.trim().length === 0}
            className="rounded-lg bg-primary px-5 py-2.5 font-semibold text-white transition hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {enrolling ? 'Submitting...' : 'Request Approval'}
          </button>
        </div>
        {enrollMessage && <p className="mt-3 text-sm text-gray-700">{enrollMessage}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Subjects</h2>
          {schedule.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              <p className="font-medium">No classes enrolled yet</p>
              <p className="text-sm mt-1">Your enrolled classes will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {schedule.map((item) => {
                const isActive = String(item.classId) === String(selectedClassId);

                return (
                  <button
                    key={item.classId}
                    type="button"
                    onClick={() => setSelectedClassId(item.classId)}
                    className={`w-full rounded-lg border p-4 text-left transition ${
                      isActive ? 'border-primary bg-teal-50 shadow-sm' : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-800">
                          {item.courseCode} - {item.courseName}
                        </p>
                        <p className="text-sm text-gray-600">{item.schedule}</p>
                      </div>
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                        {item.section || 'No section'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 md:grid-cols-2">
            {groupedByDay.map(({ day, classes }) => (
              <div key={day} className="rounded-lg border border-gray-200 p-3">
                <h3 className="mb-2 text-sm font-semibold text-gray-700">{day}</h3>
                {classes.length > 0 ? (
                  <div className="space-y-2">
                    {classes.map((item) => (
                      <div key={item.classId} className="rounded-md bg-gray-50 px-3 py-2 text-xs text-gray-700">
                        {item.courseCode}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No classes</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Class Details</h2>
          {detailsLoading ? (
            <div className="py-8 text-center text-gray-500">Loading class details...</div>
          ) : detailsError ? (
            <div className="rounded-lg bg-red-100 p-4 text-red-800">{detailsError}</div>
          ) : details ? (
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500">Selected Class</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {details.courseCode} - {details.courseName}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{details.description}</p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Faculty</p>
                  <p className="font-semibold text-gray-800">{details.faculty || 'TBD'}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Schedule</p>
                  <p className="font-semibold text-gray-800">{details.schedule}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Room</p>
                  <p className="font-semibold text-gray-800">{details.room || 'TBD'}</p>
                </div>
                <div className="rounded-lg bg-gray-50 p-3">
                  <p className="text-xs uppercase tracking-wider text-gray-500">Units</p>
                  <p className="font-semibold text-gray-800">{details.units || 3}</p>
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-semibold text-gray-800">Upcoming Assessments</h4>
                <div className="space-y-4">
                  {(['quizzes', 'activities', 'exams'] as const).map((group) => {
                    const items = details.assessments?.[group] || [];

                    return (
                      <div key={group} className="rounded-lg border border-gray-200 p-3">
                        <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-gray-500">{group}</p>
                        {items.length > 0 ? (
                          <div className="space-y-2">
                            {items.map((item) => (
                              <div key={item.id} className="flex items-start justify-between gap-3 rounded-md bg-gray-50 p-3">
                                <div>
                                  <p className="font-medium text-gray-800">{item.title}</p>
                                  <p className="text-xs text-gray-600">
                                    {item.dueDate || item.date || 'No deadline set'}
                                    {item.time ? ` • ${item.time}` : ''}
                                  </p>
                                </div>
                                <span className="rounded-full bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-700">
                                  {item.status || 'pending'}
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No {group} scheduled.</p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="mb-3 text-lg font-semibold text-gray-800">Materials</h4>
                {details.materials && details.materials.length > 0 ? (
                  <div className="space-y-2">
                    {details.materials.map((material) => (
                      <div key={material.id} className="rounded-lg border border-gray-200 px-4 py-3">
                        <p className="font-medium text-gray-800">{material.title}</p>
                        <p className="text-sm text-gray-600">{material.type}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No materials uploaded yet.</p>
                )}
              </div>
            </div>
          ) : selectedClass ? (
            <div className="space-y-2 text-gray-600">
              <p className="font-semibold text-gray-800">
                {selectedClass.courseCode} - {selectedClass.courseName}
              </p>
              <p>{selectedClass.schedule}</p>
              <p>{selectedClass.room || 'TBD'}</p>
            </div>
          ) : (
            <div className="py-8 text-center text-gray-500">Select a class to preview its details.</div>
          )}
        </div>
      </div>
    </div>
  );
};
