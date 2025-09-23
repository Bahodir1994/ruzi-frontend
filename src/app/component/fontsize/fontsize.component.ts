import {Component, Input, OnInit, ViewEncapsulation} from '@angular/core';
import {NgClass} from '@angular/common';

@Component({
  selector: 'app-fontsize',
  imports: [
    NgClass
  ],
  templateUrl: './fontsize.component.html',
  standalone: true,
  styleUrl: './fontsize.component.scss',
  encapsulation: ViewEncapsulation.None
})
export class FontsizeComponent implements OnInit {
  public selectedFont = 'md';
  public fontSize!: string;
  public lgSize!: string;
  public mdSize!: string;
  public smSize!: string;
  public iconColor!: string;
  public selectedColor!: string;

  private readonly STORAGE_KEY = 'selectedFontSize';

  ngOnInit() {
    const savedFont = localStorage.getItem(this.STORAGE_KEY);
    if (savedFont) {
      this.selectedFont = savedFont;
    }

    if (!this.mdSize) {
      this.mdSize = getComputedStyle(document.body).fontSize;
    }

    this.toggleFontIcon(this.selectedFont);
    this.setStyling(this.iconColor, this.selectedColor, this.fontSize);
  }

  setStyling(iconColor: string, selectedColor: string, fontSize: string) {
    document.documentElement.style.setProperty('--icon-color', iconColor);
    document.documentElement.style.setProperty('--selected-color', selectedColor);

    if (fontSize) {
      document.documentElement.style.setProperty('--font-size', fontSize);
    } else {
      // Если fontSize пустой — вернёмся к дефолтному
      document.documentElement.style.removeProperty('--font-size');
    }
  }

  @Input('iconColor')
  public set seticonColor(iconColor: string) {
    this.iconColor = iconColor;
  }

  @Input('selectedColor')
  public set setselectedColor(selectedColor: string) {
    this.selectedColor = selectedColor;
  }

  @Input('lgSize')
  public set setlgSize(lgSize: string) {
    this.lgSize = lgSize;
  }

  @Input('mdSize')
  public set setmdSize(mdSize: string) {
    this.mdSize = mdSize;
  }

  @Input('smSize')
  public set setsmSize(smSize: string) {
    this.smSize = smSize;
  }

  toggleFontIcon(size: any) {
    this.selectedFont = size;

    localStorage.setItem(this.STORAGE_KEY, size);

    switch (size) {
      case 'lg':
        this.fontSize = this.lgSize;
        break;
      case 'sm':
        this.fontSize = this.smSize;
        break;
      case 'md':
      default:
        this.fontSize = ''; // очищаем переменную
        break;
    }

    this.setStyling(this.iconColor, this.selectedColor, this.fontSize);
  }

}
