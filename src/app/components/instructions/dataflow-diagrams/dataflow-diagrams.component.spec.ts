import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataflowDiagramsComponent } from './dataflow-diagrams.component';

describe('DataflowDiagramsComponent', () => {
  let component: DataflowDiagramsComponent;
  let fixture: ComponentFixture<DataflowDiagramsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataflowDiagramsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataflowDiagramsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
