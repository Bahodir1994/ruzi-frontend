import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FormStateService {
  private forms: FormGroup[] = [];

  setForm(form: FormGroup) {
    if (!this.forms.includes(form)) {
      this.forms.push(form);
    }
  }

  getForms(): FormGroup[] {
    return this.forms;
  }

  clearForms() {
    this.forms = [];
  }
}
