import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatChipsModule } from "@angular/material/chips";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectChange, MatSelectModule } from "@angular/material/select";
import { PersonService } from "src/app/services/person.service";
import { ColumnDisplayingService } from "src/app/services/url/column-displaying.service";
import { UtilsService } from "src/app/services/utils.service";

@Component({
  selector: 'persons-column-settings-dialog',
  templateUrl: './persons-column-settings-dialog.html',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    CdkDropList,
    CdkDrag
  ],
})
export class PersonsColumnSettingsDialog implements OnInit {
  form: FormGroup;
  availableColumnsControl: FormControl;

  selectedNames: string[];
  availableColumns: string[];
  columnNameMapping: {[key: string]: string};

  constructor(
    private _person: PersonService,
    private _cols: ColumnDisplayingService,
    private _fb: FormBuilder,
    private _utils: UtilsService,
    private _dialogRef: MatDialogRef<PersonsColumnSettingsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: string[]
  ) { }

  ngOnInit(): void {
    this.availableColumnsControl = new FormControl(null);
    this.form = this._fb.group({
      availableColumnsControl: this.availableColumnsControl
    });

    this.selectedNames = this.data;
    this.availableColumns = this._person.defaults().availableColumns;
    this.columnNameMapping = this._utils.dictFromArrays(this.availableColumns, this._person.defaults().availableColumnNames);
  }

  insert(event: MatSelectChange): void {
    this.selectedNames.push(event.value);
    this.form.patchValue({
      availableColumnsControl: null
    });
  }

  move(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.selectedNames, event.previousIndex, event.currentIndex);
  }

  remove(columnId: number): void {
    this.selectedNames.splice(columnId, 1);
  }

  cancel(): void {
    this._dialogRef.close();
  }

  restore(): void {
    this.selectedNames = this._cols.displayedColumns(this._person.defaults().displayedIndices, this.availableColumns);
  }

  setUp(): void {
    this._dialogRef.close(this.selectedNames);
  }
}