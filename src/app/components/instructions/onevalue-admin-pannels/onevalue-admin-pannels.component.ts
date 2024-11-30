import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { E1VAdminPannelStep } from 'src/app/models/instructions/e-1v-admin-pannel-step';
import { Instruction } from 'src/app/models/instructions/instruction';
import { ImageDisplayData } from 'src/app/models/utils/image-display-data';
import { JsonLoadingService } from 'src/app/services/utils/json-loading.service';
import { ImageDisplayDialog } from '../../utils/image-display-dialog';

@Component({
  selector: 'app-onevalue-admin-pannels',
  templateUrl: './onevalue-admin-pannels.component.html',
  styleUrls: ['./onevalue-admin-pannels.component.scss']
})
export class OnevalueAdminPannelsComponent {
  selectedInstruction: E1VAdminPannelStep;
  instructions: Instruction[];

  constructor(
    private _json: JsonLoadingService,
    private _imageDisplayDialog: MatDialog
  ) {}

  ngOnInit(): void {
    /* Loading JSON with instructions */
    this._json.loadInstruction('1v_admin_pannels').subscribe({
      next: (json: any) => {
        this.selectedInstruction = E1VAdminPannelStep[json.selectedInstruction.toUpperCase() as keyof typeof E1VAdminPannelStep];
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
  selectInstruction(instruction: E1VAdminPannelStep): void {
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
