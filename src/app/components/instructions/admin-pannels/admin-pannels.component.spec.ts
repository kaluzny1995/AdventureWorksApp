import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AdminPannelsComponent } from './admin-pannels.component';

describe('AdminPannelsComponent', () => {
  let component: AdminPannelsComponent;
  let fixture: ComponentFixture<AdminPannelsComponent>;
  let httpMock: HttpTestingController;

  const mockAdminPannelsData = {
    imagePathTemplate: '/assets/images/admin_pannels/${}.png',
    selectedInstruction: 'view',
    instructions: [
      {
        name: 'View', value: 'view', btnIcon: 'view_list',
        images: [
          {title: 'Data view on start', src: 'view_start', label: 'Start up view', isHalf: true},
          {title: 'Data view with visible components', src: 'view_components', label: 'View with visible components', isHalf: true}
        ],
        steps: [{name: 'Overview', title: 'Admin pannel overview.', description: 'Overview.'}]
      },
      {
        name: 'Pagination', value: 'pagination', btnIcon: 'last_page',
        images: [{title: 'Data pagination', src: 'pagination', label: null, isHalf: false}],
        steps: [{name: 'Horizontal restrictions', title: 'Restrictions.', description: 'Restrictions.'}]
      }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MatDialogModule],
      declarations: [AdminPannelsComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    httpMock = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(AdminPannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    const req = httpMock.expectOne('/assets/data/instructions/admin_pannels.json');
    req.flush(mockAdminPannelsData);
    expect(component).toBeTruthy();
  });

  it('should load instructions from /assets/data/instructions/admin_pannels.json', () => {
    const req = httpMock.expectOne('/assets/data/instructions/admin_pannels.json');
    expect(req.request.method).toBe('GET');
    req.flush(mockAdminPannelsData);
  });

  it('should parse instructions and resolve image paths', () => {
    const req = httpMock.expectOne('/assets/data/instructions/admin_pannels.json');
    req.flush(mockAdminPannelsData);

    expect(component.instructions.length).toBe(2);
    expect(component.instructions[0].images[0].src).toBe('/assets/images/admin_pannels/view_start.png');
    expect(component.instructions[0].images[1].src).toBe('/assets/images/admin_pannels/view_components.png');
    expect(component.instructions[1].images[0].src).toBe('/assets/images/admin_pannels/pagination.png');
  });

  it('should set selectedInstruction', () => {
    const req = httpMock.expectOne('/assets/data/instructions/admin_pannels.json');
    req.flush(mockAdminPannelsData);
    expect(component.selectedInstruction).toBeDefined();
  });
});
