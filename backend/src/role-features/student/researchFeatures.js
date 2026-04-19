export const researchFeatures = [
  {
    key: 'studentResearch',
    method: 'GET',
    path: '/student/:studentId/research',
    storeFunction: 'getStudentResearch',
    description: 'List student research items.',
  },
  {
    key: 'studentResearchStatusUpdate',
    method: 'PUT',
    path: '/student/:studentId/research/:researchId/status',
    storeFunction: 'updateStudentResearchStatus',
    description: 'Update student research status.',
  },
];