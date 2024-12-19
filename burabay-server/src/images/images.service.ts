import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs/promises';
import { promises } from 'fs';
import { DeleteImageDto } from './dto/delete-image.dto';
import { Utils } from 'src/utilities';
import * as sharp from 'sharp';
import { error } from 'console';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async saveImage(file: Express.Multer.File, directory: string): Promise<string> {
    try {
      // const filename = `${uuidv4()}${extname(file.originalname)}`;
      const filename = `${uuidv4()}.webp`;
      const dirpath = `./public/images/${directory}`;
      const filepath = `${dirpath}/${filename}`;
      // Создает новую директорию, если ее не существовало
      await mkdir(dirpath, { recursive: true });
      let compressedBuffer;
      if (directory === 'profile') {
        // Сжатие для изображения профиля.
        compressedBuffer = await sharp(file.buffer)
          .resize(512)
          .toFormat('webp', { quality: 80 })
          .toBuffer();
      } else {
        // Сжатие для изображения объявления.
        compressedBuffer = await sharp(file.buffer)
          .resize(1280)
          .toFormat('webp', { quality: 80 })
          .toBuffer();
      }

      // Сохранение файла в полученную директорию
      await writeFile(filepath, compressedBuffer);
      const filepathForFront = filepath.replace('/public', '');
      return JSON.stringify(filepathForFront.replace('.', ''));
    } catch (error) {
      // throw new HttpException('Произошла ошибка', HttpStatus.CONFLICT);
      Utils.errorHandler(error);
    }
  }

  async saveManyImages(files: Array<Express.Multer.File>, directory: string) {
    try {
      const results = await Promise.all(
        files.map(async (item) => {
          // const filename = `${uuidv4()}${extname(item.originalname)}`;
          const filename = `${uuidv4()}.webp`;
          const dirpath = `./public/images/${directory}`;
          const filepath = `${dirpath}/${filename}`;
          // Создает новую директорию, если её не существовало
          await mkdir(dirpath, { recursive: true });

          let compressedBuffer;
          if (directory === 'profile') {
            // Сжатие для изображения профиля.
            compressedBuffer = await sharp(item.buffer)
              .resize(512)
              .toFormat('webp', { quality: 80 })
              .toBuffer();
          } else {
            // Сжатие для изображения объявления.
            compressedBuffer = await sharp(item.buffer)
              .resize(1280)
              .toFormat('webp', { quality: 80 })
              .toBuffer();
          }

          // Сохранение файла в полученную директорию
          await writeFile(filepath, compressedBuffer);
          let filepathForFront = filepath.replace('/public', '');
          filepathForFront = filepathForFront.replace('.', '');
          return filepathForFront;
        }),
      );

      return JSON.stringify(results);
    } catch {
      Utils.errorHandler(error);
    }
  }

  async deleteImage(deleteImageDto: DeleteImageDto) {
    try {
      await promises.unlink(deleteImageDto.filepath.replace('/', '')); // Удаляем файл
      return JSON.stringify(`Файл ${deleteImageDto.filepath} успешно удален`);
    } catch (error) {
      throw new HttpException(
        `Не удалось удалить файл ${deleteImageDto.filepath}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
