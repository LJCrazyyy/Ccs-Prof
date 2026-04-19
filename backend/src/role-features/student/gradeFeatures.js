export const gradeFeatures = [
  {
    key: 'studentGrades',
    method: 'GET',
    path: '/student/:studentId/grades',
    storeFunction: 'getStudentGrades',
    description: 'Get student grades and gwa.',
  },
];