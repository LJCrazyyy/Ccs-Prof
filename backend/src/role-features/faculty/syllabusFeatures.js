export const syllabusFeatures = [
  {
    key: 'facultySyllabiList',
    method: 'GET',
    path: '/faculty/:facultyId/syllabi',
    storeFunction: 'getFacultySyllabi',
    description: 'List syllabi assigned to faculty.',
  },
  {
    key: 'facultySyllabusUpload',
    method: 'POST',
    path: '/faculty/:facultyId/syllabi',
    storeFunction: 'uploadSyllabus',
    description: 'Upload syllabus.',
  },
  {
    key: 'facultySyllabusDelete',
    method: 'DELETE',
    path: '/faculty/:facultyId/syllabi/:syllabusId',
    storeFunction: 'deleteSyllabus',
    description: 'Delete syllabus.',
  },
];
