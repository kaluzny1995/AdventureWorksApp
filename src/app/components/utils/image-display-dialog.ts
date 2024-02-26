import { CommonModule } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { MatButtonModule } from "@angular/material/button";
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { ImageDisplayData } from "src/app/models/utils/image-display-data";

@Component({
    selector: 'image-display-dialog',
    templateUrl: 'image-display-dialog.html',
    standalone: true,
    imports: [
      CommonModule,
      MatDialogModule, MatButtonModule
    ],
  })
  export class ImageDisplayDialog implements OnInit {
    constructor(
      private _dialogRef: MatDialogRef<ImageDisplayDialog>,
      @Inject(MAT_DIALOG_DATA) public data: ImageDisplayData
    ) {}
  
    ngOnInit(): void {
    }

    close(): void {
      this._dialogRef.close();
    }
}
