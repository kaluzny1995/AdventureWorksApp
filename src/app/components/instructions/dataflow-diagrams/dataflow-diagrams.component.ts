import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ImageDisplayData } from 'src/app/models/utils/image-display-data';
import { Instruction } from 'src/app/models/instructions/instruction';
import { JsonLoadingService } from 'src/app/services/utils/json-loading.service';
import { ImageDisplayDialog } from '../../utils/image-display-dialog';
import { EDataflowDiagram } from 'src/app/models/instructions/e-dataflow-diagram';

@Component({
  selector: 'app-dataflow-diagrams',
  templateUrl: './dataflow-diagrams.component.html',
  styleUrls: ['./dataflow-diagrams.component.scss']
})
export class DataflowDiagramsComponent implements OnInit {
  selectedInstruction: EDataflowDiagram;
  instructions: Instruction[];

  constructor(
    private _json: JsonLoadingService,
    private _imageDisplayDialog: MatDialog
  ) {}

  ngOnInit(): void {
    /* Loading JSON with instructions */
    this._json.loadInstruction('dataflow_diagrams').subscribe({
      next: (json: any) => {
        this.selectedInstruction = EDataflowDiagram[json.selectedInstruction.toUpperCase() as keyof typeof EDataflowDiagram];
        this.instructions = Instruction.fromJsonList(json.instructions, json.imagePathTemplate);
      },
      error: (error: any) => {
        console.error('Error while loading instructions.', error);
      }
    });
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
