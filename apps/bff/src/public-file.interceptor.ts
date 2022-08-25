import { FileInterceptor } from '@nestjs/platform-express';
import { randomUUID } from 'crypto';
import { diskStorage } from 'multer';
import { extname } from 'path';

export const PublicFileInterceptor = FileInterceptor('file', {
  storage: diskStorage({
    destination: './public',
    filename: (req, file, callback) => {
      const fileExtName = extname(file.originalname);
      callback(null, `${randomUUID()}${fileExtName}`);
    },
  }),
});
