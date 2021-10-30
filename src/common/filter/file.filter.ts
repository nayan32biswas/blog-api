import * as path from 'path';
import * as multer from 'multer';
import * as fs from 'fs';

import { MEDIA_ROOT } from '../../config/config.service';

export const imgFileFilter = (req, file, callback) => {
  const ext = path.extname(file.originalname);
  if (!['.png', '.jpeg', '.jpg'].includes(ext.toLocaleLowerCase())) {
    req.fileValidationError = 'Invalid file type';
    return callback(new Error('Invalid file type'), false);
  }
  return callback(null, true);
};

export const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(MEDIA_ROOT)) {
      fs.mkdirSync(MEDIA_ROOT);
    }
    cb(null, MEDIA_ROOT);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});
