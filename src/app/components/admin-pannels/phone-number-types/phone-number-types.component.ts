import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { FilterNameError, FilterValueError, OptionalParamError } from 'src/app/app.errors';
import { EOrderType } from 'src/app/models/admin-pannels/common/e-order-type';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { ViewParams } from 'src/app/models/admin-pannels/common/view-params';
import { NameFilterParam } from 'src/app/models/admin-pannels/phone-number-types/name-filter-param';
import { PhoneNumberType, PhoneNumberTypeInput } from 'src/app/models/admin-pannels/phone-number-types/phone-number-type';
import { PhoneNumberTypeDefaults } from 'src/app/models/admin-pannels/phone-number-types/phone-number-type-defaults';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { DeletionConfirmationData } from 'src/app/models/utils/deletion-confirmation-data';
import { EAlertType } from 'src/app/models/utils/e-alert-type';
import { PhoneNumberTypeService } from 'src/app/services/admin-pannels/phone-number-type.service';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { FilterParamsService } from 'src/app/services/url/filter-params.service';
import { QueryParamsService } from 'src/app/services/url/query-params.service';
import { ViewParamsService } from 'src/app/services/url/view-params.service';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { DeletionConfirmationDialog } from '../../utils/deletion-confirmation-dialog';
import { EDeletionConfirmation } from 'src/app/models/utils/e-deletion-confirmation';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { FormValidationService } from 'src/app/services/utils/form-validation.service';

const LS_PREFIX = 'phone-number-type';

@Component({
  selector: 'app-phone-number-types',
  templateUrl: './phone-number-types.component.html',
  styleUrls: ['./phone-number-types.component.scss']
})
export class PhoneNumberTypesComponent implements OnInit {
  isLoaderUp: boolean;
  mainAlert: AlertMessage | null = null;

  isReadonly: boolean;

  viewParams: ViewParams;

  phoneNumberTypeDefaults: PhoneNumberTypeDefaults;

  queryParams: QueryParams;
  filterNameMapping: {[key: string]: string};

  dataSource: PhoneNumberType[] = [];
  totalCount: number = 0;

  namePhraseForm: FormGroup;
  namePhrase: FormControl;

