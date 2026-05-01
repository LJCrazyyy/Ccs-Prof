export const facultyAssignmentFeatures = [
  {
    key: 'assignFacultySubject',
    method: 'PUT',
    path: '/admin/faculty/:facultyId/assign-subject',
    storeFunction: 'assignFacultySubject',
    description: 'Assign a subject to a faculty member.',
  },
  {
    key: 'assignFacultyEvent',
    method: 'PUT',
    path: '/admin/faculty/:facultyId/assign-event',
    storeFunction: 'assignFacultyEvent',
    description: 'Assign an event to a faculty member.',
  },
];
