import fs = require('fs');

import { configService } from '../config/config.service';

fs.writeFileSync(
  'ormconfig.json',
  JSON.stringify(configService.getTypeOrmConfig(), null, 2),
);
