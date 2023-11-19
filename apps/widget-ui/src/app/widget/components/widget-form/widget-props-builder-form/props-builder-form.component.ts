import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from "@angular/forms";

@Component({
    selector: 'widget-ui-props-builder-form',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './props-builder-form.component.html',
    styleUrls: ['./props-builder-form.component.scss'],
})
export class PropsBuilderFormComponent {
    @Output() addProp = new EventEmitter()
    @Input() requiredFormError?:boolean;
}
