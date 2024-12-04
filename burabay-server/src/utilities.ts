import { HttpException, HttpStatus } from '@nestjs/common';

// Класс с различными общими функциями
export class utilities {
  // Функция для удаления полей со значением null
  static removeNullFields(obj: any) {
    if (Array.isArray(obj)) {
      return obj.map((item) => this.removeNullFields(item));
    } else if (obj !== null && typeof obj === 'object') {
      // Добавляем проверку, является ли объект экземпляром Date
      if (obj instanceof Date) {
        return obj; // Возвращаем объект Date без изменений
      }

      return Object.fromEntries(
        Object.entries(obj)
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          .filter(([_, v]) => v != null)
          .map(([k, v]) => [k, this.removeNullFields(v)]),
      );
    } else {
      return obj;
    }
  }

  static errorHandler(error) {
    console.error(error);
    throw new HttpException(
      {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message,
      },
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
    // if (!(error instanceof HttpException)) {

    // }
    // throw error;
  }
}
