import { HttpException, HttpStatus } from '@nestjs/common';

export const HTTP404 = (message = 'Not Found') => {
  throw new HttpException(message, HttpStatus.NOT_FOUND);
};

export const HTTPForbidden = (message = 'Forbidden') => {
  throw new HttpException(message, HttpStatus.FORBIDDEN);
};
