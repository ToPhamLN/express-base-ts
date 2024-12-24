import {
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
    registerDecorator,
    ValidationOptions,
} from "class-validator";
import { ObjectId, Schema, Types } from "mongoose";
@ValidatorConstraint({ name: "isAfterDate", async: false })
export class IsAfterDate implements ValidatorConstraintInterface {
    validate(endDate: number, args: ValidationArguments) {
        const object = args.object as any;
        const startDate = object.startDate;

        return (
            typeof startDate === "number" &&
            typeof endDate === "number" &&
            endDate > startDate
        );
    }

    defaultMessage(args: ValidationArguments) {
        return "End date must be after the start date";
    }
}

@ValidatorConstraint({ name: "isFutureDate", async: false })
export class IsFutureDate implements ValidatorConstraintInterface {
    validate(date: number) {
        return typeof date === "number" && date > Date.now();
    }

    defaultMessage(args: ValidationArguments) {
        return "Date must be in the future";
    }
}

@ValidatorConstraint({ name: "isValidObjectId", async: false })
export class IsValidObjectId implements ValidatorConstraintInterface {
    validate(value: string): Promise<boolean> | boolean {
        try {
            console.log("a: ", Types.ObjectId.isValid(value));
            return Types.ObjectId.isValid(value);
        } catch (error) {
            return false;
        }
    }
    defaultMessage(args?: ValidationArguments): string {
        return "Invalid objectId";
    }
}

@ValidatorConstraint({ async: false })
export class IsObjectIdConstraint implements ValidatorConstraintInterface {
    validate(value: any): boolean {
        return Types.ObjectId.isValid(value);
    }

    defaultMessage(): string {
        return "Invalid ObjectId format";
    }
}

export function IsObjectId(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsObjectIdConstraint,
        });
    };
}
