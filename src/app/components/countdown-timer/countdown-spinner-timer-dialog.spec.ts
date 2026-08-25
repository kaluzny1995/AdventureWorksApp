import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { CountdownSpinnerTimerDialog } from './countdown-spinner-timer-dialog';
import { CountdownSpinnerTimerData } from 'src/app/models/utils/countdown-spinner-timer-data';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { EBootstrapColor } from 'src/app/models/utils/e-bootstrap-color';

describe('CountdownSpinnerTimerDialog', () => {
  let component: CountdownSpinnerTimerDialog;
  let fixture: ComponentFixture<CountdownSpinnerTimerDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<CountdownSpinnerTimerDialog>>;

  const mockData = new CountdownSpinnerTimerData(
    60, 120, 'ss', [90, 30, 10], 100, 8, 'Session expires', 'Session expired'
  );

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [CountdownSpinnerTimerDialog, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: AuthenticationService, useValue: jasmine.createSpyObj('AuthenticationService', [
          'verifyPassword', 'authenticate', 'setToken', 'getUsernameFromToken', 'getExpirationDateFromToken'
        ])}
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(CountdownSpinnerTimerDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('setBootstrapClass', () => {
    it('should return PRIMARY when time > first notification', () => {
      expect(component.setBootstrapClass(100, [90, 30, 10])).toBe(EBootstrapColor.PRIMARY);
    });

    it('should return SUCCESS when time > second notification', () => {
      expect(component.setBootstrapClass(50, [90, 30, 10])).toBe(EBootstrapColor.SUCCESS);
    });

    it('should return WARNING when time > third notification', () => {
      expect(component.setBootstrapClass(20, [90, 30, 10])).toBe(EBootstrapColor.WARNING);
    });

    it('should return DANGER when time <= third notification', () => {
      expect(component.setBootstrapClass(5, [90, 30, 10])).toBe(EBootstrapColor.DANGER);
    });
  });

  describe('getCountdownTimeSecs', () => {
    it('should return data.currentTimeSecs when not from token', () => {
      expect(component.getCountdownTimeSecs()).toBe(60);
    });
  });

  it('should close dialog on cancel()', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should have EBootstrapColor enum exposed', () => {
    expect(component.EBootstrapColor).toBe(EBootstrapColor);
  });

  it('should initialize form', () => {
    expect(component.form).toBeDefined();
    expect(component.confirmationPassword).toBeDefined();
  });

  it('should handle countdown event', () => {
    component.data = new CountdownSpinnerTimerData(
      60, 120, 'ss', [90, 30, 10], 100, 8, 'Session expires', 'Session expired'
    );
    component.handleCountdown({action: 'notify', left: 90000, leftInMillis: 90000} as any);
    expect(component.bootstrapClass).toBe(EBootstrapColor.SUCCESS);
  });

  it('should handle danger countdown event', () => {
    component.handleCountdown({action: 'notify', left: 10000, leftInMillis: 10000} as any);
    expect(component.bootstrapClass).toBe(EBootstrapColor.DANGER);
    expect(component.title).toBe('Session expired');
  });

  it('should handle countdown completion', () => {
    component.handleCountdown({action: 'notify', left: 1000, leftInMillis: 1000} as any);
    expect(component.isSessionOver).toBeTrue();
  });

  it('should clear password error when it exists', () => {
    component.confirmationPassword.setErrors({password: true});
    component.clearError();
    expect(component.confirmationPassword.hasError('password')).toBeFalse();
  });
});
