import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  Host,
  inject,
  OnDestroy,
  Optional,
  Renderer2
} from '@angular/core';
import {Subscription} from 'rxjs';
import {LoadingService} from '../../service/loading/loading.service';
import {Button, ButtonDirective} from 'primeng/button';
import {FileUpload} from 'primeng/fileupload';

@Directive({
  standalone: true,
  selector: '[appLoadingButton]'
})
export class LoadingButtonDirective implements AfterViewInit, OnDestroy {
  private subscription!: Subscription;
  private cdr = inject(ChangeDetectorRef);


  constructor(
    private loadingService: LoadingService,
    @Host() @Optional() private pButton: Button,
    @Host() @Optional() private pButtonDirective: ButtonDirective,
    @Host() @Optional() private fileUpload: FileUpload,
    private el: ElementRef,
    private renderer: Renderer2
  ) {
  }

  ngAfterViewInit(): void {
    if (this.pButton || this.pButtonDirective || this.fileUpload || this.el.nativeElement) {
      this.subscription = this.loadingService.loading$.subscribe((loading) => {
        switch (true) {
          case !!this.pButton:
            this.pButton.loading = loading as boolean;
            this.cdr.detectChanges()
            break;
          case !!this.pButtonDirective:
            this.pButtonDirective.loading = loading;
            break;
          default:
            this.renderer.setAttribute(this.el.nativeElement, 'disabled', loading ? 'true' : 'false');
            if (loading) {
              this.renderer.addClass(this.el.nativeElement, 'pi-spin');
            } else {
              this.renderer.removeClass(this.el.nativeElement, 'pi-spin');
            }
            break;
        }
      });
    }
  }


  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
