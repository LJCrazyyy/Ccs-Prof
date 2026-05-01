import { eventFeatures } from './eventFeatures.js';
import { gradeFeatures } from './gradeFeatures.js';
import { guidanceFeatures } from './guidanceFeatures.js';
import { profileFeatures } from './profileFeatures.js';
import { researchFeatures } from './researchFeatures.js';
import { scheduleFeatures } from './scheduleFeatures.js';

export const studentFeatures = [
  ...guidanceFeatures,
  ...profileFeatures,
  ...gradeFeatures,
  ...scheduleFeatures,
  ...eventFeatures,
  ...researchFeatures,
];

export {
  eventFeatures,
  gradeFeatures,
  guidanceFeatures,
  profileFeatures,
  researchFeatures,
  scheduleFeatures,
};