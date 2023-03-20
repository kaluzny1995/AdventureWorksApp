import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfigService } from './services/app-config.service';
import { AuthenticationService } from './services/authentication.service';

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
    {name: 'About author', url: 'author'}
  ];

  constructor(private _appConfig: AppConfigService) {}

  ngOnInit(): void {
    this.title = this._appConfig.title;
    this.shortTitle = this._appConfig.shortTitle;
  }
}
