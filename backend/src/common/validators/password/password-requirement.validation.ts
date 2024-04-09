import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

/**
 * Custom ValidatorClass for password requirement.
 */
@ValidatorConstraint({ name: 'passwordRequirementValidation', async: false })
export class PasswordRequirementValidation implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    const regEx = RegExp('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9])');
    return regEx.test(text);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Password should atleast contain one uppercase letter, one lowercase letter, one digit and a special character.';
  }
}
