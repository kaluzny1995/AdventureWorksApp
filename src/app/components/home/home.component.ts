import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mainAlert: any = {message: null, type: null};
  mainAlertDismiss() {
    this.mainAlert = {message: null, type: null};
  }

  resultMessage: string = 'Run the actions...';
  resultState: string | null = null;

  constructor(private _route: ActivatedRoute, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    if (this._route.snapshot.paramMap.has('message')) {
      let message = this._route.snapshot.paramMap.get('message');
      let type = this._route.snapshot.paramMap.get('type');

      this.mainAlert = {message: message, type: type};
    }
  }

  testAuthentication() {
    console.log('Testing authentication.');

    this._auth.testAuthentication().subscribe({
      next: (result) => {
        console.log('Authentication test succeeded.', result);

        this.resultMessage = JSON.stringify(result);
        this.resultState = 'success';
      },
      error: (error) => {
        console.error('Authentication test failed.', error);

        this.resultMessage = `Status: ${error.status}, ${error.message}, ${JSON.stringify(error.error)}`;
        this.resultState = 'error';
      }
    });
  }

  getCurrentUser() {
    console.log('Testing current user.');

    this._auth.getCurrentUser().subscribe({
      next: (result) => {
        console.log('Current user test succeeded.', result);

        this.resultMessage = JSON.stringify(result);
        this.resultState = 'success';
      },
      error: (error) => {
        console.error('Current user test failed.', error);

        this.resultMessage = `Status: ${error.status}, ${error.message}, ${JSON.stringify(error.error)}`;
        this.resultState = 'error';
      }
    });
  }
}
