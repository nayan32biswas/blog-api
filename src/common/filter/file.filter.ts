import * as path from 'path';

export const imgFileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (!['.png', '.jpeg', '.jpg'].includes(ext.toLocaleLowerCase())) {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};
