import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { PersonDefaults } from "src/app/models/admin-pannels/persons/person-defaults";
import { EXmlField } from "src/app/models/utils/e-xml-field";
import { XmlEditorData } from "src/app/models/utils/xml-editor-data";
import { PipeModule } from "src/app/modules/pipe.module";
import { FormValidationService } from "src/app/services/utils/form-validation.service";
import { PersonService } from "src/app/services/admin-pannels/person.service";

@Component({
  selector: 'xml-editor-dialog',
  templateUrl: './xml-editor-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatGridListModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    PipeModule
  ],
})
export class XMLEditorDialog implements OnInit {
  form: FormGroup;
  xml: FormControl;

  EXMLField = EXmlField;

  personDefaults: PersonDefaults;

  constructor(
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<XMLEditorDialog>,
    private _fv: FormValidationService,
    private _person: PersonService,
    @Inject(MAT_DIALOG_DATA) public data: XmlEditorData
  ) { }

  ngOnInit(): void {
    this.xml = new FormControl(null, [this._fv.XMLValidator()]);
    this.form = this._fb.group({
      xml: this.xml
    });

    this.form.patchValue({
        xml: this.data.xml
    });

    this.personDefaults = this._person.defaults();
  }

  loadTemplate(): void {
    this.form.patchValue({
        xml: this.data.field === EXmlField.PERSON_ACI? this.personDefaults.aciTemplate : this.personDefaults.demoTemplate
    });
  }

  clear(): void {
    this.form.reset();
  }

  submit(): void {
    this._dialogRef.close(this.form.value);
  }
}