import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { DeletionConfirmationData } from "src/app/models/deletion-confirmation-data";
import { EDeletionConfirmation } from "src/app/models/e-deletion-confirmation";
import { EPasswordVerificationStatus } from "src/app/models/e-password-verification-status";
import { AuthenticationService } from "src/app/services/authentication.service";

@Component({
    selector: 'deletion-confirmation-dialog',
    templateUrl: 'deletion-confirmation-dialog.html',
    standalone: true,
    imports: [
      CommonModule, FormsModule, ReactiveFormsModule,
      MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule
    ],
  })
  export class DeletionConfirmationDialog implements OnInit {
    showPassword: boolean = false;
    form: FormGroup;
    confirmationPassword: FormControl;
  
    constructor(
      private _fb: FormBuilder,
      private _dialogRef: MatDialogRef<DeletionConfirmationDialog>,
      private _auth: AuthenticationService,
      @Inject(MAT_DIALOG_DATA) public data: DeletionConfirmationData
    ) {}
  
    ngOnInit(): void {
      this.confirmationPassword = new FormControl(null, [Validators.required]);
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
      this._dialogRef.close(EDeletionConfirmation.CANCEL);
    }
  
    confirm(): void {
      this._auth.verifyPassword(this.confirmationPassword.value).subscribe({
        next: (result: any) => {
          console.log('Password verified with result:', result);
          switch (result.title) {
            case EPasswordVerificationStatus.UNVERIFIED:
              this.confirmationPassword.setErrors({'password': true});
              break;
            case EPasswordVerificationStatus.VERIFIED:
              console.log('Account deletion confirmed.');
              this._dialogRef.close(EDeletionConfirmation.OK);
              break;
            default:
              console.error(`Unknown verification status: ${result.title}`);
              break;
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while verifying password', error);
          switch (error.status) {
            case 0:
              this._dialogRef.close(EDeletionConfirmation.ERROR_0)
              break;
            case 400:
              this._dialogRef.close(EDeletionConfirmation.ERROR_400)
              break;
            case 401:
              this._dialogRef.close(EDeletionConfirmation.ERROR_401)
              break;
            case 404:
              this._dialogRef.close(EDeletionConfirmation.ERROR_404)
              break;
            default:
              this._dialogRef.close(EDeletionConfirmation.ERROR_500)
              break;
        }
        }
      })
    }
}
