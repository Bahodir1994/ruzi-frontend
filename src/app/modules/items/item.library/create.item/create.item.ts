import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {ButtonDirective} from 'primeng/button';
import {Card} from 'primeng/card';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea';
import {ToggleButton} from 'primeng/togglebutton';

@Component({
  selector: 'app-create-item',
  imports: [
    ButtonDirective,
    Card,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Select,
    Textarea,
    ToggleButton
  ],
  templateUrl: './create.item.html',
  standalone: true,
  styleUrl: './create.item.scss'
})
export class CreateItem implements OnInit {
  itemForm!: FormGroup;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    this.itemForm = this.fb.group({
      itemType: ['physical', Validators.required],
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
      unit: ['dona', Validators.required],
      active: [true]
    });
  }

  onSubmit() {
    if (this.itemForm.valid) {
      console.log('Form Data:', this.itemForm.value);
      // TODO: API chaqirish
    }
  }
}
