import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { XmlPipe } from '../app.pipes';



@NgModule({
  declarations: [
    XmlPipe
  ],
  imports: [
    CommonModule,
  ],
  exports: [
    XmlPipe
  ]
})
export class PipeModule { }
