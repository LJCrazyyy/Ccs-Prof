import { collectionCrudFeatures } from './collectionCrudFeatures.js';
import { facultyAssignmentFeatures } from './facultyAssignmentFeatures.js';
import { schedulingFeatures } from './schedulingFeatures.js';
import { userAndMessagingFeatures } from './userAndMessagingFeatures.js';

export const adminFeatures = [
  ...userAndMessagingFeatures,
  ...facultyAssignmentFeatures,
  ...schedulingFeatures,
  ...collectionCrudFeatures,
];

export {
  collectionCrudFeatures,
  facultyAssignmentFeatures,
  schedulingFeatures,
  userAndMessagingFeatures,
};