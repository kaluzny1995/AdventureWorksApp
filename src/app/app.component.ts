import { Component, OnInit } from '@angular/core';
import { AppConfigService } from './services/app-config.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title: string
  shortTitle: string
  viewLinks: any[] = [
    {name: 'Home', url: 'home'},
    {name: 'About author', url: 'author'},
    {name: 'Instructions', subLinks: [
      {name: 'First steps', url: 'instructions/first-steps'},
      {name: 'Dataflow diagrams', url: 'instructions/dataflow-diagrams'},
      {name: 'Entities', url: 'instructions/entities'},
      {name: 'Admin pannels', url: 'instructions/admin-pannels', isAuthRequired: true},
    ]}
  ]
  isAuthenticated: boolean

  constructor(private _appConfig: AppConfigService, private _auth: AuthenticationService) {}

  ngOnInit(): void {
    this.title = this._appConfig.title;
    this.shortTitle = this._appConfig.shortTitle;

    this.isAuthenticated = this._auth.isAuthenticated();
  }
}
