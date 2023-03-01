import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'Angular AdventureWorks';
  viewLinks = [
    {name: 'Home', url: 'home'}
  ];

  constructor(private _auth: AuthenticationService, private _router: Router) {}

  ngOnInit(): void {
    
  }
}
