import { Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { Card } from 'primeng/card';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { NgForOf } from '@angular/common';
import {Select} from 'primeng/select';
import {CategoryModel} from '../categories.model';

@Component({
  selector: 'app-category-create',
  standalone: true,
  imports: [Button, Card, FloatLabel, ReactiveFormsModule, InputText, Select],
  templateUrl: './category-create.html',
})
export class CategoryCreate implements OnInit {

  categoryForm!: FormGroup;
  parentCategories!: CategoryModel[] | [];

  @Output() headerReady = new EventEmitter<TemplateRef<any>>();
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<void>();
  @ViewChild('headerContent', { static: true }) headerContent!: TemplateRef<any>;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      code: ['', Validators.required],
      parentId: [null],
      translations: this.fb.array([]),
    });
    this.addTranslation();
    // Emit header template to parent
    this.headerReady.emit(this.headerContent);
  }

  get translations(): FormArray {
    return this.categoryForm.get('translations') as FormArray;
  }

  addTranslation() {
    const group = this.fb.group({
      languageCode: ['', [Validators.required, Validators.maxLength(3)]],
      name: ['', Validators.required],
      description: [''],
    });
    this.translations.push(group);
  }

  removeTranslation(index: number) {
    this.translations.removeAt(index);
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      console.log('Category payload:', this.categoryForm.value);
    } else {
      this.categoryForm.markAllAsTouched();
    }
  }
}
