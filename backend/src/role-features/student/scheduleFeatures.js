export const scheduleFeatures = [
  {
    key: 'studentSchedule',
    method: 'GET',
    path: '/student/:studentId/schedule',
    storeFunction: 'getStudentSchedule',
    description: 'Get student enrolled schedule list.',
  },
  {
    key: 'studentScheduleDetails',
    method: 'GET',
    path: '/student/:studentId/schedule/:classId',
    storeFunction: 'getScheduleDetails',
    description: 'Get one enrolled class detail with materials and assessments.',
  },
  {
    key: 'studentScheduleEnroll',
    method: 'POST',
    path: '/student/:studentId/schedule/enroll/:classId',
    storeFunction: 'enrollStudentCourse',
    description: 'Submit enrollment request for class with conflict checks.',
  },
];