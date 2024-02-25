import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { ViewedUser } from 'src/app/models/awfapi-user/viewed-user';
import { DeletionConfirmationData } from 'src/app/models/utils/deletion-confirmation-data';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user/awfapi-user.service';
import { DeletionConfirmationDialog } from '../../utils/deletion-confirmation-dialog';
import { EDeletionConfirmation } from 'src/app/models/utils/e-deletion-confirmation';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  mainAlert: AlertMessage | null = null;

  viewedUser: ViewedUser;

  constructor(
    private _userService: AwfapiUserService,
    private _auth: AuthenticationService,
    private _alert: AlertMessageService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    /* Status alerts setting */
    if (this._route.snapshot.paramMap.has('status')) {
      const status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        case 'user_data_changed': {
          this.mainAlert = AlertMessage.USER_DATA_CHANGED;
          break;
        }
        case 'user_cred_changed': {
          this.mainAlert = AlertMessage.USER_CRED_CHANGED;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    /* Loading current users data */
    const awfapiUsername: string = this._auth.getUsernameFromToken();
    this._userService.view(awfapiUsername).subscribe({
      next: (result: any) => {
        console.log('User data loaded for profile view.', result);
        this.viewedUser = ViewedUser.fromAPIStructure(result);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading user data for profile view.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });
  }

  /**
   * Opens account deletion confirmation dialog
   */
  showAccountDeletionDialog(): void {
    const deletionConfirmationData = new DeletionConfirmationData(
      'Account removal',
      'Are you sure, you wanna delete your account?',
      'Cannot delete account.'
    );

    const dialogRef = this._dialog.open(DeletionConfirmationDialog, {
      data: deletionConfirmationData,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: EDeletionConfirmation) => {
      switch (result) {
        case EDeletionConfirmation.OK:
          /* Removing user account via API */
          const awfapiUsername: string = this._auth.getUsernameFromToken();
          this._userService.removeAccount(awfapiUsername).subscribe({
            next: (result: any) => {
              console.log('Account removed successfully. Logging out.', result);
              this._auth.removeToken();
              this._router.navigate(['home', {status: AlertMessage.ACCOUNT_REMOVED}]).then(() => {
                window.location.reload();
              });
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error while removing account.', error);
              this.mainAlert = this._alert.statusAlertMesssage(error.status);
            }
          });
          break;
        case EDeletionConfirmation.ERROR_0:
        case EDeletionConfirmation.ERROR_400:
        case EDeletionConfirmation.ERROR_401:
        case EDeletionConfirmation.ERROR_404:
        case EDeletionConfirmation.ERROR_500:
          console.error('Password verification ended with error.');
          this.mainAlert = this._alert.statusAlertMesssage(result);
          break;
        case EDeletionConfirmation.CANCEL:
        default:
          break;
      }
    });
  }
}
