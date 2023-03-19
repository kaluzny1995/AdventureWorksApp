import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { Error404Component } from './components/errors/error404/error404.component';
import { HomeComponent } from './components/home/home.component';
import { AuthenticationGuard } from './guards/authentication.guard';
import { ProfileComponent } from './components/profile/profile.component';
import { AboutAuthorComponent } from './components/about-author/about-author.component';

const routes: Routes = [
  {path: '', redirectTo: '/home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'author', component: AboutAuthorComponent},
  {path: 'authenticate', component: AuthenticationComponent},
  {path: 'profile', component: ProfileComponent, canActivate: [AuthenticationGuard]},
  {path: '**', component: Error404Component}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
