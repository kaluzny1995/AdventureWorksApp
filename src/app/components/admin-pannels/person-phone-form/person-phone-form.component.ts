import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EFormMode } from 'src/app/models/admin-pannels/common/e-form-mode';
import { PersonPhone, PersonPhoneInput } from 'src/app/models/admin-pannels/person-phones/person-phone';
import { PersonPhoneDefaults } from 'src/app/models/admin-pannels/person-phones/person-phone-defaults';
import { Person } from 'src/app/models/admin-pannels/persons/person';
import { PhoneNumberType } from 'src/app/models/admin-pannels/phone-number-types/phone-number-type';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { EAlertType } from 'src/app/models/utils/e-alert-type';
import { MSListItem } from 'src/app/models/utils/types';
import { PersonPhoneService } from 'src/app/services/admin-pannels/person-phone.service';
import { PersonService } from 'src/app/services/admin-pannels/person.service';
import { PhoneNumberTypeService } from 'src/app/services/admin-pannels/phone-number-type.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';
import { UrlProcessingService } from 'src/app/services/url/url-processing.service';
import { ViewParamsService } from 'src/app/services/url/view-params.service';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { AppConfigService } from 'src/app/services/utils/app-config.service';
import { UtilsService } from 'src/app/services/utils/utils.service';

const LS_PREFIX = 'person-phone';

@Component({
  selector: 'app-person-phone-form',
  templateUrl: './person-phone-form.component.html',
  styleUrls: ['./person-phone-form.component.scss']
})
export class PersonPhoneFormComponent implements OnInit {
  isLoaderUp: boolean;
  mainAlert: AlertMessage | null = null;

  viewId: string | null;
  EFormMode = EFormMode;
  personsFullName: string;
  formMode: EFormMode;
  returnUrl: string | null;

  personPhoneDefaults: PersonPhoneDefaults;

  form: FormGroup;
  personId: FormControl;
  personPhrase: FormControl;
  phoneNumber: FormControl;
  phoneNumberTypeId: FormControl;

