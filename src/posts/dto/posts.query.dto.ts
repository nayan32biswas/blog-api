import { IsOptional, IsString } from 'class-validator';

import { PaginationQuery } from '../../common/dto/common.query.dto';

export class PostListQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  q: string;
  @IsOptional()
  @IsString()
  tag: string;
  @IsOptional()
  @IsString()
  username: string;
}
