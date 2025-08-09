import { 
  registerDecorator, 
  ValidationOptions, 
  ValidationArguments 
} from "class-validator";

/**
 * Name Validator
 * - Only letters and spaces
 * - Not only spaces
 * - Max length handled separately
 */
export function IsValidName(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsValidName",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === "string" &&
            /^(?!\s*$)[A-Za-z\s]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must contain only letters and spaces, and not be only spaces`;
        }
      }
    });
  };
}

/**
 * Address Validator
 * - Allows letters, numbers, spaces, commas, periods, hyphens, slashes, #
 * - Not only spaces
 */
export function IsValidAddress(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsValidAddress",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === "string" &&
            /^(?!\s*$)[A-Za-z0-9\s,.\-\/#]+$/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} contains invalid characters`;
        }
      }
    });
  };
}

/**
 * Indian Mobile Validator
 * - Starts with 6–9
 * - Exactly 10 digits
 * - No more than 4 identical digits in a row
 */
export function IsValidIndianMobile(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "IsValidIndianMobile",
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          return typeof value === "string" &&
            /^[6-9]\d{9}$/.test(value) &&
            !/(.)\1{4,}/.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be a valid 10-digit Indian mobile number`;
        }
      }
    });
  };
}


export function Match(property: string, validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: "Match",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          return `${propertyName} must match ${relatedPropertyName}`;
        }
      }
    });
  };
}

// src/common/decorators/pagination.decorator.ts
import { applyDecorators } from '@nestjs/common';
import { Type, Transform } from 'class-transformer';
import { IsInt, Min, IsOptional, IsString, IsNotEmpty } from 'class-validator';
import { Types } from "mongoose";

/**
 * Mandatory page field: must be an integer >= 1
 */
export function PageField() {
  return applyDecorators(
    Type(() => Number),
    IsInt({ message: 'page must be an integer' }),
    Min(1, { message: 'page must be at least 1' }),
  );
}

/**
 * Mandatory limit field: must be an integer >= 1
 */
export function LimitField() {
  return applyDecorators(
    Type(() => Number),
    IsInt({ message: 'limit must be an integer' }),
    Min(1, { message: 'limit must be at least 1' }),
  );
}

/**
 * Optional search field: empty string will be converted to undefined
 */
export function SearchField() {
  return applyDecorators(
    IsOptional(),
    IsString({ message: 'search must be a string' }),
    Transform(({ value }) => value?.trim() === '' ? undefined : value),
  );
}

export function ToObjectId() {
  return Transform(({ value }) => {
    if (!value) return value;
    try {
      return new Types.ObjectId(value);
    } catch {
      throw new Error(`Invalid ObjectId: ${value}`);
    }
  });
}