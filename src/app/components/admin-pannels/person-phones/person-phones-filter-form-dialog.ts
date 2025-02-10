import { CommonModule } from "@angular/common";
import { HttpErrorResponse } from "@angular/common/http";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { NgxMatSelectSearchModule } from "ngx-mat-select-search";
import { PersonPhoneFilterParams } from "src/app/models/admin-pannels/person-phones/person-phone-filter-params";
import { Person } from "src/app/models/admin-pannels/persons/person";
import { PhoneNumberType } from "src/app/models/admin-pannels/phone-number-types/phone-number-type";
import { MSListItem } from "src/app/models/utils/types";
import { DirectiveModule } from "src/app/modules/directive.module";
import { PersonService } from "src/app/services/admin-pannels/person.service";
import { PhoneNumberTypeService } from "src/app/services/admin-pannels/phone-number-type.service";
import { LocalStorageService } from "src/app/services/local-storage/local-storage.service";

@Component({
  selector: 'person-phones-filter-form-dialog',
  templateUrl: './person-phones-filter-form-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    DirectiveModule
  ],
})
export class PersonPhonesFilterFormDialog implements OnInit {
  form: FormGroup;
  personIds: FormControl;
  personPhrase: FormControl;
  phoneNumberTypeIds: FormControl;

  persons: MSListItem[];
  phoneNumberTypes: MSListItem[];

  constructor(
    private _person: PersonService,
    private _phoneNumberType: PhoneNumberTypeService,
    private _local: LocalStorageService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<PersonPhonesFilterFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PersonPhoneFilterParams
  ) { }

  ngOnInit(): void {
    this.personIds = new FormControl(null);
    this.personPhrase = new FormControl(null);
    this.phoneNumberTypeIds = new FormControl(null);
    this.form = this._fb.group({
        personIds: this.personIds,
        personPhrase: this.personPhrase,
        phoneNumberTypeIds: this.phoneNumberTypeIds
    });

    /* Getting person phrase from localstorage (if is there) */
    const pPhr: string | null = this._local.getItem('personPhrase', 'person-phone');

    /* Setting up the person search phrase */
    this.form.patchValue({
      personPhrase: pPhr
    });

    /* Loading all persons satisfying given person phrase (or first 10 if phrase not provided) */
    if (pPhr !== null) {
      this._loadSearchedPersons(pPhr);
    } else {
      this._loadFirst10Persons();
    }

    /* Loading all phone number types */
    this._phoneNumberType.allPhoneNumberTypes().subscribe({
        next: (results: any[]) => {
          this.phoneNumberTypes = results.map((result: any) => PhoneNumberType.fromAPIStructure(result).toMSListItem());
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while loading phone number type list items.', error);
        }
    });

    /* Settng up the selected persons and phone number types */
    this.form.patchValue({
      personIds: this.data.personIds,
      phoneNumberTypeIds: this.data.phoneNumberTypeIds
    });

    /* Search persons if search field changes (persons searching only for min 3-chars-long phrases) */
    this.personPhrase.valueChanges.subscribe(() => {
      if (this.personPhrase.value !== null && this.personPhrase.value.trim().length > 2) {
        this._loadSearchedPersons(this.personPhrase.value);
      } else {
        this._loadFirst10Persons();
      }
    });
  }

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

  cancel(): void {
    this._dialogRef.close();
  }

  clear(): void {
    this._local.removeItem('personPhrase', 'person-phone');
    this.form.reset();
  }

  filter(): void {
    /* Set or remove if empty person searching phrase */
    if (this.personPhrase.value !== null && this.personPhrase.value.trim().length > 2) {
      this._local.setItem('personPhrase', this.personPhrase.value, 'person-phone');
    } else {
      this._local.removeItem('personPhrase', 'person-phone');
    }

    this._dialogRef.close(
      new PersonPhoneFilterParams(
        this.personIds.value,
        this.phoneNumberTypeIds.value
      )
    );
  }


  /* For testing purposes only */
  TEST_PERSONS: MSListItem[] = [
    {id: 20789, itemName: 'Awaria Dzhejkob JR Jr (MRR) [20789]'},
    {id: 20785, itemName: 'Awaria Dzhejkob [20785]'},
    {id: 309, itemName: 'Adina Ronald L. (Mr.) [309]'},
    {id: 305, itemName: 'Adams Carla J. (Ms.) [305]'},
    {id: 303, itemName: 'Smith Margaret J. (Ms.) [303]'},
    {id: 301, itemName: 'Adams Frances B. (Ms.) [301]'},
    {id: 297, itemName: 'Acevedo Humberto (Sr.) [297]'},
    {id: 299, itemName: 'Ackerman Pilar (Sra.) [299]'}
  ];
  TEST_PHONE_NUMBER_TYPES: MSListItem[] = [
    {id: 1, itemName: 'Cell'},
    {id: 2, itemName: 'Home'},
    {id: 3, itemName: 'Work'},
    {id: 4, itemName: 'Emergency'},
    {id: 5, itemName: 'Home office'},
    {id: 6, itemName: 'Home office em.'}
  ];
}