  persons: MSListItem[];
  phoneNumberTypes: MSListItem[];

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _appConfig: AppConfigService,
    private _urlProc: UrlProcessingService,
    private _local: LocalStorageService,
    private _view: ViewParamsService,
    private _fb: FormBuilder,
    private _person: PersonService,
    private _phoneNumberType: PhoneNumberTypeService,
    private _personPhone: PersonPhoneService,
    private _utils: UtilsService,
    private _alert: AlertMessageService
  ) {}

  ngOnInit(): void {
    /* View parameters parsing */
    this._route.params.subscribe((params: Params) => {
      /* Positional parameters - view id */
      const pId: string = params['personId'];
      const pN: string = params['phoneNumber'];
      const pNTId: string = params['phoneNumberTypeId'];
      if (Number.isNaN(+pId) || String(pN) === null || Number.isNaN(+pNTId)) {
        this.viewId = null;
        this.formMode = EFormMode.ADD;
      } else {
        this.viewId = this._view.nsnTuple2Str([+pId, String(pN), +pNTId], this._appConfig.personPhoneDefaults.idSeparator);
        this.formMode = EFormMode.EDIT;
      }

      /* Optional parameter - returning URL address */
      this.returnUrl = this._urlProc.unbracket(decodeURIComponent(this._route.snapshot.paramMap.get('returnUrl') || ''));
    });

    /* Person defaults */
    this.personPhoneDefaults = this._personPhone.defaults();

    /* Form initialization */
    this.personId = new FormControl(null, [Validators.required]);
    this.personPhrase = new FormControl(null);
    this.phoneNumber = new FormControl(null, [Validators.required]);
    this.phoneNumberTypeId = new FormControl(null, [Validators.required]);
    this.form = this._fb.group({
      personId: this.personId,
      personPhrase: this.personPhrase,
      phoneNumber: this.phoneNumber,
      phoneNumberTypeId: this.phoneNumberTypeId
    });

    /* If EFormMode.EDIT -> Setting up the form values */
    if (this.formMode === EFormMode.EDIT) {
      const [personId, phoneNumber, phoneNumberTypeId] = this._view.str2NSNTuple(this.viewId, this._appConfig.personPhoneDefaults.idSeparator);

      /* Set up the person and phone number type select items */
      this._loadOnePerson(personId);
      this._loadPhoneNumberTypes();

      /* Load the form */
      this._personPhone.getPersonPhone(personId, phoneNumber, phoneNumberTypeId).subscribe({
        next: (result: any) => {
          const changedPersonPhone: PersonPhone = PersonPhone.fromAPIStructure(result[0], this._appConfig.personPhoneDefaults.idSeparator);
          this.form.patchValue(changedPersonPhone.toFormStructure());
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while getting newly added person phone.', error);
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      });
    } else {
      /* Set up the person and phone number type select items */
      this._loadFirst10Persons();
      this._loadPhoneNumberTypes();
    }

    /* Search persons if search field changes (persons searching only for min 3-chars-long phrases) */
    this.personPhrase.valueChanges.subscribe(() => {
      if (this.personPhrase.value !== null && this.personPhrase.value.trim().length > 2) {
        this._loadSearchedPersons(this.personPhrase.value);
      } else {
        this._loadFirst10Persons();
      }
    });
  }

  /* Loads items for person select list if search phrase is provided */
  private _loadSearchedPersons(phrase: string): void {
    this._person.searchByPhrases(phrase, phrase, true).subscribe({
      next: (results: any[]) => {
        this.persons = results.map((result: any) => Person.fromAPIStructure(result).toMSListItem());
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading person list items.', error);
      }
    });
  }

  /* Loads items for person select list if search phrase is not provided */
  private _loadFirst10Persons(): void {
    this._person.getFirst10Persons().subscribe({
      next: (results: any[]) => {
        this.persons = results.map((result: any) => Person.fromAPIStructure(result).toMSListItem());
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading person list items.', error);
      }
    });
  }

  /* Loads one person select item (if in edit mode) */
  private _loadOnePerson(personId: number): void {
    this._person.getPerson(personId).subscribe({
      next: (result: any) => {
        this.persons = [Person.fromAPIStructure(result).toMSListItem()];
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading one person list item.', error);
      }
    });
  }

  /* Loads items for phone number type select list */
  private _loadPhoneNumberTypes(): void {
    this._phoneNumberType.allPhoneNumberTypes().subscribe({
      next: (results: any[]) => {
        this.phoneNumberTypes = results.map((result: any) => PhoneNumberType.fromAPIStructure(result).toMSListItem());
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while loading phone number type list items.', error);
      }
    });
  }

  /**
   * Returns to persons admin pannel
  */
  return(): void {
    if (this.returnUrl !== null) {
      this._router.navigateByUrl(this.returnUrl);
    } else {
      this._router.navigate(['pannels', 'person-phones']);
    }
  }

  /**
   * Submits the form, registers new person phone or modifies the data of one
  */
  submit(): void {
    const personPhoneInput: PersonPhoneInput = PersonPhoneInput.fromFormStructure(this.form.value);

    this.isLoaderUp = true;
    if (this.formMode === EFormMode.ADD) {
      this._personPhone.createPersonPhone(personPhoneInput).subscribe({
        next: (result: any) => {
          console.log('Person phone registered successfully.', result);
          const newPersonPhone: PersonPhone = PersonPhone.fromAPIStructure(result[0], this._appConfig.personPhoneDefaults.idSeparator);
          this._local.setItem('newId', newPersonPhone.personPhoneIdString, LS_PREFIX);
          if (this.returnUrl !== null) {
            this._router.navigateByUrl(this.returnUrl);
          } else {
            this._router.navigate(['pannels', 'person-phones']);
          }
        },
        error: (error: HttpErrorResponse) => {
          switch (error.status) {
            case 400:
              const errorMessage: string = error.error.detail.title;
              if (errorMessage.includes('Primary key')) {
                const message: string = `Cannot register new person phone. Person phone of id '${this._utils.getIdFromPKViolationMessage(errorMessage)}' already exists.`;
                console.log(message);
                this.mainAlert = new AlertMessage(EAlertType.INFO, 'info', message);
              } else if (errorMessage.includes('Foreign key')) {
                if (errorMessage.includes('Person')) {
                  const message: string = `Cannot register new person phone. Provided person of id '${this._utils.getIdFromFKViolationString(errorMessage)}' does not exist.`;
                  console.log(message);
                  this.mainAlert = new AlertMessage(EAlertType.INFO, 'info', message);
                } else if (errorMessage.includes('PhoneNumberType')) {
                  const message: string = `Cannot register new person phone. Provided phone number type of id '${this._utils.getIdFromFKViolationString(errorMessage)}' does not exist.`;
                  console.log(message);
                  this.mainAlert = new AlertMessage(EAlertType.INFO, 'info', message);
                } else {
                  console.error('Error while creating new person phone.', error);
                  this.mainAlert = this._alert.statusAlertMesssage(error.status);
                }
              } else {
                console.error('Error while creating new person phone.', error);
                this.mainAlert = this._alert.statusAlertMesssage(error.status);
              }
              break;
            default:
              console.error('Error while creating new person phone.', error);
              this.mainAlert = this._alert.statusAlertMesssage(error.status);
              break;
          }
        }
      });
    } else {
      const [personId, phoneNumber, phoneNumberTypeId] = this._view.str2NSNTuple(this.viewId, this._appConfig.personPhoneDefaults.idSeparator);
      this._personPhone.updatePersonPhone(personId, phoneNumber, phoneNumberTypeId, personPhoneInput).subscribe({
        next: (result: any) => {
          console.log('Person phones data changed successfully.', result);
          const updatedPersonPhone: PersonPhone = PersonPhone.fromAPIStructure(result[0], this._appConfig.personPhoneDefaults.idSeparator);
          this._local.setItem('chId', updatedPersonPhone.personPhoneIdString, LS_PREFIX);
          if (this.returnUrl !== null) {
            this._router.navigateByUrl(this.returnUrl);
          } else {
            this._router.navigate(['pannels', 'person-phones']);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while updating person phone.', error);
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      });
    }
    this.isLoaderUp = false;
  }
}
