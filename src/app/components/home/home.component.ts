import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AlertMessage } from 'src/app/models/alert-message';
import { AppConfigService } from 'src/app/services/app-config.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  mainAlert: AlertMessage | null = null;
  mainAlertDismiss(): void {
    this.mainAlert = null;
  }

  title: string;
  shortTitle: string;
  emailUrl: string;

  constructor(private _appConfig: AppConfigService, private _route: ActivatedRoute) { }

  ngOnInit(): void {
    if (this._route.snapshot.paramMap.has('status')) {
      let status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        case 'already_auth': {
          this.mainAlert = AlertMessage.ALREADY_AUTH;
          break;
        }
        case 'signout_required': {
          this.mainAlert = AlertMessage.SIGNOUT_REQUIRED;
          break;
        }
        case 'signed_out': {
          this.mainAlert = AlertMessage.SIGNED_OUT;
          break;
        }
        case 'account_removed': {
          this.mainAlert = AlertMessage.ACCOUNT_REMOVED;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    this.title = this._appConfig.title;
    this.shortTitle = this._appConfig.shortTitle;
    this.emailUrl = this._appConfig.emailUrl;
  }

}
