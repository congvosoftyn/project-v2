import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { MAIN_URL, PUBLIC_DIR } from 'src/config';
import JwtAuthenticationGuard from 'src/shared/guards/jwtAuthenticationGuard';
import { FileInterceptor } from '@nestjs/platform-express';
import { dynamicStorage, validateFile } from 'src/shared/configs/storage.config';
import { UploadPhotoDTO } from './upload-photo.dto';
import * as sharp from 'sharp';


@ApiTags('upload')
@Controller('upload')
export class UploadController {

    @Post()
    @ApiBearerAuth('access-token')
    @UseGuards(JwtAuthenticationGuard)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(
        FileInterceptor('file', {
            storage: dynamicStorage('upload'),
            fileFilter: validateFile
        }),
    )
    uploadPhoto(@UploadedFile() file: Express.Multer.File): UploadPhotoDTO {
        const thumbName = file.filename.replace('.', '_thumb.');
        const thumbPath = file.path.replace(file.filename, thumbName);
        sharp(file.path).resize(200, 200).toFile(thumbPath).catch(err => console.log(err));
        return {
            filename: file.filename,
            thumb: `${MAIN_URL}/upload/${thumbName}`,
            size: file.size,
            mimetype: file.mimetype,
            originalname: file.originalname,
            url: `${MAIN_URL}/upload/${file.filename}`,
        };
    }

    @Get(':id')
    viewImage(@Param('id') image: string, @Res() res) {
        return res.sendFile(image, { root: `${PUBLIC_DIR}/upload` });
    }
}
