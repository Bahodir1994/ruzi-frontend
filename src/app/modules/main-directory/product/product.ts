import { Component } from '@angular/core';
import {Card} from 'primeng/card';
import {IftaLabel} from 'primeng/iftalabel';
import {InputText} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {Select} from 'primeng/select';
import {Textarea} from 'primeng/textarea';
import {ToggleButton} from 'primeng/togglebutton';
import {ButtonDirective} from 'primeng/button';

@Component({
  selector: 'app-product',
  imports: [
    Card,
    IftaLabel,
    InputText,
    FormsModule,
    ReactiveFormsModule,
    Select,
    Textarea,
    ToggleButton,
    ButtonDirective
  ],
  templateUrl: './product.html',
  standalone: true,
  styleUrl: './product.scss'
})
export class Product {
  productForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      itemType: ['physical', Validators.required],
      name: ['', Validators.required],
      description: [''],
      price: [null, Validators.required],
      unit: ['dona', Validators.required],
      active: [true]
    });
  }

  onSubmit() {
    if (this.productForm.valid) {
      console.log('Form Data:', this.productForm.value);
      // TODO: API chaqirish
    }
  }
}
