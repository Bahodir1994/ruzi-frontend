import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MenuItem, MessageService} from 'primeng/api';
import {FileUpload, FileUploadHandlerEvent} from 'primeng/fileupload';
import {Button} from 'primeng/button';
import {NgOptimizedImage} from '@angular/common';
import {Card} from 'primeng/card';
import {ImageService} from './image.service';
import {finalize} from 'rxjs';
import {ResponseDto} from '../../../configuration/resursurls/responseDto';
import {DocumentDto} from './image.model';
import {Tooltip} from 'primeng/tooltip';
import {Dialog} from 'primeng/dialog';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {Select} from 'primeng/select';
import {Menu} from 'primeng/menu';
import {AutoFocus} from 'primeng/autofocus';
import {TreeTableModule} from 'primeng/treetable';
import {ScrollPanel} from 'primeng/scrollpanel';
import {Checkbox} from 'primeng/checkbox';
import {ProgressSpinner} from 'primeng/progressspinner';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-image',
  imports: [
    FileUpload,
    Button,
    Card,
    Tooltip,
    Dialog,
    FormsModule,
    InputText,
    ReactiveFormsModule,
    Select,
    Menu,
    AutoFocus,
    TreeTableModule,
    NgOptimizedImage,
    ScrollPanel,
    Checkbox,
    ProgressSpinner
  ],
  templateUrl: './image.html',
  standalone: true,
  styleUrl: './image.scss',
  providers: [MessageService]
})
export class Image implements OnInit {
  isLoading: boolean = true;

  menuVisible = false;
  actions: MenuItem[] = [];

  rowSize = 5;
  isDraggingOver = false;
  isUploading = false;
  formSaveEditedImage!: FormGroup;

  imagePathPrefix = environment.minioThumbUrl;

  imagesList: DocumentDto[] = [];
  selectedImages: any[] = [];

  editDialogVisible = false;
  editImageData: any = {};

  searchQuery = '';
  selectedSort: any;
  sortOptions = [
    {label: 'A–Z bo‘yicha', value: 'az'},
    {label: 'Z–A bo‘yicha', value: 'za'},
    {label: 'Sana bo‘yicha (oxirgisi birinchi)', value: 'date'}
  ];
  filteredImages: DocumentDto[] = [];

  constructor(
    private fb: FormBuilder,
    private imageService: ImageService,
    private cdr: ChangeDetectorRef,
  ) {
  }

  ngOnInit(): void {
    this.actions = [
      {
        label: 'Rasmni yuklab olish',
        icon: 'pi pi-download',
        command: () => this.downloadImage(this.editImageData.id)
      },
      {
        label: 'O‘chirish',
        icon: 'pi pi-trash',
        command: () => this.removeImage(this.editImageData.id)
      }
    ];

    this.formSaveEditedImage = this.fb.group({
      name: [
        '',
        [
          Validators.required,
          Validators.maxLength(200),
          Validators.pattern(/^[a-zA-Z0-9_\-\s]+$/) // faqat harf, raqam, _, -, va bo‘sh joy
        ]
      ]
    });

    this.read();
  }

  onFolderSelect(event: any) {
    const files: FileList = event.target.files;
    if (files && files.length > 0) {
      this.uploadFiles(files);
    }
  }

  onUpload(event: FileUploadHandlerEvent) {
    const files = event.files as File[];
    if (!files?.length) return;
    this.uploadFiles(files);
  }

  uploadFiles(files: File[] | FileList) {
    [...files].forEach(file => {
      this.isUploading = true;

      // Backendga yuborish
      this.imageService.create(file).pipe(
        finalize(() => (this.isUploading = false))
      ).subscribe({
        next: () => this.read(),
        error: err => console.error('❌ Yuklashda xatolik:', err)
      });
    });
  }

