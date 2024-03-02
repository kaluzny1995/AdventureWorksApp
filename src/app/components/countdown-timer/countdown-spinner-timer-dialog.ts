import { CommonModule } from "@angular/common";
import { ChangeDetectorRef, Component, EventEmitter, Inject, OnInit, ViewChild } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { CountdownConfig, CountdownEvent, CountdownComponent } from 'ngx-countdown';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CountdownModule } from 'ngx-countdown';
import { EBootstrapColor } from "src/app/models/utils/e-bootstrap-color";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { AuthenticationService } from "src/app/services/awfapi-user/authentication.service";
import { HttpErrorResponse } from "@angular/common/http";
import { EPasswordVerificationStatus } from "src/app/models/utils/e-password-verification-status";
import { MatTooltipModule } from "@angular/material/tooltip";
import { CountdownSpinnerTimerData } from "src/app/models/utils/countdown-spinner-timer-data";

@Component({
    selector: 'countdown-spinner-timer-dialog',
    templateUrl: 'countdown-spinner-timer-dialog.html',
    standalone: true,
    imports: [
      CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule,
      MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule,
      MatProgressSpinnerModule, CountdownModule
    ],
  })
  export class CountdownSpinnerTimerDialog implements OnInit {
    private countdownTimer: CountdownComponent;
    @ViewChild('countdownSpinnerTimer', { static: false }) set content(content: CountdownComponent) {
        if (content) {
            this.countdownTimer = content;
        }
    };

    title: string;
    percentage: number;
    EBootstrapColor = EBootstrapColor;
    bootstrapClass: EBootstrapColor;
    config: CountdownConfig;
    showPassword: boolean = false;
    form: FormGroup;
    confirmationPassword: FormControl;
    onSessionRenewal: EventEmitter<any> = new EventEmitter();
    isSessionOver: boolean = false;

    constructor(
        private _changeDetector: ChangeDetectorRef,
        private _dialogRef: MatDialogRef<CountdownSpinnerTimerDialog>,
        private _fb: FormBuilder,
        private _auth: AuthenticationService,
        @Inject(MAT_DIALOG_DATA) public data: CountdownSpinnerTimerData
    ) {}
  
    ngOnInit(): void {
        /* Countdown timer settings */
        const countdownTimeSecs: number = this.getCountdownTimeSecs();
        
        this.bootstrapClass = this.setBootstrapClass(countdownTimeSecs, this.data.notifications);
        this.title = this.bootstrapClass !== EBootstrapColor.DANGER ? this.data.titleText : this.data.titleTextFinish;
        this.percentage = Math.floor(((this.data.totalTimeSecs - countdownTimeSecs) / this.data.totalTimeSecs) * 100);

        this.config = {
            leftTime: countdownTimeSecs,
            format: this.data.timeFormat,
            notify: Array.from({length: (this.data.totalTimeSecs - 1)}, (_, k) => k + 1) // every single second
        };

        /* Password check form settings */
        this.confirmationPassword = new FormControl(null, [Validators.required]);
        this.form = this._fb.group({
            confirmationPassword: this.confirmationPassword
        });

        /* Checking if session has expired */
        this._changeDetector.detectChanges(); // necessary for countdown timer component reference proper initialization
        this.isSessionOver = this.countdownTimer.left <= 0;
    }

    /**
     * Returns countdown time in seconds received from parent countdown timer (or from token)
     */
    getCountdownTimeSecs(isGotFromToken: boolean = false): number {
        if (!isGotFromToken) {
            return this.data.currentTimeSecs;
        } else {
            const expirationDate: Date = this._auth.getExpirationDateFromToken();
            const leftSecs: number = Math.ceil((expirationDate.getTime() - new Date().getTime())/1000);
            return leftSecs;
        }
    }

    /**
     * Sets countdown timers countdown time
    */
    setCountdownTimer(countdownTime: number): void {
        this.config.leftTime = countdownTime;
        this.countdownTimer.config = this.config;
        this.countdownTimer.restart();
    }

    /**
     * Sets the bootstrap class of countdown timer spinner
    */
    setBootstrapClass(countdownTime: number, notifications: any[]): EBootstrapColor {
        if (countdownTime > notifications[0]) {
            return EBootstrapColor.PRIMARY;
        } else if (countdownTime > notifications[1]) {
            return EBootstrapColor.SUCCESS;
        } else if (countdownTime > notifications[2]) {
            return EBootstrapColor.WARNING;
        } else {
            return EBootstrapColor.DANGER;
        }
    }

    /**
     * Closes the dialog
    */
    cancel(): void {
      this._dialogRef.close();
    }

    /**
     * Handles the countdown notifications
    */
    handleCountdown(event: CountdownEvent): void {
        this.percentage = Math.floor(((this.data.totalTimeSecs - (event.left/1000)) / this.data.totalTimeSecs) * 100);

        if (event.action === 'notify') {
            const current: number = Math.ceil(event.left / 1000);
            
            if (current === this.data.notifications[0]) {
              this.bootstrapClass = EBootstrapColor.SUCCESS;
            } else if (current === this.data.notifications[1]) {
              this.bootstrapClass = EBootstrapColor.WARNING;
            } else if (current === this.data.notifications[2]) {
              this.bootstrapClass = EBootstrapColor.DANGER;
              this.title = this.data.titleTextFinish;
            } else if (current === 1) {
              this.isSessionOver = true;
            }
          }
    }

    /**
     * Clears wrong password error in password check
    */
    clearError(): void {
      if (this.confirmationPassword.hasError('password')) {
        delete this.confirmationPassword?.errors?.password;
      }
    }

    /**
     * Renews (refreshes) the session
    */
    renewSession(): void {
      this._auth.verifyPassword(this.confirmationPassword.value).subscribe({
        next: (result: any) => {
            switch (result.title) {
                case EPasswordVerificationStatus.UNVERIFIED:
                this.confirmationPassword.setErrors({'password': true});
                break;
                case EPasswordVerificationStatus.VERIFIED:
                /* Getting new token via API */
                const credentialsData: FormData = new FormData();
                credentialsData.append('username', this._auth.getUsernameFromToken());
                credentialsData.append('password', this.confirmationPassword.value);

                this._auth.authenticate(credentialsData).subscribe({
                next: (result: any) => {
                    /* resetting password check */
                    this.form.reset();
                    this.showPassword = false;

                    /* setting new token */
                    this._auth.setToken(result.access_token);

                    /* setting countdown timer and spinner dialog appearance */
                    this.setCountdownTimer(this.getCountdownTimeSecs(true));
                    this.bootstrapClass = EBootstrapColor.PRIMARY;
                    this.title = this.data.titleText;

                    /* prompting parent countdown timer to change */
                    this.onSessionRenewal.emit();
                },
                error: (error: HttpErrorResponse) => {
                    console.error('Error while logging:', error);
                }
                });
                break;
                default:
                console.error(`Unknown verification status: ${result.title}`);
                break;
            }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while verifying password', error);
        }
      })
    }
}
