import {Component, EventEmitter, OnInit, Output, TemplateRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-category-edit',
  imports: [],
  templateUrl: './category-edit.html',
  standalone: true,
  styleUrl: './category-edit.scss'
})
export class CategoryEdit implements OnInit{
  @Output() headerReady = new EventEmitter<TemplateRef<any>>();
  @ViewChild('headerContent', { static: true }) headerContent!: TemplateRef<any>;


  ngOnInit(): void {
    this.headerReady.emit(this.headerContent);
  }

}
