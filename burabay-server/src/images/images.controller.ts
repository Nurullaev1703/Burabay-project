import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ImagesService } from './images.service';
import { Public } from 'src/constants';
import { DeleteImageDto } from './dto/delete-image.dto';
import { ApiTags } from '@nestjs/swagger';

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

  @Public()
  @Delete('image')
  async deleteImage(@Body() deleteImageDto: DeleteImageDto) {
    return await this.imageService.deleteImage(deleteImageDto);
  }
}
