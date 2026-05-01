export const dashboardFeatures = [
  {
    key: 'facultyDashboard',
    method: 'GET',
    path: '/faculty/:facultyId/dashboard',
    storeFunction: 'getFacultyDashboard',
    description: 'Get faculty dashboard overview.',
  },
];
