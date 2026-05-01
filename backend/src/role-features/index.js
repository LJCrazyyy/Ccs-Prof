import { adminFeatures } from './admin/index.js';
import { facultyFeatures } from './faculty/index.js';
import { studentFeatures } from './student/index.js';

export const roleFeatures = {
  admin: adminFeatures,
  faculty: facultyFeatures,
  student: studentFeatures,
};

export { adminFeatures, facultyFeatures, studentFeatures };
