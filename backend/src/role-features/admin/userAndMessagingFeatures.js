export const userAndMessagingFeatures = [
  {
    key: 'listAdmins',
    method: 'GET',
    path: '/admin/users/admins',
    storeFunction: 'listAdmins',
    description: 'List admin users.',
  },
  {
    key: 'messageStudent',
    method: 'POST',
    path: '/admin/faculty/message-student',
    storeFunction: 'messageStudent',
    description: 'Send a message to a student.',
  },
];
