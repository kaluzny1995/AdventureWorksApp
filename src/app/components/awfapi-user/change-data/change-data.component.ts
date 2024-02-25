import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { ChangedUserData } from 'src/app/models/awfapi-user/changed-user-data';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user/awfapi-user.service';

@Component({
  selector: 'app-change-data',
  templateUrl: './change-data.component.html',
  styleUrls: ['./change-data.component.scss']
})
export class ChangeDataComponent implements OnInit {
  mainAlert: AlertMessage | null = null;

  originalData: ChangedUserData;

  form: FormGroup;
  fullName: FormControl;
  email: FormControl;
  isReadonly: FormControl;

  isChanged: boolean = false;

  constructor(
    private _userService: AwfapiUserService,
    private _auth: AuthenticationService,
    private _fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private _alert: AlertMessageService
  ) {}

  ngOnInit(): void {
    /* Status alerts setting */
    if (this._route.snapshot.paramMap.has('status')) {
      const status = this._route.snapshot.paramMap.get('status');
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

    /* Form initialization */
    this.fullName = new FormControl(null, Validators.required);
    this.email = new FormControl(null, [Validators.required, Validators.email]);
    this.isReadonly = new FormControl(false);
    this.form = this._fb.group({
      fullName: this.fullName,
      email: this.email,
      isReadonly: this.isReadonly
    });
    
    /* Loading current users data */
    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this.originalData = ChangedUserData.fromAPIStructure(result);
        this.form.setValue(this.originalData);
        console.log('User data successfully loaded into form.');

        this.form.valueChanges.subscribe(data => {
          this.isChanged = !this.originalData.equals(ChangedUserData.fromFormStructure(data));
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading current user data.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });
  }

  /**
   * Clears non-unique value error (for email field)
  */
  clearUniqueError(fieldName: string): void {
    switch (fieldName) {
      case 'email': {
        if (this.email.hasError('unique')) {
          delete this.email?.errors?.unique;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  /**
   * Changes current users data
  */
  changeData(): void {
    const changedUserData: ChangedUserData = ChangedUserData.fromFormStructure(this.form.value);

    const awfapiUsername: string = this._auth.getUsernameFromToken();
    this._userService.changeData(awfapiUsername, changedUserData.toAPIStructure()).subscribe({
    next: (result: any) => {
      console.log('User data changed successfully.', result);
      this._router.navigate(['profile', {status: AlertMessage.USER_DATA_CHANGED}]).then(() => {
        window.location.reload();
      });
    },
    error: (error: HttpErrorResponse) => {
      console.error('Error while changing user data.', error);
      if (error.status === 400) {
        const errorMessage = error.error.detail.title;
        if (errorMessage.includes('email')) {
          this.email.setErrors({unique: true});
        }
      } else {
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    }
  });
  }
}
