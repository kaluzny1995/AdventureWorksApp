import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Angular AdventureWorks';
  viewLinks = [
    {name: 'Home', url: 'home'},
    {name: 'Authenticate', url: 'authenticate'}
  ]
}
