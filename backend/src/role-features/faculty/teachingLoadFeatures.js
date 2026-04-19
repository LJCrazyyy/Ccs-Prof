export const teachingLoadFeatures = [
  {
    key: 'facultyTeachingLoad',
    method: 'GET',
    path: '/faculty/:facultyId/teaching-load',
    storeFunction: 'getTeachingLoad',
    description: 'Get faculty teaching load summary.',
  },
];
