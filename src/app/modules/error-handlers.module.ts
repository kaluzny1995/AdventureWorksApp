import { ErrorHandler, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomErrorHandler } from '../app.error-handlers';


@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [{provide: ErrorHandler, useClass: CustomErrorHandler}]
})
export class ErrorHandlersModule { }
