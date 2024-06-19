import { diskStorage } from 'multer';

export const multerConfig = {
    // diskStorage was provided by Multer to configure disk storage
    storage: diskStorage({
        // destination -> to command where the file will be stored
        destination: './uploads',
        filename: (req, file, callback) => {
            // to generate unique name to prevent conflicts for each file
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            // to extract the extension of the uploaded file
            const extension = file.originalname.split('.').pop();
            callback(null, `${uniqueSuffix}.${extension}`)
        }
    }),
    limits: {
        fileSize: 1 * 1024 * 1024
    }
}

// Multer -> middleware method from nestjs for handling file uploads
// MulterModule.register({
// }),