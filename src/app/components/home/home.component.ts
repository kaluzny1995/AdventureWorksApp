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

  mailString: string;
  instructionNumber: number;

  constructor(private _route: ActivatedRoute, private _auth: AuthenticationService) { }

  ngOnInit(): void {
    if (this._route.snapshot.paramMap.has('message')) {
      let message = this._route.snapshot.paramMap.get('message');
      let type = this._route.snapshot.paramMap.get('type');

      this.mainAlert = {message: message, type: type};
    }

    this.mailString = "mailto:dzh.awaria@gmail.com?subject=Hello&body=Message for you...";
    this.instructionNumber = 0;
  }

  setInstruction(index: number) {
    this.instructionNumber = index;
  }

  nextInstruction() {
    this.instructionNumber++;
  }

  previousInstruction() {
    this.instructionNumber--;
  }


}
