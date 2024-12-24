import { ETypeDiscount } from "@/constants";
import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
} from "class-validator";

export function ValidateDiscountFields(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: "ValidateDiscountFields",
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    const dto = args.object as any;
                    switch (dto.type) {
                        case ETypeDiscount.PERCENTAGE:
                            return (
                                dto.value !== null &&
                                dto.maxDiscountAmount !== null &&
                                dto.value > 0 &&
                                dto.maxDiscountAmount > 0
                            );
                        case ETypeDiscount.FIXED_AMOUNT:
                            return (
                                dto.maxDiscountAmount !== null &&
                                dto.maxDiscountAmount > 0
                            );
                        case ETypeDiscount.ORDER_TOTAL:
                            return (
                                dto.value !== null &&
                                dto.minOrderValue !== null &&
                                dto.value > 0 &&
                                dto.minOrderValue > 0
                            );
                        default:
                            return false;
                    }
                },
                defaultMessage(args: ValidationArguments) {
                    const dto = args.object as any;
                    switch (dto.type) {
                        case ETypeDiscount.PERCENTAGE:
                            return 'Type 1 requires "value" and "maxDiscountAmount".';
                        case ETypeDiscount.FIXED_AMOUNT:
                            return 'Type 2 requires "maxDiscountAmount". ';
                        case ETypeDiscount.ORDER_TOTAL:
                            return 'Type 3 requires "value" and "minOrderValue".';
                        default:
                            return "Invalid discount type.";
                    }
                },
            },
        });
    };
}
