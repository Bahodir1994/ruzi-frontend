import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  standalone: true,
  selector: 'img[appImageFallback]' // faqat <img> teglarda ishlaydi
})
export class ImageFallbackDirective {
  @Input('appImageFallback') fallbackSrc!: string; // fallback rasmi
  private originalSrc?: string;

  constructor(private el: ElementRef<HTMLImageElement>, private renderer: Renderer2) {
  }

  ngOnInit() {
    // asl src saqlab qo‘yamiz
    this.originalSrc = this.el.nativeElement.src;
  }

  // agar rasm yuklanmasa
  @HostListener('error')
  onError() {
    const img = this.el.nativeElement;
    if (this.fallbackSrc && img.src !== this.fallbackSrc) {
      this.renderer.setAttribute(img, 'src', this.fallbackSrc);
    }
  }

  // agar yangi src berilsa, yana kuzatamiz
  @HostListener('load')
  onLoad() {
    const img = this.el.nativeElement;
    if (img.src === this.fallbackSrc && this.originalSrc) {
      this.renderer.removeAttribute(img, 'src');
      this.renderer.setAttribute(img, 'src', this.originalSrc);
    }
  }
}

