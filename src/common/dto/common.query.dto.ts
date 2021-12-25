import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

// import { DEFAULT_LIMIT } from '../../config/config.service';

export class PaginationQuery {
  @IsOptional()
  @IsInt()
  @Max(100)
  @Type(() => Number)
  limit = 20;

  @IsOptional()
  @Min(0)
  @IsInt()
  @Type(() => Number)
  offset = 0;

  //   constructor(limit: number = null, offset: number = null) {
  //     // this.limit = (limit !== null && parseInt(limit)) || DEFAULT_LIMIT;
  //     this.limit = limit || DEFAULT_LIMIT;
  //     this.offset = offset;
  //   }
}
