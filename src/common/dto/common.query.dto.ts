import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

// import { DEFAULT_LIMIT } from '../../config/config.service';

export class PaginationQuery {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  offset: number;

  //   constructor(limit: number = null, offset: number = null) {
  //     // this.limit = (limit !== null && parseInt(limit)) || DEFAULT_LIMIT;
  //     this.limit = limit || DEFAULT_LIMIT;
  //     this.offset = offset;
  //   }
}
