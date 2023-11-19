import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TextWidgetComponent} from "./text-widget.component";
import {VideoWidgetComponent} from "./video-widget.component";
import {WidgetFormComponent} from "./widget-form/widget-form.component";



@NgModule({
  declarations: [VideoWidgetComponent],
  imports: [
    TextWidgetComponent,
    CommonModule,
    WidgetFormComponent
  ],
  exports:[TextWidgetComponent,VideoWidgetComponent,WidgetFormComponent]
})
export class WidgetComponentsModule { }
