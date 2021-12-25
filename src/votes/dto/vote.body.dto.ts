import { IsEnum } from 'class-validator';
import { VoteType } from '../votes.entity';

export class VoteCreateUpdateDto {
  @IsEnum(VoteType)
  content: VoteType;
}
