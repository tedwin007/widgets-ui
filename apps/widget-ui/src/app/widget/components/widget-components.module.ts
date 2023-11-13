import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {TextWidgetComponent} from "./text-widget.component";
import {VideoWidgetComponent} from "./video-widget.component";



@NgModule({
  declarations: [TextWidgetComponent,VideoWidgetComponent],
  imports: [
    CommonModule
  ],
  exports:[TextWidgetComponent,VideoWidgetComponent]
})
export class WidgetComponentsModule { }
