import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { PersonFilterParams } from "src/app/models/admin-pannels/common/filter-params";
import { DirectiveModule } from "src/app/modules/directive.module";
import { PersonService } from "src/app/services/admin-pannels/person.service";

@Component({
  selector: 'persons-filter-form-dialog',
  templateUrl: './persons-filter-form-dialog.html',
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
    DirectiveModule
  ],
})
export class PersonsFilterFormDialog implements OnInit {
  form: FormGroup;
  personType: FormControl;
  lastNamePhrase: FormControl;
  firstNamePhrase: FormControl;

  personTypes: {[key: string]: string};

  constructor(
    private _person: PersonService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<PersonsFilterFormDialog>,
    @Inject(MAT_DIALOG_DATA) public data: PersonFilterParams
  ) { }

  ngOnInit(): void {
    this.personType = new FormControl(null);
    this.lastNamePhrase = new FormControl(null, [Validators.pattern('^[a-zA-Z \-\']+')]);
    this.firstNamePhrase = new FormControl(null, [Validators.pattern('^[a-zA-Z \-\']+')]);
    this.form = this._fb.group({
      personType: this.personType,
      lastNamePhrase: this.lastNamePhrase,
      firstNamePhrase: this.firstNamePhrase
    });

    this.personTypes = this._person.defaults().types;

    this.form.patchValue(this.data);
  }

  cancel(): void {
    this._dialogRef.close();
  }

  clear(): void {
    this.form.reset();
  }

  filter(): void {
    this._dialogRef.close(
      new PersonFilterParams(
        this.personType.value,
        this.lastNamePhrase.value,
        this.firstNamePhrase.value
      )
    );
  }
}