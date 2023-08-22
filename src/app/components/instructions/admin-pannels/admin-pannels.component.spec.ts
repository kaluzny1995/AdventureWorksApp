import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPannelsComponent } from './admin-pannels.component';

describe('AdminPannelsComponent', () => {
  let component: AdminPannelsComponent;
  let fixture: ComponentFixture<AdminPannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminPannelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminPannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
