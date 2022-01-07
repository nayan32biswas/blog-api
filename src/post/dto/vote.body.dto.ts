import { IsEnum } from 'class-validator';
import { VoteType } from '../post.entity';

export class VoteCreateUpdateDto {
  @IsEnum(VoteType)
  type: VoteType;
}
