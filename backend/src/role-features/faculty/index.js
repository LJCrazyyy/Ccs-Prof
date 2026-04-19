import { classManagementFeatures } from './classManagementFeatures.js';
import { dashboardFeatures } from './dashboardFeatures.js';
import { eventFeatures } from './eventFeatures.js';
import { gradeEntryFeatures } from './gradeEntryFeatures.js';
import { researchFeatures } from './researchFeatures.js';
import { syllabusFeatures } from './syllabusFeatures.js';
import { teachingLoadFeatures } from './teachingLoadFeatures.js';

export const facultyFeatures = [
  ...dashboardFeatures,
  ...classManagementFeatures,
  ...gradeEntryFeatures,
  ...teachingLoadFeatures,
  ...syllabusFeatures,
  ...eventFeatures,
  ...researchFeatures,
];

export {
  classManagementFeatures,
  dashboardFeatures,
  eventFeatures,
  gradeEntryFeatures,
  researchFeatures,
  syllabusFeatures,
  teachingLoadFeatures,
};