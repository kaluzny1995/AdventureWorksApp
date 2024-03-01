import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CountdownConfig, CountdownComponent, CountdownEvent } from 'ngx-countdown';
import { CountdownTimerSettings } from 'src/app/models/utils/countdown-timer-settings';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { AppConfigService } from 'src/app/services/utils/app-config.service';
import { CountdownSpinnerTimerDialog } from './countdown-spinner-timer-dialog';
import { EBootstrapColor } from 'src/app/models/utils/e-bootstrap-color';
import { EAuthenticationStatus } from 'src/app/models/utils/e-authentication-status';
import { HttpErrorResponse } from '@angular/common/http';
import { CountdownSpinnerTimerData } from 'src/app/models/utils/countdown-spinner-timer-data';

@Component({
  selector: 'app-countdown-timer',
  templateUrl: './countdown-timer.component.html',
  styleUrls: ['./countdown-timer.component.scss']
})
export class CountdownTimerComponent implements OnInit {
  private countdownTimer: CountdownComponent;
  @ViewChild('countdownTimer', { static: false }) set content(content: CountdownComponent) {
    if (content) {
      this.countdownTimer = content;
    }
  };

  isAuthenticated: boolean;
  isDialogOpened: boolean = false;
  bootstrapClass: EBootstrapColor;
  tooltipText: string;
  settings: CountdownTimerSettings;
  notifications: number[];
  config: CountdownConfig;

  constructor(
    private _changeDetector: ChangeDetectorRef,
    private _appConfig: AppConfigService,
    private _auth: AuthenticationService,
    private _countdownTimerDialog: MatDialog
  ) { }

  ngOnInit(): void {
    /* Checking authentication status */
    this._auth.testAuthentication().subscribe({
      next: (result: any) => {
        if (result.title !== EAuthenticationStatus.AUTHENTICATED) {
          this.isAuthenticated = false;
        } else {
          this.isAuthenticated = true;

          /* Setting up the countdown timer (only if authenticated) */
          const countdownTime: number = this.getCountdownTimeSecs();
          this.settings = this._appConfig.countdownTimerSettings;

          this.notifications = [
            Math.ceil(this.settings.timeMins * 60 * this.settings.notifyGreenAt),
            Math.ceil(this.settings.timeMins * 60 * this.settings.notifyYellowAt),
            Math.ceil(this.settings.timeMins * 60 * this.settings.notifyRedAt),
            1
          ];

          this.bootstrapClass = this.setBootstrapClass(countdownTime, this.notifications);
          this.tooltipText = this.bootstrapClass !== EBootstrapColor.DANGER ? this.settings.tooltipText : this.settings.tooltipFinishText;

          this.config = {
            leftTime: countdownTime,
            format: this.settings.timeFormat,
            notify: this.notifications
          };

          this._changeDetector.detectChanges(); // necessary for countdown timer component component reference
        }
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while checking authentication status.', error);
      }
    });
  }

  /**
   * Returns time left in seconds till the end of session
   */
  getCountdownTimeSecs(): number {
    const expirationDate: Date = this._auth.getExpirationDateFromToken();
    const leftSecs: number = Math.ceil((expirationDate.getTime() - new Date().getTime())/1000);
    return leftSecs;
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
   * Handles the countdown notifications
   */
  handleCountdown(event: CountdownEvent): void {
    if (event.action === 'notify') {
      const current: number = event.left / 1000;
      
      if (current === this.notifications[0]) {
        this.bootstrapClass = EBootstrapColor.SUCCESS;
      } else if (current === this.notifications[1]) {
        this.bootstrapClass = EBootstrapColor.WARNING;
      } else if (current === this.notifications[2]) {
        this.bootstrapClass = EBootstrapColor.DANGER;
        this.tooltipText = this.settings.tooltipFinishText;
        if (!this.isDialogOpened) {
          this.displayDialog()
        }
      } else {
        console.log('Page - Session ended.') //TODO: remove after tests
      }
    } else if (event.action == 'restart') {
      console.log('Counter restarted')
    }
  }

  /**
   * Displays countdown time till the end of current session in modal dialog
  */
  displayDialog(): void {
    this.isDialogOpened = true;
    const countdownSpinnerTimerData: CountdownSpinnerTimerData = new CountdownSpinnerTimerData(
      this.getCountdownTimeSecs(),
      this.settings.timeMins * 60,
      this.settings.timeFormat,
      this.notifications,
      this.settings.spinnerDiameter,
      this.settings.spinnerStrokeWidth,
      this.settings.titleText,
      this.settings.titleTextFinish
    );

    const dialogRef: MatDialogRef<CountdownSpinnerTimerDialog, any> = this._countdownTimerDialog.open(CountdownSpinnerTimerDialog, {
      data: countdownSpinnerTimerData,
      panelClass: 'countdown-timer-dialog'
    });

    dialogRef.componentInstance.onSessionRenewal.subscribe((result: any) => {
      console.log('Page - Session renewed.'); //TODO: remove after tests
      /* setting countdown timer & button appearance */
      this.setCountdownTimer(this.getCountdownTimeSecs());
      this.bootstrapClass = EBootstrapColor.PRIMARY;
      this.tooltipText = this.settings.tooltipText;
    });

    dialogRef.afterClosed().subscribe(() => {
      this.isDialogOpened = false;
    });
  }
}
