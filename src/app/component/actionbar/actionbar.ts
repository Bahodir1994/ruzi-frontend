import {Component, Input, OnInit, TemplateRef, WritableSignal} from '@angular/core';
import {NgClass, NgTemplateOutlet} from '@angular/common';

@Component({
  selector: 'app-actionbar',
  imports: [
    NgTemplateOutlet
  ],
  templateUrl: './actionbar.html',
  standalone: true,
  styleUrl: './actionbar.scss'
})
export class Actionbar implements OnInit {
  @Input({required: true}) bottomBarVisible!: WritableSignal<boolean>;

  // SLOT templates
  @Input() infoTemplate!: TemplateRef<any>;
  @Input() actionsTemplate!: TemplateRef<any>;

  ngOnInit(): void {
  }
}
