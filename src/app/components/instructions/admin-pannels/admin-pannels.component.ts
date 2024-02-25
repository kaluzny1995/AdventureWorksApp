import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDisplayData } from 'src/app/models/utils/image-display-data';
import { EAdminPannelStep } from 'src/app/models/instructions/e-admin-pannel-step';
import { ImageDisplayDialog } from '../../utils/image-display-dialog';
import { Instruction } from 'src/app/models/instructions/instruction';
import { JsonLoadingService } from 'src/app/services/utils/json-loading.service';

@Component({
  selector: 'app-admin-pannels',
  templateUrl: './admin-pannels.component.html',
  styleUrls: ['./admin-pannels.component.scss']
})
export class AdminPannelsComponent implements OnInit {
  selectedInstruction: EAdminPannelStep;
  instructions: Instruction[];

  constructor(
    private _json: JsonLoadingService,
    private _imageDisplayDialog: MatDialog
  ) {}

  ngOnInit(): void {
    /* Loading JSON with instructions */
    this._json.loadInstruction('admin_pannels').subscribe({
      next: (json: any) => {
        this.selectedInstruction = EAdminPannelStep[json.selectedInstruction.toUpperCase() as keyof typeof EAdminPannelStep];
        this.instructions = Instruction.fromJsonList(json.instructions, json.imagePathTemplate);
      },
      error: (error: any) => {
        console.error('Error while loading instructions.', error);
      }
    });
  }

  /**
   * Selects instruction to view
  */
  selectInstruction(instruction: EAdminPannelStep): void {
    this.selectedInstruction = instruction;
  }

  /**
   * Displays image in modal dialog
  */
  displayImage(title: string, src: string): void {
    const imageDisplayData: ImageDisplayData = new ImageDisplayData(title, src);
    this._imageDisplayDialog.open(ImageDisplayDialog, {
      data: imageDisplayData,
      panelClass: 'image-dialog'
    });
  }
}