  nameForm: FormGroup;
  name: FormControl;
  private _unsetFlag = false;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _local: LocalStorageService,
    private _auth: AuthenticationService,
    private _view: ViewParamsService,
    private _queryParams: QueryParamsService,
    private _filterParams: FilterParamsService,
    private _phoneNumberType: PhoneNumberTypeService,
    private _alert: AlertMessageService,
    private _deletionDialog: MatDialog,
    private _fb: FormBuilder,
    private _formValid: FormValidationService,
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
    /* Reload on every backward click */
    this._router.events.pipe(
      filter((e): e is NavigationStart => e instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        window.location.reload();
        this.isLoaderUp = true;
      }
    });

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

    /* User readonly state checking */
    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this.isReadonly = Boolean(result.is_readonly);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while checking user readonly mode.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });

    /* View and object defaults */
    try {
      this.viewParams = this._view.fromLocalStorage(LS_PREFIX);
      this.phoneNumberTypeDefaults = this._phoneNumberType.defaults();
    } catch (error: unknown) {
      console.error(error);

      this._redirect500(`${error}`);
    }

    /* Object query parameters */
    try {
      this.queryParams = this._queryParams.defaults(); // needed if the method beneath would produce an error
      this.queryParams = this._queryParams.fromOptParamString(this._router.url, this.phoneNumberTypeDefaults.availableFilters);
      this.queryParams.perPage = this.phoneNumberTypeDefaults.perPage; // maximum number of results per page
    } catch (error: unknown) {
      console.error(error);
      
      if (error instanceof OptionalParamError) {
        this.mainAlert = AlertMessage.WRONG_OPT_PARAM_NAME;
      } else if (error instanceof FilterNameError) {
        this.mainAlert = AlertMessage.WRONG_FILTER_NAME;
      } else if (error instanceof FilterValueError) {
        this.mainAlert = AlertMessage.WRONG_FILTER_VALUE;
      } else {
        this._redirect500(`${error}`);
      }
    }

    /* Data loading */
    this.isLoaderUp = true;
    this._phoneNumberType.getPhoneNumberTypes(this.queryParams).subscribe({
      next: (results: any[]) => {
        this.dataSource = results.map((result: any) => PhoneNumberType.fromAPIStructure(result));
        this.isLoaderUp = false;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while getting phone number types.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
        this.isLoaderUp = false;
      }
    });
    this._phoneNumberType.countPhoneNumberTypes(this.queryParams.filters).subscribe({
      next: (result: any) => {
        this.totalCount = +result.count;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while getting phone number types count.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });

    /* Filtering form initialization */
    this.namePhrase = new FormControl(null);
    this.namePhraseForm = this._fb.group({
      namePhrase: this.namePhrase
    });
    if (this.queryParams.filters !== null) {
      const filterFormData: NameFilterParam = NameFilterParam.fromDict(this.queryParams.filters);
      this.namePhraseForm.patchValue({
        namePhrase: filterFormData.namePhrase
      });
    }

    /* New or edit phone number type form initialization */
    this.name = new FormControl(null, [Validators.required]);
    this.nameForm = this._fb.group({
      name: this.name
    });

    /* Clear selected item id after view loading */
    this.viewParams.selectedId = null;
  }

  /**
   * Sets up the local storage entries with proper view parameters
  */
  private _setLocalStorage(): void {
    this._view.toLocalStorage(this.viewParams, LS_PREFIX, true);
  }

  /**
   * Sets up the page URL with proper optional parameters
  */
  private _setURL(isReloaded: boolean = true): void {
    this._router.navigate(['pannels', 'phone-number-types', {
      ...this._queryParams.necessaryOptParams(this.queryParams)
    }]).then(() => {
      if (isReloaded) {
        window.location.reload();
        this.isLoaderUp = true;
      }
    });
  }

  /**
   * Redirects to 500 internal server error page
  */
  private _redirect500(message: string): void {
    console.error('Internal Error Occurred');
    this._router.navigate(['500', {message: message, url: this._router.url}]);
  }

  /**
   * Sets the selected phone number type
  */
  setSelected(phoneNumberType?: PhoneNumberType): void {
    /* Set up the name form value */
    if (!this._unsetFlag) { // prevent from setting id again after unsetting
      const selId: number = this._view.str2Num(this.viewParams.selectedId);
      if (phoneNumberType === undefined) {
        if (selId !== this.phoneNumberTypeDefaults.newId) { // add phone number type mode
          this.nameForm.patchValue({
            name: ''
          });
        }
        this.viewParams.selectedId = this._view.num2Str(this.phoneNumberTypeDefaults.newId);
      } else {
        if (phoneNumberType.phoneNumberTypeId !== selId) { // edit phone number type mode
          this.nameForm.patchValue({
            name: phoneNumberType.name
          });
        }
        this.viewParams.selectedId = this._view.num2Str(phoneNumberType.phoneNumberTypeId);
      }
      this._setLocalStorage();
    } else {
      this._unsetFlag = false;
    }
  }

  /**
   * Unsets the selected phone number type
  */
  unsetSelected(isCancel: boolean): void {
    if (isCancel) {
      this._unsetFlag = true;
    }
    this.viewParams.selectedId = null;
    this._setLocalStorage();
  }

  /**
   * Filters the phone number types by its names
  */
  filter(): void {
    const nameFilterParam: NameFilterParam = new NameFilterParam(this.namePhrase.value);
    this.queryParams.filters = this._filterParams.minimized(nameFilterParam.toDict());
    this._setURL();
  }

  /**
   * Clears the phone number type name phrase filter
  */
  clearFilter(): void {
    this.namePhraseForm.patchValue({
      namePhrase: ''
    });
    this.filter();
  }

  /**
   * Orders data by the clicked table header and ordering type
  */
  order(order: Sort): void {
    if (order.direction === '') {
      this.queryParams.orderBy = null;
      this.queryParams.type = EOrderType.ASC;
    } else {
      this.queryParams.orderBy = order.active;
      this.queryParams.type = EOrderType[order.direction.toUpperCase() as keyof typeof EOrderType];
    }
    this._setURL();
  }

  /**
   * Adds or changes phone number type name
  */
  addOrEditPhoneNumberType(phoneNumberTypeId: number): void {
    this._formValid.validateFormGroup(this.nameForm);

    if (this.nameForm.valid) {
      const phoneNumberTypeInput: PhoneNumberTypeInput = PhoneNumberTypeInput.fromFormStructure(this.nameForm.value);
      this.isLoaderUp = true;

      if (phoneNumberTypeId === this.phoneNumberTypeDefaults.newId) { // add phone number type
        this._phoneNumberType.createPhoneNumberType(phoneNumberTypeInput).subscribe({
          next: (result: any) => {
            console.log('Phone number type registered successfully.', result);
            const newPhoneNumerType: PhoneNumberType = PhoneNumberType.fromAPIStructure(result);
            this._local.setItem('newId', this._view.num2Str(newPhoneNumerType.phoneNumberTypeId), LS_PREFIX);
            this.viewParams.newId = this._view.num2Str(newPhoneNumerType.phoneNumberTypeId);
            this.dataSource = this._utils.prepend(newPhoneNumerType, this.dataSource);
            this.totalCount += 1;

            this.mainAlert = new AlertMessage(EAlertType.SUCCESS, '', `New phone number type with id: '${this.viewParams.newId}' registered successfully.`);
            this.isLoaderUp = false;
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error while creating new phone number type.', error);
            this.mainAlert = this._alert.statusAlertMesssage(error.status);

            this.isLoaderUp = false;
          }
        });
      } else { // edit phone number type
        this._phoneNumberType.updatePhoneNumberType(phoneNumberTypeId, phoneNumberTypeInput).subscribe({
          next: (result: any) => {
            console.log('Phone number types data changed successfully.', result);
            const updatedPhoneNumberType: PhoneNumberType = PhoneNumberType.fromAPIStructure(result);
            this._local.setItem('chId', this._view.num2Str(updatedPhoneNumberType.phoneNumberTypeId), LS_PREFIX);
            this.viewParams.changedId = this._view.num2Str(updatedPhoneNumberType.phoneNumberTypeId);
            this.dataSource = this.dataSource.map(pnt => {
              return pnt.phoneNumberTypeId === updatedPhoneNumberType.phoneNumberTypeId ? updatedPhoneNumberType : pnt;
            });

            this.mainAlert = new AlertMessage(EAlertType.SUCCESS, '', `Phone number types data with id: '${this.viewParams.changedId}' changed successfully.`);
            this.isLoaderUp = false;
          },
          error: (error: HttpErrorResponse) => {
            console.error('Error while updating phone number type.', error);
            this.mainAlert = this._alert.statusAlertMesssage(error.status);

            this.isLoaderUp = false;
          }
        });
      }
      this.viewParams.selectedId = null;
    }
  }

  /**
   * Deletes phone number type
  */
  deletePhoneNumberType(phoneNumberType: PhoneNumberType): void {
    const deletionConfirmationData: DeletionConfirmationData = new DeletionConfirmationData(
      'Phone number type dropping',
      `Are you sure, you wanna drop phone number type with id '${phoneNumberType.phoneNumberTypeId}' named '${phoneNumberType.name}'?`,
      'Cannot drop phone number type.'
    );

    const dialogRef = this._deletionDialog.open(DeletionConfirmationDialog, {
      data: deletionConfirmationData,
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result: EDeletionConfirmation) => {
      switch (result) {
        case EDeletionConfirmation.OK:
          /* Deleting phone number type via API */
          this._phoneNumberType.deletePhoneNumberType(phoneNumberType.phoneNumberTypeId).subscribe({
            next: (result: any) => {
              console.log('Phone number type dropped successfully.', result);
              this.mainAlert = new AlertMessage(EAlertType.SUCCESS, '', `Phone number type with id: '${phoneNumberType.phoneNumberTypeId}' dropped successfully.`);

              /* Removing phone number type from view table */
              this.dataSource = this.dataSource.filter((pnt: PhoneNumberType) => pnt.phoneNumberTypeId !== phoneNumberType.phoneNumberTypeId);
              this.totalCount -= 1;
              this._setLocalStorage();
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error while deleting phone number type.', error);
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

/* For view testing purposes only */
const TEST_DATA: PhoneNumberType[] = [
  new PhoneNumberType(0, 'Home', new Date('2007-11-04 00:00:00.000')),
  new PhoneNumberType(1, 'Flat', new Date('2002-05-24 00:00:00.000')),
  new PhoneNumberType(2, 'Office', new Date('2003-03-01 00:00:00.000')),
  new PhoneNumberType(3, 'Office - emergency', new Date('2005-07-01 00:00:00.000')),
  new PhoneNumberType(4, 'Mobile', new Date('2007-12-20 00:00:00.000')),
  new PhoneNumberType(5, 'Mobile - service', new Date('2010-07-01 00:00:00.000')),
  new PhoneNumberType(6, 'Mobile - emergency', new Date('2009-01-01 00:00:00.000')),
  new PhoneNumberType(7, 'Travel - car, bluetooth', new Date('2021-03-01 00:00:00.000')),
  new PhoneNumberType(8, 'Emergency 2', new Date('2020-03-04 00:00:00.000')),
  new PhoneNumberType(9, 'Emergency 3', new Date('2020-10-04 00:00:00.000')),
];
