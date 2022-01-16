import { Module } from '@nestjs/common';

import { CommonController } from './controller/common.controller';
import { CommonService } from './common.service';
import { CommonMediaController } from './controller/common-media.controller';

@Module({
  controllers: [CommonController, CommonMediaController],
  providers: [CommonService],
})
export class CommonModule {}
