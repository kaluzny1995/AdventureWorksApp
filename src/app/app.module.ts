import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './modules/material.module';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { Error404Component } from './components/errors/error404/error404.component';
import { Error403Component } from './components/errors/error403/error403.component';
import { RequestInterceptionService } from './services/utils/request-interception.service';
import { NavMenuComponent } from './components/nav-menu/nav-menu.component';
import { ProfileComponent } from './components/awfapi-user/profile/profile.component';
import { AboutAuthorComponent } from './components/about-author/about-author.component';
import { AppConfigService } from './services/utils/app-config.service';
import { RegisterComponent } from './components/awfapi-user/register/register.component';
import { ChangeDataComponent } from './components/awfapi-user/change-data/change-data.component';
import { ChangeCredentialsComponent } from './components/awfapi-user/change-credentials/change-credentials.component';
import { FirstStepsComponent } from './components/instructions/first-steps/first-steps.component';
import { DataflowDiagramsComponent } from './components/instructions/dataflow-diagrams/dataflow-diagrams.component';
import { EntitiesComponent } from './components/instructions/entities/entities.component';
import { AdminPannelsComponent } from './components/instructions/admin-pannels/admin-pannels.component';
import { PersonsComponent } from './components/admin-pannels/persons/persons.component';
import { ErrorHandlersModule } from './modules/error-handlers.module';
import { PersonFormComponent } from './components/admin-pannels/person-form/person-form.component';
import { PipeModule } from './modules/pipe.module';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AuthenticationComponent,
    Error404Component,
    Error403Component,
    NavMenuComponent,
    ProfileComponent,
    AboutAuthorComponent,
    RegisterComponent,
    ChangeDataComponent,
    ChangeCredentialsComponent,
    FirstStepsComponent,
    DataflowDiagramsComponent,
    EntitiesComponent,
    AdminPannelsComponent,
    PersonsComponent,
    PersonFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule, ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    PipeModule,
    ErrorHandlersModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: RequestInterceptionService, multi: true},
    {provide: APP_INITIALIZER, multi: true, deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          return appConfigService.loadAppConfig();
        };
      }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
