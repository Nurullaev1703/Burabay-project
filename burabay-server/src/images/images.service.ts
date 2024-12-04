import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { mkdir, writeFile } from 'fs/promises';
import { promises } from 'fs';
import { DeleteImageDto } from './dto/delete-image.dto';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
  ) {}

  async saveImage(file: Express.Multer.File, directory: string): Promise<string> {
    try {
      const filename = `${uuidv4()}${extname(file.originalname)}`;
      const dirpath = `./images/${directory}`;
      const filepath = `${dirpath}/${filename}`;
      // Создает новую директорию, если ее не существовало
      await mkdir(dirpath, { recursive: true });
      // Сохранение файла в полученную директорию
      await writeFile(filepath, file.buffer);

      return JSON.stringify(filepath.replace('.', ''));
    } catch {
      throw new HttpException('Произошла ошибка', HttpStatus.CONFLICT);
    }
  }

  async saveManyImages(files: Array<Express.Multer.File>, directory: string) {
    try {
      const results = await Promise.all(
        files.map(async (item) => {
          const filename = `${uuidv4()}${extname(item.originalname)}`;
          const dirpath = `./images/${directory}`;
          const filepath = `${dirpath}/${filename}`;
          // Создает новую директорию, если её не существовало
          await mkdir(dirpath, { recursive: true });
          // Сохранение файла в полученную директорию
          await writeFile(filepath, item.buffer);

          return filepath;
        }),
      );

      return JSON.stringify(results);
    } catch {
      throw new HttpException('Произошла ошибка', HttpStatus.CONFLICT);
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
