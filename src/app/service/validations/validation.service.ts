import {Injectable} from '@angular/core';
import {AbstractControl, FormGroup, ValidatorFn} from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor() {
  }

  /**
   * validate if error code 400 and send to form*/
  handleApiErrors(errors: { field: string; message: string }[], form: FormGroup) {
    errors.forEach((error) => {
      const control = form.get(error.field);
      if (control) {
        control.setErrors({apiError: error.message});
      }
    });
  }

  /**
   *  for check date
   *  */
  dateValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const isValidDate = !isNaN(Date.parse(value));
      return isValidDate ? null : {invalidDate: {value}};
    };
  }

  /**
   *  for check sql-injections
   *  */
  sqlInjectionValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      const sqlInjectionPattern = /[<>]/;  // Проверка на опасные символы
      return sqlInjectionPattern.test(value) ? {sqlInjection: true} : null;
    };
  }

  /**
   * at least one of the fields has a value of 1
   */
  atLeastOneFieldValidator(...fields: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const hasAtLeastOne = fields.some(field => control.get(field)?.value);
      return hasAtLeastOne ? null : {atLeastOneFieldRequired: true};
    };
  }

  checkRadioButtonSelectAll(...fields: string[]): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const allFieldsFilled = fields.every(field => control.get(field)?.value);
      return allFieldsFilled ? null : {allFieldsRequired: true};
    };
  }
}
