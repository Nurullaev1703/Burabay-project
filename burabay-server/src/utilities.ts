import { HttpException, HttpStatus } from '@nestjs/common';

/* Класс с различными методами для уменьшения кода. */
export class Utils {
  /* Метод удаляет содержание пустых полей. */
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

  /* Метод для обработки HTTP ошибок. */
  static errorHandler(error) {
    console.error(error);
    throw new HttpException(
      error.message,
      error instanceof HttpException ? error.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }

  // /* Метод для проверки существования объекта и вызова исключения в случае отсутствия. */
  static check(obj: object, msg: string) {
    if (!obj) throw new HttpException(msg, HttpStatus.NOT_FOUND);
  }

  static dynamicImport = async (packageName: string) =>
    new Function(`return import('${packageName}')`)();

  static getClassKeys<T extends object>(classType: new () => T): (keyof T)[] {
    const instance = new classType();
    return Object.getOwnPropertyNames(instance) as (keyof T)[];
  }
}
