import { Component } from '@angular/core';
import {PrimeNG} from 'primeng/config';
import {MessageService} from 'primeng/api';
import {FileSelectEvent, FileUpload, FileUploadHandlerEvent} from 'primeng/fileupload';
import {Toast} from 'primeng/toast';
import {Button} from 'primeng/button';
import {NgForOf, NgIf} from '@angular/common';
import {Badge} from 'primeng/badge';
import {Card} from 'primeng/card';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-image',
  imports: [
    FileUpload,
    Toast,
    Button,
    NgIf,
    Badge,
    NgForOf,
    Card
  ],
  templateUrl: './image.html',
  standalone: true,
  styleUrl: './image.scss'
})
export class Image {
  images: { src: string, file: File }[] = [];
  isDraggingOver = false;

  constructor(private http: HttpClient) {}

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDraggingOver = false;
    const files = event.dataTransfer?.files;
    if (files) this.handleFiles(files);
  }

  onFilesAdded(event: any) {
    const files = event.target.files as FileList;
    this.handleFiles(files);
  }

  handleFiles(files: FileList) {
    Array.from(files).forEach(file => {
      // local preview
      const reader = new FileReader();
      reader.onload = e => this.images.push({ src: e!.target!.result as string, file });
      reader.readAsDataURL(file);

      // Backendga yuboriladigan FormData
      const formData = new FormData();
      formData.append('multipartFile', file);        // 🔥 backenddagi nom bilan bir xil
      formData.append('parentId', '123');    // masalan tovar id yoki boshqa
      formData.append('type', 'ITEM_IMAGE');         // ixtiyoriy maydon

      this.http.post('http://localhost:9050/route-file/crud', formData).subscribe({
        next: res => console.log('Fayl yuborildi:', res),
        error: err => console.error('Xatolik:', err)
      });
    });
  }


  removeImage(img: any) {
    this.images = this.images.filter(i => i !== img);
  }
}
