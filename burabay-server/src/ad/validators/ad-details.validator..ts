/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class IsAdDetailsType implements ValidatorConstraintInterface {
  validate(details: any, args: ValidationArguments) {
    if (!details || typeof details !== 'object') {
      return false;
    }

    // Проверяем тип, соответствующий IChillPlaceDetails
    if (details.type === 'chillPlace') {
      if (Object.keys(details).length > 1) {
        // Ожидается только поле 'type'
        return false;
      }
      return details.type === 'chillPlace'; // Проверка поля type
    }

    // Проверяем тип, соответствующий ILivingPlaceDetails
    if (details.type === 'livingPlace') {
      const allowedKeys = ['type', 'rooms', 'bathrooms', 'wifi'];
      const extraKeys = Object.keys(details).filter((key) => !allowedKeys.includes(key));

      if (extraKeys.length > 0) {
        // Проверяем наличие лишних полей
        return false;
      }

      return (
        typeof details.rooms === 'number' &&
        typeof details.bathrooms === 'number' &&
        typeof details.wifi === 'boolean'
      );
    }

    // Проверяем тип, соответствующий ISupplyDetails
    if (details.type === 'supply') {
      if (Object.keys(details).length > 1) {
        // Ожидается только поле 'type'
        return false;
      }
      return details.type === 'supply';
    }

    return false;
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Details must be a valid AdDetailsType with no extra fields.';
  }
}
