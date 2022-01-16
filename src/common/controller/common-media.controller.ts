import { Controller, Get, Param, Res, StreamableFile } from '@nestjs/common';
import { join } from 'path';
import { createReadStream } from 'fs';

@Controller('media')
export class CommonMediaController {
  @Get(':fileName')
  getMedia(@Param('fileName') filename, @Res() res) {
    return res.sendFile(join(process.cwd(), 'media', filename));
  }

  @Get('download:fileName')
  downloadMedia(@Param('fileName') filename) {
    return new StreamableFile(
      createReadStream(join(process.cwd(), 'media', filename)),
    );
  }
}
