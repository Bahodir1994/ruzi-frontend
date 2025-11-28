import {Component, EventEmitter, Input, Output} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-quick-tile',
  imports: [
    NgClass
  ],
  templateUrl: './quick-tile.html',
  standalone: true,
  styleUrl: './quick-tile.scss'
})
export class QuickTile {
  @Input() icon!: string;
  @Input() label!: string;

  @Input() selected = false;   // 🔥 TANLANGAN HOLAT

  @Output() clicked = new EventEmitter<void>();

  onClick() {
    this.clicked.emit();
  }
}
