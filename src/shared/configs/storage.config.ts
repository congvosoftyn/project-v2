import { BadRequestException } from '@nestjs/common';
import { ALLOW_AVATAR_FILE, AWS_STORAGE, FTP_STORAGE, PUBLIC_DIR, VALIDATE_FILE_VIDEO } from 'src/config';
import { diskStorage } from "multer";
import { extname } from "path";
import * as multerS3 from 'multer-s3';
import { S3 } from 'aws-sdk';
import * as FTPStorage from 'multer-ftp'

export const validateFile = (req, file, cb) => {
    if (ALLOW_AVATAR_FILE.includes(file.mimetype)) {
        cb(null, true);
    } else if (VALIDATE_FILE_VIDEO.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new BadRequestException('Only image(.png, .jpg and .jpeg) or video(webm or mp4) format allowed!'))
    }
};

export const dynamicStorage = (destination: string) => {
    return diskStorage({
        destination: `./${PUBLIC_DIR}/${destination}`,
        filename: (req, file, cb) => {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            return cb(null, `${randomName}${extname(file.originalname)}`);
        },
    })
}

const s3 = new S3({
    secretAccessKey: AWS_STORAGE.AWS_SECRET_ACCESS_KEY,
    accessKeyId: AWS_STORAGE.AWS_ACCESS_KEY_ID,
});

export const dynamicS3 = () => {
    return multerS3({
        s3: s3,
        bucket: AWS_STORAGE.AWS_BUCKET,
        metadata: function (req, file, cb) {
            cb(null, { fileName: file.fieldname });
        },
        key: function (req, file, cb) {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            cb(null, `${randomName}${extname(file.originalname)}`);
        }
    })
}

export const dynamicFTP = () => {
    return new FTPStorage({
        basepath: FTP_STORAGE.basepath,
        ftp: {
            host: FTP_STORAGE.ftp.host,
            secure: false, // enables FTPS/FTP with TLS
            user: FTP_STORAGE.ftp.user,
            password: FTP_STORAGE.ftp.password,
        },
        destination: function (req, file, options, callback) {
            const randomName = Array(32)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');
            return callback(null, `${randomName}${extname(file.originalname)}`);
        },
    })
}