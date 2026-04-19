export const eventFeatures = [
  {
    key: 'studentEvents',
    method: 'GET',
    path: '/student/:studentId/events',
    storeFunction: 'getStudentEvents',
    description: 'List student events.',
  },
  {
    key: 'studentEventRegister',
    method: 'POST',
    path: '/student/:studentId/events/:eventId/register',
    storeFunction: 'registerStudentEvent',
    description: 'Register student to event.',
  },
];