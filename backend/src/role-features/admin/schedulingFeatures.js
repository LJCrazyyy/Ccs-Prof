export const schedulingFeatures = [
  {
    key: 'reassignScheduleFaculty',
    method: 'PUT',
    path: '/admin/schedules/:scheduleId/reassign',
    storeFunction: 'reassignScheduleFaculty',
    description: 'Reassign schedule ownership to another faculty member.',
  },
];
