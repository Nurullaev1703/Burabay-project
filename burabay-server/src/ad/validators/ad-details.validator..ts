/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import {
  AdDetailsType,
  IAttractionsDetails,
  IChillDetails,
  IEntertainmentDetails,
  IExtrimDetails,
  IFoodDetails,
  IHealthDetails,
  ILivingPlaceDetails,
  IRentDetails,
  ISecurityDetails,
} from '../types/ad.details.type';

@ValidatorConstraint({ async: false })
export class IsAdDetailsType implements ValidatorConstraintInterface {
  validate(value: AdDetailsType, args: ValidationArguments) {
    if (!value || !value.type) return false;

    // Check that the type is one of the valid options
    const validTypes = [
      'chillPlace',
      'livingPlace',
      'food',
      'attractions',
      'health',
      'entertainment',
      'extreme',
      'security',
      'rent',
    ];

    // Check if the value type matches one of the valid types
    if (!validTypes.includes(value.type)) {
      return false;
    }

    // If the type is valid, validate based on the specific details type
    switch (value.type) {
      case 'chillPlace':
        return this.validateChillPlaceDetails(value);
      case 'livingPlace':
        return this.validateLivingPlaceDetails(value);
      case 'food':
        return this.validateFoodDetails(value);
      case 'attractions':
        return this.validateAttractionsDetails(value);
      case 'health':
        return this.validateHealthDetails(value);
      case 'entertainment':
        return this.validateEntertainmentDetails(value);
      case 'extreme':
        return this.validateExtremeDetails(value);
      case 'security':
        return this.validateSecurityDetails(value);
      case 'rent':
        return this.validateRentDetails(value);
      default:
        return false;
    }
  }

  // Example validation method for 'chillPlace' details
  private validateChillPlaceDetails(details: IChillDetails): boolean {
    // Validate that all properties are either `true`, `false`, or `null`
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  // You can repeat this pattern for each type (livingPlace, food, etc.)
  private validateLivingPlaceDetails(details: ILivingPlaceDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  private validateFoodDetails(details: IFoodDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  private validateAttractionsDetails(details: IAttractionsDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  private validateHealthDetails(details: IHealthDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  private validateEntertainmentDetails(details: IEntertainmentDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  private validateExtremeDetails(details: IExtrimDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  private validateSecurityDetails(details: ISecurityDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  private validateRentDetails(details: IRentDetails): boolean {
    return Object.values(details).every((value) => value === null || typeof value === 'boolean');
  }

  defaultMessage(args: ValidationArguments): string {
    return 'Invalid ad details type or value!';
  }
}
