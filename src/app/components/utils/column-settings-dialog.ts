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
import { ColumnDisplayingService } from "src/app/services/url/column-displaying.service";
import { ColumnSettingsData } from "src/app/models/utils/column-settings-data";

@Component({
  selector: 'column-settings-dialog',
  templateUrl: './column-settings-dialog.html',
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
export class ColumnSettingsDialog implements OnInit {
  form: FormGroup;
  availableColumnsControl: FormControl;

  entityName: string;
  selectedNames: string[];
  availableColumns: string[];
  columnNameMapping: {[key: string]: string};
  defaultIndices: number[];

  constructor(
    private _cols: ColumnDisplayingService,
    private _fb: FormBuilder,
    private _dialogRef: MatDialogRef<ColumnSettingsDialog>,
    @Inject(MAT_DIALOG_DATA) public data: ColumnSettingsData
  ) { }

  ngOnInit(): void {
    this.availableColumnsControl = new FormControl(null);
    this.form = this._fb.group({
      availableColumnsControl: this.availableColumnsControl
    });

    this.entityName = this.data.entityName;
    this.selectedNames = this.data.selectedNames;
    this.availableColumns = this.data.availableColumns;
    this.columnNameMapping = this.data.columnNameMapping;
    this.defaultIndices = this.data.defaultIndices;
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
    this.selectedNames = this._cols.displayedColumns(this.defaultIndices, this.availableColumns);
  }

  setUp(): void {
    this._dialogRef.close(this.selectedNames);
  }
}