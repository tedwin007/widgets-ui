import {Component, inject, Input, ViewEncapsulation} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BaseWidget} from "@tedwin007/widgets";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {WidgetService} from "../../widget.service";
import {getNewWidgetTemplate, getTypeOf} from "../../utils";
import {take, tap} from "rxjs";
import {HiddenFormComponent,} from "./widget-hidden-props-form/hidden-form.component";
import {PropsBuilderFormComponent} from "./widget-props-builder-form/props-builder-form.component";
import {WidgetSaveResultComponent} from "./widget-save-result/widget-save-result.component";
import {WidgetProps} from "../../models/interfaces";

@Component({
    selector: 'widget-ui-widget-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule, PropsBuilderFormComponent, HiddenFormComponent, WidgetSaveResultComponent],
    templateUrl: './widget-form.component.html',
    styleUrls: ['./widget-form.component.scss'],
    encapsulation: ViewEncapsulation.Emulated,
})
export class WidgetFormComponent {
    @Input() title?: string
    @Input() description?: string;

    @Input() set rawWidget(value: BaseWidget<any>) {
        if (value.id) this.buildHiddenPropsForm(value);
        this.form = this.buildWidgetForm(value)
        this.form.disable()
    }

    protected form!: FormGroup;
    protected hiddenPropsForm?: FormGroup;
    protected saveResult?: BaseWidget;
    protected requiredFormError?: boolean;
    private widgetService: WidgetService = inject(WidgetService)
    private fb: FormBuilder = inject(FormBuilder)
    protected readonly getTypeOf = getTypeOf;

    constructor() {
        this.initForm()
    }

    private initForm(): void {
        const controls: WidgetProps = getNewWidgetTemplate().widgetProps;
        this.form = this.fb.group<any>(controls)
    }

    get formData(): WidgetProps {
        return this.form.getRawValue()
    }

    submit(): void {
        const props = this.form.getRawValue();

        if (!Object.keys(props).length) {
            this.requiredFormError = true
            return void (0);
        }

        const widget: BaseWidget = this.getWidgetTemplate(props);
        const hiddenPropsValue = this.hiddenPropsForm?.getRawValue();

        this.widgetService.saveWidget(widget, hiddenPropsValue).pipe(
            take(1),
            tap((toJsonResult?: BaseWidget) => this.saveResult = toJsonResult)
        ).subscribe()
    }


    addProp(form: any): void {
        const formData = new FormData(form['currentTarget']);
        const value = formData.get('value');
        const key = formData.get('key') as any;

        if (!key || !value) {
            this.requiredFormError = true;
            return
        }
        this.requiredFormError = false;
        this.form.addControl(key, new FormControl(value))
        form.target.reset()
    }

    private buildWidgetForm(value: BaseWidget<any>): FormGroup {
        return this.fb.group<any>({
            ...Object.keys(value.data).reduce((previousValue: any, currentValue: any) => {
                return {
                    ...(previousValue || {}),
                    [currentValue]: [getTypeOf(typeof value.data[currentValue]) || '']
                }
            }, {})
        });
    }

    private buildHiddenPropsForm(value: BaseWidget<any>) {
        this.hiddenPropsForm = this.fb.group({
            id: [value.id],
            version: [value.version]
        })
    }

    private getWidgetTemplate(props: WidgetProps): BaseWidget {
        return {
            widgetProps: props,
            config: {},
        };
    }

}
