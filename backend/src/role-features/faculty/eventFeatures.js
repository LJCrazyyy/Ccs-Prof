export const eventFeatures = [
  {
    key: 'facultyEventsList',
    method: 'GET',
    path: '/faculty/:facultyId/events',
    storeFunction: 'getAllEvents',
    description: 'List school events for faculty.',
  },
  {
    key: 'facultyEventJoin',
    method: 'POST',
    path: '/faculty/:facultyId/events/:eventId/join',
    storeFunction: 'joinEvent',
    description: 'Join faculty to an event.',
  },
  {
    key: 'facultyInviteStudentsToEvent',
    method: 'POST',
    path: '/faculty/:facultyId/events/:eventId/invite-students',
    storeFunction: 'inviteStudentsToEvent',
    description: 'Invite students to a faculty event.',
  },
];
