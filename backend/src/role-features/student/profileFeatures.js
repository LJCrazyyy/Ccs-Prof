export const profileFeatures = [
  {
    key: 'studentProfile',
    method: 'GET',
    path: '/student/:studentId/profile',
    storeFunction: 'getStudentProfile',
    description: 'Get student profile.',
  },
  {
    key: 'studentProfileUpdate',
    method: 'PUT',
    path: '/student/:studentId/profile',
    storeFunction: 'updateStudentProfile',
    description: 'Update student profile.',
  },
];