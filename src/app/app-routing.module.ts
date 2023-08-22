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

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'author', component: AboutAuthorComponent},
  {path: 'instructions', redirectTo: '/instructions/first-steps', pathMatch: 'full'},
  {path: 'instructions/first-steps', component: FirstStepsComponent},
  {path: 'instructions/dataflow-diagrams', component: DataflowDiagramsComponent},
  {path: 'instructions/entities', component: EntitiesComponent},
  {path: 'instructions/admin-pannels', component: AdminPannelsComponent},
  {path: 'authenticate', component: AuthenticationComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: 'register', component: RegisterComponent},
  {path: 'change-data', component: ChangeDataComponent, canActivate: [AuthenticationGuard]},
  {path: 'change-credentials', component: ChangeCredentialsComponent, canActivate: [AuthenticationGuard]},
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
