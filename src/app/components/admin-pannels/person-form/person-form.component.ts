import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { EPersonType } from 'src/app/models/admin-pannels/persons/e-person-type';
import { Person, PersonInput } from 'src/app/models/admin-pannels/persons/person';
import { PersonDefaults } from 'src/app/models/admin-pannels/persons/person-defaults';
import { EFormMode } from 'src/app/models/admin-pannels/common/e-form-mode';
import { PersonService } from 'src/app/services/admin-pannels/person.service';
import { XMLEditorDialog } from '../../utils/xml-editor-dialog';
import { MatDialog } from '@angular/material/dialog';
import { EXmlField } from 'src/app/models/utils/e-xml-field';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { HttpErrorResponse } from '@angular/common/http';
import { XmlEditorData } from 'src/app/models/utils/xml-editor-data';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { UrlProcessingService } from 'src/app/services/url/url-processing.service';
import { LocalStorageService } from 'src/app/services/local-storage/local-storage.service';

const LS_PREFIX = 'person';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss']
})
export class PersonFormComponent implements OnInit {
  isLoaderUp: boolean;
  mainAlert: AlertMessage | null = null;

  viewId: number | null;
  EFormMode = EFormMode;
  personsFullName: string;
  formMode: EFormMode;
  returnUrl: string | null;

  personDefaults: PersonDefaults;

  form: FormGroup;
  personType: FormControl;
  nameStyle: FormControl;
  title: FormControl;
  firstName: FormControl;
  middleName: FormControl;
  lastName: FormControl;
  suffix: FormControl;
  emailPromotion: FormControl;
  EXMLField = EXmlField;
  additionalContactInfo: FormControl;
  demographics: FormControl;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _urlProc: UrlProcessingService,
    private _local: LocalStorageService,
    private _fb: FormBuilder,
    private _xmlEditorDialog: MatDialog,
    private _person: PersonService,
    private _alert: AlertMessageService
  ) {}

  ngOnInit(): void {
    /* View parameters parsing */
    this._route.params.subscribe((params: Params) => {
      /* Positional parameter - view id */
      const id: string = params['id'];
      if (Number.isNaN(+id)) {
        this.viewId = null;
        this.formMode = EFormMode.ADD;
      } else {
        this.viewId = +id;
        this.formMode = EFormMode.EDIT;
      }

      /* Optional parameter - returning URL address */
      this.returnUrl = this._urlProc.unbracket(decodeURIComponent(this._route.snapshot.paramMap.get('returnUrl') || ''));
    });

    /* Person defaults */
    this.personDefaults = this._person.defaults();

    /* Form initialization */
    this.personType = new FormControl(null, [Validators.required]);
    this.nameStyle = new FormControl('0', [Validators.required]);
    this.title = new FormControl(null);
    this.firstName = new FormControl(null, [Validators.required]);
    this.middleName = new FormControl(null);
    this.lastName = new FormControl(null, [Validators.required]);
    this.suffix = new FormControl(null);
    this.emailPromotion = new FormControl(0, [Validators.required, Validators.min(0), Validators.max(2)]);
    this.additionalContactInfo = new FormControl(null);
    this.demographics = new FormControl(null);
    this.form = this._fb.group({
      personType: this.personType,
      nameStyle: this.nameStyle,
      title: this.title,
      firstName: this.firstName,
      middleName: this.middleName,
      lastName: this.lastName,
      suffix: this.suffix,
      emailPromotion: this.emailPromotion,
      additionalContactInfo: this.additionalContactInfo,
      demographics: this.demographics
    });

    /* If EFormMode.EDIT -> Setting up the form values */
    if (this.formMode === EFormMode.EDIT) {
      this._person.getPerson(this.viewId || -1).subscribe({
        next: (result: any) => {
          const changedPerson: Person = Person.fromAPIStructure(result);
          this.personsFullName = `${changedPerson.lastName} ${changedPerson.firstName} ${!changedPerson.middleName? '' : changedPerson.middleName + ' '}`;
          this.form.setValue(changedPerson.toFormStructure());
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while getting newly added person.', error);
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      });
    }
  }

  /**
   * Returns to persons admin pannel
  */
  return(): void {
    if (this.returnUrl !== null) {
      this._router.navigateByUrl(this.returnUrl);
    } else {
      this._router.navigate(['pannels', 'persons']);
    }
  }

  /**
   * Opens XML field editor dialog
  */
  openXMLEditor(xmlField: EXmlField): void {
    const xmlFieldData: XmlEditorData = new XmlEditorData(
      xmlField,
      xmlField === EXmlField.PERSON_ACI? 'Additional contact info' : 'Demographics',
      xmlField === EXmlField.PERSON_ACI? this.additionalContactInfo.value : this.demographics.value
    );

    const dialogRef = this._xmlEditorDialog.open(XMLEditorDialog, {
      data: xmlFieldData,
      width: '800px',
      position: {top: '200px'}
    });

    dialogRef.afterClosed().subscribe((results?: any) => {
      if (results !== undefined) {
        if (xmlField === EXmlField.PERSON_ACI) {
          this.form.patchValue({
            additionalContactInfo: results.xml
          });
        } else {
          this.form.patchValue({
            demographics: results.xml
          });
        }
      }
    });
  }

  /**
   * Submits the form, registers new person or modifies the data of one
  */
  submit(): void {
    const personInput: PersonInput = PersonInput.fromFormStructure(this.form.value);

    this.isLoaderUp = true;
    if (this.formMode === EFormMode.ADD) {
      this._person.createPerson(personInput).subscribe({
        next: (result: any) => {
          console.log('Person registered successfully.', result);
          const newPerson: Person = Person.fromAPIStructure(result);
          this._local.setItem('newId', `${newPerson.personId}`, LS_PREFIX);
          if (this.returnUrl !== null) {
            this._router.navigateByUrl(this.returnUrl);
          } else {
            this._router.navigate(['pannels', 'persons']);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while creating new person.', error);
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      });
    } else {
      this._person.updatePerson(this.viewId || -1, personInput).subscribe({
        next: (result: any) => {
          console.log('Persons data changed successfully.', result);
          const updatedPerson: Person = Person.fromAPIStructure(result);
          this._local.setItem('chId', `${updatedPerson.personId}`, LS_PREFIX);
          if (this.returnUrl !== null) {
            this._router.navigateByUrl(this.returnUrl);
          } else {
            this._router.navigate(['pannels', 'persons']);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while updating person.', error);
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      });
    }
    this.isLoaderUp = false;
  }
}

/* For view testing purposes only */
const TEST_DATA: PersonInput = new PersonInput(
  EPersonType.GC, '0', 'Mr.', 'Roberto', null, 'Tamburello',
  'Sr.', 1,
  '<address><street>24th Avenue</street><city>NYC</city><postalcode>34256-311</postalcode></address>',
  '<demographics><gender>male</gender><age>29</age></demographics>'
);
