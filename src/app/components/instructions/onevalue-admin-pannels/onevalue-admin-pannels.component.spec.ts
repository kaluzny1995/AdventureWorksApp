import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnevalueAdminPannelsComponent } from './onevalue-admin-pannels.component';

describe('OnevalueAdminPannelsComponent', () => {
  let component: OnevalueAdminPannelsComponent;
  let fixture: ComponentFixture<OnevalueAdminPannelsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OnevalueAdminPannelsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OnevalueAdminPannelsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
