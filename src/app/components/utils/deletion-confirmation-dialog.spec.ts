import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DeletionConfirmationDialog } from './deletion-confirmation-dialog';
import { DeletionConfirmationData } from 'src/app/models/utils/deletion-confirmation-data';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { EPasswordVerificationStatus } from 'src/app/models/utils/e-password-verification-status';
import { EDeletionConfirmation } from 'src/app/models/utils/e-deletion-confirmation';
import { of, throwError } from 'rxjs';

describe('DeletionConfirmationDialog', () => {
  let component: DeletionConfirmationDialog;
  let fixture: ComponentFixture<DeletionConfirmationDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<DeletionConfirmationDialog>>;
  let authServiceSpy: jasmine.SpyObj<AuthenticationService>;

  const mockData: DeletionConfirmationData = new DeletionConfirmationData('Delete?', 'Are you sure?', 'Error deleting');

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    authServiceSpy = jasmine.createSpyObj('AuthenticationService', ['verifyPassword']);

    await TestBed.configureTestingModule({
      imports: [DeletionConfirmationDialog, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: AuthenticationService, useValue: authServiceSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DeletionConfirmationDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data injected', () => {
    expect(component.data).toBe(mockData);
  });

  it('should initialize with showPassword false', () => {
    expect(component.showPassword).toBeFalse();
  });

  it('should initialize with confirmationPassword form control', () => {
    expect(component.form).toBeDefined();
    expect(component.confirmationPassword).toBeDefined();
  });

  it('should show password field', () => {
    component.showConfirmationPasswordField();
    expect(component.showPassword).toBeTrue();
  });

  it('should close dialog with CANCEL on cancel()', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(EDeletionConfirmation.CANCEL);
  });

  it('should close with OK when password is verified', () => {
    authServiceSpy.verifyPassword.and.returnValue(of({title: EPasswordVerificationStatus.VERIFIED}));
    component.confirmationPassword.setValue('correctpass');
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(EDeletionConfirmation.OK);
  });

  it('should set password error when password is unverified', () => {
    authServiceSpy.verifyPassword.and.returnValue(of({title: EPasswordVerificationStatus.UNVERIFIED}));
    component.confirmationPassword.setValue('wrongpass');
    component.confirm();
    expect(component.confirmationPassword.hasError('password')).toBeTrue();
  });

  it('should close with ERROR_0 on network error (status 0)', () => {
    authServiceSpy.verifyPassword.and.returnValue(throwError(() => ({status: 0})));
    component.confirmationPassword.setValue('pass');
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(EDeletionConfirmation.ERROR_0);
  });

  it('should close with ERROR_400 on bad request', () => {
    authServiceSpy.verifyPassword.and.returnValue(throwError(() => ({status: 400})));
    component.confirmationPassword.setValue('pass');
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(EDeletionConfirmation.ERROR_400);
  });

  it('should close with ERROR_401 on unauthorized', () => {
    authServiceSpy.verifyPassword.and.returnValue(throwError(() => ({status: 401})));
    component.confirmationPassword.setValue('pass');
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(EDeletionConfirmation.ERROR_401);
  });

  it('should close with ERROR_404 on not found', () => {
    authServiceSpy.verifyPassword.and.returnValue(throwError(() => ({status: 404})));
    component.confirmationPassword.setValue('pass');
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(EDeletionConfirmation.ERROR_404);
  });

  it('should close with ERROR_500 on unknown status', () => {
    authServiceSpy.verifyPassword.and.returnValue(throwError(() => ({status: 500})));
    component.confirmationPassword.setValue('pass');
    component.confirm();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(EDeletionConfirmation.ERROR_500);
  });

  it('should clear password error when it exists', () => {
    component.confirmationPassword.setErrors({password: true});
    component.clearError();
    expect(component.confirmationPassword.hasError('password')).toBeFalse();
  });

  it('should not throw when clearing non-existent password error', () => {
    expect(() => component.clearError()).not.toThrow();
  });
});
