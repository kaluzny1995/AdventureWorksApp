import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs';
import { AlertMessage } from 'src/app/models/alert-message';
import { ViewedUser } from 'src/app/models/awfapi-user/viewed-user';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  mainAlert: AlertMessage | null = null;
  mainAlertDismiss() {
    this.mainAlert = null;
  }

  viewedUser: ViewedUser;

  profileDeletionWarning: string = 'This action cannot be undone!';

  constructor(
    private _userService: AwfapiUserService, private _auth: AuthenticationService,
    private _route: ActivatedRoute, private _router: Router,
    private _dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this._route.snapshot.paramMap.has('status')) {
      let status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this._userService.view(result.username).pipe(map(data => ({
          username: data.username,
          fullName: data.full_name,
          email: data.email,
          isReadonly: Boolean(data.is_readonly),
          dateCreated: new Date(data.date_created),
          dateModified: new Date(data.date_modified)
        }) as ViewedUser)).subscribe({
          next: (result: ViewedUser) => {
            console.log('User data loaded for profile view.', result);
            this.viewedUser = result;
          },
          error: (error) => {
            console.error('Error while loading user data for profile view.', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to retrieve username.', error);
      }
    });
  }

  showAccountDeletionDialog(): void {
    const dialogRef = this._dialog.open(AccountDeletionDialog, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Account deleted.');
        this._auth.getCurrentUser().subscribe({
          next: (result: any) => {
            this._userService.removeAccount(result.username).subscribe({
              next: (result: any) => {
                console.log('Account removed successfully. Logging out.', result);
                this._auth.removeToken();
                this._router.navigate(['home', {status: AlertMessage.ACCOUNT_REMOVED}]).then(() => {
                  window.location.reload();
                });
              },
              error: (error) => {
                console.error('Error while removing account.', error);
              }
            });
          },
          error: (error) => {
            console.error('Failed to retrieve username.', error);
          }
        });
      }
    });
  }
}

@Component({
  selector: 'account-deletion-dialog',
  templateUrl: 'account-deletion-dialog.html',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule
  ],
})
export class AccountDeletionDialog implements OnInit {
  showPassword: boolean = false;
  form: FormGroup;
  confirmationPassword: FormControl;

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<AccountDeletionDialog>,
    private _auth: AuthenticationService
  ) {}

  ngOnInit(): void {
    this.confirmationPassword = new FormControl('', [Validators.required]);
    this.form = this._fb.group({
      confirmationPassword: this.confirmationPassword
    })
  }

  showConfirmationPasswordField(): void {
    this.showPassword = true;
  }

  clearError(): void {
    if (this.confirmationPassword.hasError('password')) {
      delete this.confirmationPassword?.errors?.password;
    }
  }

  cancel(): void {
    this._dialogRef.close();
  }

  confirm(): void {
    this._auth.verifyPassword(this.confirmationPassword.value).subscribe({
      next: (result: any) => {
        console.log(`Password verified with result: ${result.verified}`);
        if (!result.verified) {
          this.confirmationPassword.setErrors({'password': true});
        } else {
          console.log('Account deletion confirmed.');
          this._dialogRef.close(true);
        }
      },
      error: (error) => {
        console.error('Error while verifying password', error);
      }
    })
  }
}
