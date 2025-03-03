import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from 'src/users/entities/organization.entity';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { mkdir, writeFile } from 'fs/promises';
import { promises } from 'fs';
import { DeleteImageDto } from './dto/delete-image.dto';
import { CatchErrors, Utils } from 'src/utilities';
import * as sharp from 'sharp';
import { error } from 'console';
import { extname } from 'path';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ImagesService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async saveImage(file: Express.Multer.File, directory: string): Promise<string> {
    try {
      const filename = `${uuidv4()}${extname(file.originalname)}`;
      // const filename = `${uuidv4()}.webp`;
      const dirpath = `./public/images/${directory}`;
      const filepath = `${dirpath}/${filename}`;
      // Создает новую директорию, если ее не существовало
      await mkdir(dirpath, { recursive: true });
      let compressedBuffer;
      if (directory === 'profile') {
        // Сжатие для изображения профиля.
        compressedBuffer = await sharp(file.buffer).resize(512).toBuffer();
      } else {
        // Сжатие для изображения объявления.
        compressedBuffer = await sharp(file.buffer).resize(1280).toBuffer();
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

  @CatchErrors()
  async saveDocument(file: Express.Multer.File, filename: string, tokenData: TokenData) {
    const allowedMimes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    const fileExt = extname(file.originalname).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx'];

    // Проверяем MIME-типы и расширение файла
    if (!allowedMimes.includes(file.mimetype) || !allowedExts.includes(fileExt)) {
      throw new HttpException('Формат файла должен быть PDF, DOC или DOCX', HttpStatus.BAD_REQUEST);
    }

    // Получаем пользователя и его организацию
    const user = await this.userRepository.findOne({
      where: { id: tokenData.id },
      relations: { organization: true },
    });

    Utils.checkEntity(user?.organization, 'Организация не найдена');

    // Безопасное имя организации
    const safeOrgName = user.organization.name.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');

    const dirpath = `./public/docs/${safeOrgName}/`;
    const filepath = `${dirpath}/${filename}${fileExt}`;

    await mkdir(dirpath, { recursive: true });
    await writeFile(filepath, file.buffer);

    // Корректируем путь для фронтенда
    const filepathForFront = filepath.replace(/^\.\/public/, '');
    return JSON.stringify(filepathForFront);
  }

  /* Сохранить три документа для организации. */
  @CatchErrors()
  async saveOrgDocs(
    files: {
      registerFile?: Express.Multer.File[];
      IBANFile?: Express.Multer.File[];
      charterFile?: Express.Multer.File[];
    },
    tokenData: TokenData,
  ) {
    const organization = await this.organizationRepository.findOneBy({
      user: { id: tokenData.id },
    });

    Utils.checkEntity(organization, 'Организация не найдена');
    console.log('Полученные файлы:', files); // Лог для отладки

    const orgName = organization.name;
    const safeOrgName = orgName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
    const dirpath = `./public/docs/${safeOrgName}/`;
    await mkdir(dirpath, { recursive: true });

    // Берём файлы из массива
    const registerFile = files.registerFile?.[0];
    const IBANFile = files.IBANFile?.[0];
    const charterFile = files.charterFile?.[0];

    if (registerFile) this.checkDocsExt(registerFile);
    if (IBANFile) this.checkDocsExt(IBANFile);
    if (charterFile) this.checkDocsExt(charterFile);

    const registerFilePath = registerFile
      ? `${dirpath}/registerFile${this.getExt(registerFile)}`
      : null;

    const IBANFilePath = IBANFile ? `${dirpath}/IBANFile${this.getExt(IBANFile)}` : null;

    const charterFilePath = charterFile
      ? `${dirpath}/charterFile${this.getExt(charterFile)}`
      : null;

    await Promise.all([
      registerFile && writeFile(registerFilePath, registerFile.buffer),
      IBANFile && writeFile(IBANFilePath, IBANFile.buffer),
      charterFile && writeFile(charterFilePath, charterFile.buffer),
    ]);

    return {
      registerFile: registerFilePath ? registerFilePath.replace('.', '') : null,
      IBANFile: IBANFilePath ? IBANFilePath.replace('.', '') : null,
      charterFile: charterFilePath ? charterFilePath.replace('.', '') : null,
    };
  }

  async saveManyImages(files: Array<Express.Multer.File>, directory: string) {
    try {
      const results = await Promise.all(
        files.map(async (item) => {
          const filename = `${uuidv4()}${extname(item.originalname)}`;
          // const filename = `${uuidv4()}.webp`;
          const dirpath = `./public/images/${directory}`;
          const filepath = `${dirpath}/${filename}`;
          // Создает новую директорию, если её не существовало
          await mkdir(dirpath, { recursive: true });

          let compressedBuffer;
          if (directory === 'profile') {
            // Сжатие для изображения профиля.
            compressedBuffer = await sharp(item.buffer).resize(512).toBuffer();
          } else {
            // Сжатие для изображения объявления.
            compressedBuffer = await sharp(item.buffer).resize(1280).toBuffer();
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
      await promises.unlink('public/' + deleteImageDto.filepath); // Удаляем файл
      return JSON.stringify(`Файл ${deleteImageDto.filepath} успешно удален`);
    } catch (error) {
      throw new HttpException(
        `Не удалось удалить файл ${deleteImageDto.filepath}`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  /* Проверка документа на формат PDF, DOC, DOCX. */
  private checkDocsExt(file: Express.Multer.File) {
    if (!file || !file.originalname) {
      throw new HttpException('Файл не найден или повреждён', HttpStatus.BAD_REQUEST);
    }

    const allowedMimes = [
      'application/pdf',
      'application/msword', // .doc
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
    ];

    const allowedExtensions = ['.pdf', '.doc', '.docx'];
    const fileExt = extname(file.originalname).toLowerCase();

    if (!allowedMimes.includes(file.mimetype) || !allowedExtensions.includes(fileExt)) {
      throw new HttpException(
        `Проблема с ${file.originalname}. Формат должен быть PDF, DOC или DOCX`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  private getExt(file: Express.Multer.File): string {
    if (!file || !file.originalname) {
      throw new Error('Файл не найден или повреждён');
    }
    return extname(file.originalname).toLowerCase();
  }
}
