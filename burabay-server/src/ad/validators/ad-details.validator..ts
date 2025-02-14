// /* eslint-disable @typescript-eslint/no-unused-vars */
// import {
//   ValidationArguments,
//   ValidatorConstraint,
//   ValidatorConstraintInterface,
// } from 'class-validator';
// import {
//   AdDetailsType,
//   AttractionsDetails,
//   ChillDetails,
//   EntertainmentDetails,
//   ExtrimDetails,
//   FoodDetails,
//   HealthDetails,
//   LivingPlaceDetails,
//   RentDetails,
//   SecurityDetails,
// } from '../types/ad.details.type';

// @ValidatorConstraint({ async: false })
// export class IsAdDetailsType implements ValidatorConstraintInterface {
//   validate(value: AdDetailsType, args: ValidationArguments) {
//     if (!value || !value.type) return false;

//     // Check that the type is one of the valid options
//     const validTypes = [
//       'chillPlace',
//       'livingPlace',
//       'food',
//       'attractions',
//       'health',
//       'entertainment',
//       'extreme',
//       'security',
//       'rent',
//     ];

//     // Check if the value type matches one of the valid types
//     if (!validTypes.includes(value.type)) {
//       return false;
//     }

//     // If the type is valid, validate based on the specific details type
//     switch (value.type) {
//       case 'chillPlace':
//         return this.validateChillPlaceDetails(value);
//       case 'livingPlace':
//         return this.validateLivingPlaceDetails(value);
//       case 'food':
//         return this.validateFoodDetails(value);
//       case 'attractions':
//         return this.validateAttractionsDetails(value);
//       case 'health':
//         return this.validateHealthDetails(value);
//       case 'entertainment':
//         return this.validateEntertainmentDetails(value);
//       case 'extreme':
//         return this.validateExtremeDetails(value);
//       case 'security':
//         return this.validateSecurityDetails(value);
//       case 'rent':
//         return this.validateRentDetails(value);
//       default:
//         return false;
//     }
//   }

//   // Example validation method for 'chillPlace' details
//   private validateChillPlaceDetails(details: ChillDetails): boolean {
//     // Validate that all properties are either `true`, `false`, or `null`
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   // You can repeat this pattern for each type (livingPlace, food, etc.)
//   private validateLivingPlaceDetails(details: LivingPlaceDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   private validateFoodDetails(details: FoodDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   private validateAttractionsDetails(details: AttractionsDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   private validateHealthDetails(details: HealthDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   private validateEntertainmentDetails(details: EntertainmentDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   private validateExtremeDetails(details: ExtrimDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   private validateSecurityDetails(details: SecurityDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   private validateRentDetails(details: RentDetails): boolean {
//     return Object.values(details).every((value) => value === null || typeof value === 'boolean');
//   }

//   defaultMessage(args: ValidationArguments): string {
//     return 'Invalid ad details type or value!';
//   }
// }
