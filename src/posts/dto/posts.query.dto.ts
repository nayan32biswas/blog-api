import { PaginationQuery } from '../../common/dto/common.query.dto';
import { IsOptional, IsString } from 'class-validator';

export class PostDetailsQuery extends PaginationQuery {
  @IsOptional()
  @IsString()
  q: string;
}
