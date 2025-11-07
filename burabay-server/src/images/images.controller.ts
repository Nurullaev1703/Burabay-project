import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { Public } from 'src/constants';
import { DeleteFileDto as DeleteFileDto } from './dto/delete-image.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@ApiBearerAuth()
@ApiTags('Images')
@Controller()
export class ImagesController {
  constructor(private readonly imageService: ImagesService) {}

  @Public()
  @Post('image/:directory')
  @UseInterceptors(FileInterceptor('file'))
  async uploadImage(
    @UploadedFile() file: Express.Multer.File,
    @Param('directory') directory: string,
  ) {
    return await this.imageService.saveImage(file, directory);
  }

  @Public()
  @Post('images/:directory')
  @UseInterceptors(AnyFilesInterceptor())
  async uploadFile(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Param('directory') directory: string,
  ) {
    return await this.imageService.saveManyImages(files, directory);
  }

  @Post('docs/:filename')
  @UseInterceptors(FileInterceptor('file'))
  async uploadDocs(
    @UploadedFile() file: Express.Multer.File,
    @Param('filename') filename: string,
    @Request() req: AuthRequest,
  ) {
    return await this.imageService.saveDocument(file, filename, req.user);
  }

  @Public()
  @Post('video')
  @UseInterceptors(FileInterceptor('file'))
  async uploadVideo(@UploadedFile() file: Express.Multer.File) {
    return await this.imageService.saveVideo(file);
  }

  @Public()
  @Delete('video')
  async deleteVideo(@Body() dto: DeleteFileDto) {
    return await this.imageService.deleteVideo(dto);
  }

  @Post('full-docs')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        { name: 'registerFile', maxCount: 1 },
        { name: 'IBANFile', maxCount: 1 },
        { name: 'charterFile', maxCount: 1 },
      ],
      { limits: { fileSize: 50 * 1024 * 1024 } },
    ),
  )
  async uploadFullDocs(
    @UploadedFiles()
    files: {
      registerFile?: Express.Multer.File[];
      IBANFile?: Express.Multer.File[];
      charterFile?: Express.Multer.File[];
    },
    @Request() req: AuthRequest,
  ) {
    return this.imageService.saveOrgDocs(files, req.user);
  }

  @Public()
  @Delete('image')
  async deleteImage(@Body() deleteImageDto: DeleteFileDto) {
    return await this.imageService.deleteImage(deleteImageDto);
  }

  @Public()
  @Get('download/docs/:orgId/:filename')
  async downloadDocument(
    @Param('orgId') orgId: string,
    @Param('filename') filename: string,
    @Res() res: Response,
  ) {
    const filePath = join(__dirname, '..', '..', 'public', 'docs', orgId, filename);

    // Проверяем существование файла
    if (!existsSync(filePath)) {
      throw new NotFoundException(`Файл не найден: ${filename}`);
    }

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(filename)}"`);
    return res.sendFile(filePath);
  }
}
