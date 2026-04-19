export const gradeEntryFeatures = [
  {
    key: 'facultyGradeEntry',
    method: 'GET',
    path: '/faculty/:facultyId/grades/:classId',
    storeFunction: 'getGradeEntry',
    description: 'Load grade entry data for class.',
  },
  {
    key: 'facultySaveGrades',
    method: 'POST',
    path: '/faculty/:facultyId/grades/:classId',
    storeFunction: 'saveClassGrades',
    description: 'Save class grades.',
  },
];
