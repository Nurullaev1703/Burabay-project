import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import {
  AnyFilesInterceptor,
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { Public } from 'src/constants';
import { DeleteImageDto } from './dto/delete-image.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

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
  async deleteImage(@Body() deleteImageDto: DeleteImageDto) {
    return await this.imageService.deleteImage(deleteImageDto);
  }
}
