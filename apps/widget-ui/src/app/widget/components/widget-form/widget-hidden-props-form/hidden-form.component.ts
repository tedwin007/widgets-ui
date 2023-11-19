import {Component, Input} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'widget-ui-hidden-form',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <form [formGroup]="form">
      <input type="text" *ngIf="form.get('id')" formControlName="id" hidden="hidden">
      <input type="text" *ngIf="form.get('version')" formControlName="version" hidden="hidden">
    </form>`,
})
export class HiddenFormComponent {
  @Input() form!: FormGroup
  @Input() requiredFormError?: boolean;

}
