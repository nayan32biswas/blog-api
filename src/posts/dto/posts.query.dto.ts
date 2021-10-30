import { IsOptional, IsString } from 'class-validator';

import { PaginationQuery } from '../../common/dto/common.query.dto';

export class PostDetailsQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  q: string;
}
