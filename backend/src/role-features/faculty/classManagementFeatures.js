export const classManagementFeatures = [
  {
    key: 'facultyClasses',
    method: 'GET',
    path: '/faculty/:facultyId/classes',
    storeFunction: 'getFacultyClasses',
    description: 'List classes assigned to faculty.',
  },
  {
    key: 'facultyClassDetails',
    method: 'GET',
    path: '/faculty/:facultyId/classes/:classId',
    storeFunction: 'getClassDetails',
    description: 'Get one class detail record for faculty.',
  },
  {
    key: 'facultyClassStudents',
    method: 'GET',
    path: '/faculty/:facultyId/classes/:classId/students',
    storeFunction: 'getClassStudents',
    description: 'List students in a class.',
  },
  {
    key: 'facultyUploadClassMaterial',
    method: 'POST',
    path: '/faculty/:facultyId/classes/:classId/materials',
    storeFunction: 'uploadClassMaterial',
    description: 'Upload class material.',
  },
  {
    key: 'facultyAddClassAssessment',
    method: 'POST',
    path: '/faculty/:facultyId/classes/:classId/assessments',
    storeFunction: 'addClassAssessment',
    description: 'Add quiz, exam, or activity to class.',
  },
];
