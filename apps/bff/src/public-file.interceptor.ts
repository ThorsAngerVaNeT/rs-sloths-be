import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const PublicFileInterceptor = (path = '') =>
  FileInterceptor('file', {
    storage: diskStorage({
      destination: join('./public', path),
      filename: (req, file, callback) => {
        const fileExtName = extname(file.originalname);
        callback(null, `${randomUUID()}${fileExtName}`);
      },
    }),
  });
