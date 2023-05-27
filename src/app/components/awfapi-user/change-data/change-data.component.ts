import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertMessage } from 'src/app/models/alert-message';
import { ChangedUserData } from 'src/app/models/awfapi-user/changed-user-data';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { AwfapiUserService } from 'src/app/services/awfapi-user.service';

@Component({
  selector: 'app-change-data',
  templateUrl: './change-data.component.html',
  styleUrls: ['./change-data.component.scss']
})
export class ChangeDataComponent implements OnInit {
  mainAlert: AlertMessage | null = null;
  mainAlertDismiss(): void {
    this.mainAlert = null;
  }

  originalData: ChangedUserData;

  form: FormGroup;
  fullName: FormControl;
  email: FormControl;
  isReadonly: FormControl;

  isChanged: boolean = false;

  constructor(
    private _userService: AwfapiUserService, private _auth: AuthenticationService,
    private _fb: FormBuilder, private _route: ActivatedRoute, private _router: Router
  ) {}

  ngOnInit(): void {
    if (this._route.snapshot.paramMap.has('status')) {
      let status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        case 'user_data_changed': {
          this.mainAlert = AlertMessage.USER_DATA_CHANGED;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    this.fullName = new FormControl('', Validators.required);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.isReadonly = new FormControl(false);
    this.form = this._fb.group({
      fullName: this.fullName,
      email: this.email,
      isReadonly: this.isReadonly
    });

    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this.originalData = ChangedUserData.fromAPIStructure(result);
        this.form.setValue(this.originalData);
        console.log('User data successfully loaded into form.');

        this.form.valueChanges.subscribe(data => {
          this.isChanged = !this.originalData.equals(ChangedUserData.fromFormStructure(data));
        });
      },
      error: (error) => {
        console.error('Error while loading current user data.', error);
      }
    });
  }

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

  changeData(): void {
    const changedUserData: ChangedUserData = ChangedUserData.fromFormStructure(this.form.value);
    console.log('Changed user data:', changedUserData);

    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this._userService.changeData(
            result.username,
            changedUserData.toAPIStructure()
          ).subscribe({
          next: (result: any) => {
            console.log('User data changed successfully.', result);
            this._router.navigate(['change-data', {status: AlertMessage.USER_DATA_CHANGED}]).then(() => {
              window.location.reload();
            });
          },
          error: (error) => {
            console.error('Error while changing user data.', error);
            let errorMessage = error.error.detail.info;
            if (errorMessage.includes('email')) {
              this.email.setErrors({unique: true});
            }
          }
        });
      },
      error: (error) => {
        console.error('Error while loading current user data.', error);
      }
    });
  }
}
