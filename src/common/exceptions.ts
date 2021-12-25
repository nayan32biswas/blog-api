import { HttpException, HttpStatus } from '@nestjs/common';

export const HTTP404 = () => {
  throw new HttpException('Not Found', HttpStatus.NOT_FOUND);
};

export const HTTPForbidden = () => {
  throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
};
