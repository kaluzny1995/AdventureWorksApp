import { Component, OnInit } from '@angular/core';
import { AppConfigService } from './services/utils/app-config.service';
import { AuthenticationService } from './services/awfapi-user/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { EAuthenticationStatus } from './models/utils/e-authentication-status';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string;
  shortTitle: string;
  viewLinks: any[] = [
    {name: 'Home', url: 'home'},
    {name: 'About author', url: 'author'},
    {name: 'Instructions', subLinks: [
      {name: 'First steps', url: 'instructions/first-steps'},
      {name: 'Dataflow diagrams', url: 'instructions/dataflow-diagrams'},
      {name: 'Entities', url: 'instructions/entities'},
      {name: 'Admin pannels', url: 'instructions/admin-pannels', isAuthRequired: true},
    ]},
    {name: 'Admin pannels', subLinks: [
      {name: 'Persons', url: 'pannels/persons'},
      {name: 'Person phones', url: 'pannels/person-phones'},
      {name: 'Phone number types', url: 'pannels/phone-number-types'}
    ], isAuthRequired: true}
  ];
  isAuthenticated: boolean;

  constructor(private _appConfig: AppConfigService, private _auth: AuthenticationService) {}

  ngOnInit(): void {
    this.title = this._appConfig.title;
    this.shortTitle = this._appConfig.shortTitle;

    /* Checking authentication status */
    this._auth.testAuthentication().subscribe({
      next: (result: any) => {
        this.isAuthenticated = result.title === EAuthenticationStatus.AUTHENTICATED;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while checking authentication status.', error);
      }
    });
  }
}
