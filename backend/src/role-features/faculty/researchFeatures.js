export const researchFeatures = [
  {
    key: 'facultyResearchList',
    method: 'GET',
    path: '/faculty/:facultyId/research',
    storeFunction: 'getFacultyResearch',
    description: 'List research handled by faculty.',
  },
  {
    key: 'facultyResearchDetails',
    method: 'GET',
    path: '/faculty/:facultyId/research/:researchId',
    storeFunction: 'getResearchDetails',
    description: 'Get one research detail for faculty.',
  },
];
