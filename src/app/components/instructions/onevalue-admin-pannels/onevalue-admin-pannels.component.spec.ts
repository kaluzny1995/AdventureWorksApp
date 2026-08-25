import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { OnevalueAdminPannelsComponent } from './onevalue-admin-pannels.component';

describe('OnevalueAdminPannelsComponent', () => {
  let component: OnevalueAdminPannelsComponent;
  let fixture: ComponentFixture<OnevalueAdminPannelsComponent>;
  let httpMock: HttpTestingController;

  const mock1vData = {
    imagePathTemplate: '/assets/images/1v_admin_pannels/${}.png',
    selectedInstruction: 'view',
    instructions: [
      {
        name: 'View', value: 'view', btnIcon: 'view_list',
        images: [{title: 'Data view', src: 'view', label: null, isHalf: false}],
        steps: [{name: 'Overview', title: '1v admin pannel overview.', description: 'Overview.'}]
      },
      {
        name: 'Ordering', value: 'order', btnIcon: 'sort_by_alpha',
        images: [{title: 'Ordering', src: 'order', label: null, isHalf: false}],
        steps: [{name: 'Headers', title: 'Clickable headers.', description: 'Headers.'}]
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [OnevalueAdminPannelsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(OnevalueAdminPannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne('/assets/data/instructions/1v_admin_pannels.json');
    req.flush(mock1vData);
    expect(component).toBeTruthy();
  });

  it('should load instructions from /assets/data/instructions/1v_admin_pannels.json', () => {
    const req = httpMock.expectOne('/assets/data/instructions/1v_admin_pannels.json');
    expect(req.request.method).toBe('GET');
    req.flush(mock1vData);
  });

  it('should parse instructions and resolve image paths', () => {
    const req = httpMock.expectOne('/assets/data/instructions/1v_admin_pannels.json');
    req.flush(mock1vData);

    expect(component.instructions.length).toBe(2);
    expect(component.instructions[0].images[0].src).toBe('/assets/images/1v_admin_pannels/view.png');
    expect(component.instructions[1].images[0].src).toBe('/assets/images/1v_admin_pannels/order.png');
  });

  it('should set selectedInstruction', () => {
    const req = httpMock.expectOne('/assets/data/instructions/1v_admin_pannels.json');
    req.flush(mock1vData);
    expect(component.selectedInstruction).toBeDefined();
  });
});