  read() {
    this.isLoading = true;

    this.imageService.read().subscribe({
      next: (res: ResponseDto) => {
        if (res.success && Array.isArray(res.data)) {
          this.imagesList = res.data as DocumentDto[];
          this.applyFilters();
          this.isLoading = false
          this.cdr.detectChanges();
        }
      }
    });
  }

  applyFilters() {
    const query = this.searchQuery.trim().toLowerCase();
    let list = [...this.imagesList];

    if (query) {
      list = list.filter(img => (img.docName ?? '').toLowerCase().includes(query));
    }

    switch (this.selectedSort?.value) {
      case 'az':
        list.sort((a, b) => (a.docName ?? '').localeCompare(b.docName ?? ''));
        break;

      case 'za':
        list.sort((a, b) => (b.docName ?? '').localeCompare(a.docName ?? ''));
        break;

      case 'date':
        list.sort((a, b) => {
          const da = new Date(a.fileDate ?? '').getTime();
          const db = new Date(b.fileDate ?? '').getTime();
          return db - da;
        });
        break;
    }

    this.filteredImages = list;
  }

  downloadImage(id: string | undefined) {
    if (!id) return;

    const img = this.imagesList.find(i => i.id === id);
    if (!img) return;

    const fileUrl = environment.minioThumbUrl + img.parentId + '/' + img.docName;

    fetch(fileUrl)
      .then(response => {
        if (!response.ok) throw new Error('Yuklab olishda xatolik');
        return response.blob();
      })
      .then(blob => {
        const link = document.createElement('a');
        const objectUrl = URL.createObjectURL(blob);
        link.href = objectUrl;
        link.download = <string>img.docName;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(objectUrl);
      })
      .catch(err => console.error('❌ Yuklab olishda xatolik:', err));
  }

  removeImage(ids: string | string[] | undefined) {
    const idList = Array.isArray(ids) ? ids : [ids];
    const dto = {idList};
    this.imageService.delete(dto).subscribe({
      next: () => {
        this.read();
        this.editDialogVisible = false;
      }
    });
  }

  openEditModal(img: DocumentDto) {
    this.editImageData = {...img, altText: img.docName};
    this.editDialogVisible = true;
  }

  saveEditedImage() {
    if (this.formSaveEditedImage.invalid) {
      this.formSaveEditedImage.markAllAsTouched();
      return;
    }

    const dto = {
      ...this.formSaveEditedImage.value,
      id: this.editImageData.id
    };
    this.imageService.update(dto).subscribe({
      next: () => {
        this.read()
        this.editDialogVisible = false;
      }
    });
  }

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
    if (files && files.length) {
      this.uploadFiles(files);
    }
  }

  toggleMenu(event: Event, menu: any) {
    menu.toggle(event);
    this.menuVisible = !this.menuVisible;
  }

  toggleSelection(img: any) {
    const index = this.selectedImages.findIndex((i) => i.id === img.id);
    if (index > -1) {
      this.selectedImages.splice(index, 1);
    } else {
      this.selectedImages.push(img);
    }
  }

  isSelected(img: any): boolean {
    return this.selectedImages.some((i) => i.id === img.id);
  }

  toggleSelectAll() {
    if (this.isAllSelected()) {
      // 🔹 Agar hammasi tanlangan bo‘lsa — bekor qilamiz
      this.selectedImages = [];
    } else {
      // 🔹 Aks holda — filteredImages’dagi hamma elementni tanlaymiz
      this.selectedImages = [...this.filteredImages];
    }
  }

  isAllSelected(): boolean {
    return (
      this.filteredImages.length > 0 &&
      this.selectedImages.length === this.filteredImages.length
    );
  }

  removeSelectedImages() {
    const ids = this.selectedImages.map((i) => i.id);
    this.imagesList = this.imagesList.filter((img) => !ids.includes(img.id));
    this.selectedImages = [];
    this.removeImage(ids)
  }

  get rows(): number[] {
    return Array.from({length: Math.ceil(this.imagesList.length / this.rowSize)}, (_, i) => i);
  }
}
