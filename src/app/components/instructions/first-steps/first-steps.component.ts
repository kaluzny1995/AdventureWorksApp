import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { EFirstStep } from 'src/app/models/instructions/e-first-step';
import { ImageDisplayDialog } from '../../utils/image-display-dialog';
import { ImageDisplayData } from 'src/app/models/utils/image-display-data';
import { JsonLoadingService } from 'src/app/services/utils/json-loading.service';
import { Instruction } from 'src/app/models/instructions/instruction';

@Component({
  selector: 'app-first-steps',
  templateUrl: './first-steps.component.html',
  styleUrls: ['./first-steps.component.scss']
})
export class FirstStepsComponent implements OnInit {
  selectedInstruction: EFirstStep;
  instructions: Instruction[];

  constructor(
    private _json: JsonLoadingService,
    private _imageDisplayDialog: MatDialog
  ) {}

  ngOnInit(): void {
    /* Loading JSON with instructions */
    this._json.loadInstruction('first_steps').subscribe({
      next: (json: any) => {
        this.selectedInstruction = EFirstStep[json.selectedInstruction.toUpperCase() as keyof typeof EFirstStep];
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
  selectInstruction(instruction: EFirstStep): void {
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
