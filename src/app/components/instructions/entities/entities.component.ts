import { Component, OnInit } from '@angular/core';
import { EEntity } from 'src/app/models/instructions/e-entity';
import { JsonLoadingService } from 'src/app/services/utils/json-loading.service';

@Component({
  selector: 'app-entities',
  templateUrl: './entities.component.html',
  styleUrls: ['./entities.component.scss']
})
export class EntitiesComponent implements OnInit {
  selectedEntity: string = EEntity.PERSON
  availableEntities: any[] = [
    {name: "Person", value: EEntity.PERSON},
    {name: "Person Phone", value: EEntity.PERSON_PHONE},
    {name: "Phone Number Type", value: EEntity.PHONE_NUMBER_TYPE},
    {name: "Sales Territory", value: EEntity.SALES_TERRITORY},
    {name: "State Province", value: EEntity.STATE_PROVINCE}
  ]
  searchText: string
  searchedEntities: any[]

  entityName: string
  entityDescription: string
  tableData: any[]
  displayedCols: string[] = ["name", "type", "description"]

  constructor(private _entityDesc: JsonLoadingService) {}

  ngOnInit(): void {
    this.searchText = "";
    this.searchedEntities = JSON.parse(JSON.stringify(this.availableEntities));
    
    this.loadEntityDescription(this.selectedEntity);
  }

  /**
   * Loads selected entity description from JSON file
  */
  loadEntityDescription(entity: string): void {
    this._entityDesc.loadEntityDescription(entity).subscribe({
      next: (result: any) => {
        this.entityName = result.name;
        this.entityDescription = result.description;
        this.tableData = result.fields;
      },
      error: (error: any) => {
        console.error(`Error while loading entity ${this.selectedEntity} description.`, error);
      }
    });
  }

  /**
   * Filters available entities by given phrase
  */
  searchEntities(): void {
    this.searchedEntities = this.availableEntities.filter((ae: any) => ae.name.toLowerCase().includes(this.searchText.toLowerCase()));
  }

  /**
   * Loads selected entity when changed
  */
  onEntitySelectionChange(entity: string): void {
    this.loadEntityDescription(entity);
  }
}
