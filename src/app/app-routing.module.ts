import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { Error404Component } from './components/errors/error404/error404.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ProfileComponent } from './components/awfapi-user/profile/profile.component';
import { AboutAuthorComponent } from './components/about-author/about-author.component';
import { RegisterComponent } from './components/awfapi-user/register/register.component';
import { ChangeDataComponent } from './components/awfapi-user/change-data/change-data.component';
import { ChangeCredentialsComponent } from './components/awfapi-user/change-credentials/change-credentials.component';
import { FirstStepsComponent } from './components/instructions/first-steps/first-steps.component';
import { DataflowDiagramsComponent } from './components/instructions/dataflow-diagrams/dataflow-diagrams.component';
import { EntitiesComponent } from './components/instructions/entities/entities.component';
import { AdminPannelsComponent } from './components/instructions/admin-pannels/admin-pannels.component';
import { PersonsComponent } from './components/admin-pannels/persons/persons.component';
import { PersonFormComponent } from './components/admin-pannels/person-form/person-form.component';
import { NonReadonlyGuard } from './guards/non-readonly.guard';
import { Error403Component } from './components/errors/error403/error403.component';
import { NotSignedInGuard } from './guards/not-signed-in.guard';
import { Error500Component } from './components/errors/error500/error500.component';
import { PhoneNumberTypesComponent } from './components/admin-pannels/phone-number-types/phone-number-types.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'author', component: AboutAuthorComponent},
  {path: 'instructions', redirectTo: '/instructions/first-steps', pathMatch: 'full'},
  {path: 'instructions/first-steps', component: FirstStepsComponent},
  {path: 'instructions/dataflow-diagrams', component: DataflowDiagramsComponent},
  {path: 'instructions/entities', component: EntitiesComponent},
  {path: 'instructions/admin-pannels', component: AdminPannelsComponent, canActivate: [AuthenticationGuard]},
  {path: 'authenticate', component: AuthenticationComponent, canActivate: [NotSignedInGuard]},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'register', component: RegisterComponent, canActivate: [NotSignedInGuard]},
  {path: 'change-data', component: ChangeDataComponent, canActivate: [AuthenticationGuard]},
  {path: 'change-credentials', component: ChangeCredentialsComponent, canActivate: [AuthenticationGuard]},
  {path: 'pannels', redirectTo: '/pannels/persons', pathMatch: 'full'},
  {path: 'pannels/persons', component: PersonsComponent, canActivate: [AuthenticationGuard]},
  {path: 'pannels/persons/:id', component: PersonFormComponent, canActivate: [AuthenticationGuard, NonReadonlyGuard]},
  {path: 'pannels/phone-number-types', component: PhoneNumberTypesComponent, canActivate: [AuthenticationGuard]},
  {path: '403', component: Error403Component},
  {path: '500', component: Error500Component},
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
