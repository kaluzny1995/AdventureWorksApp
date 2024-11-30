import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhoneNumberTypesComponent } from './phone-number-types.component';

describe('PhoneNumberTypesComponent', () => {
  let component: PhoneNumberTypesComponent;
  let fixture: ComponentFixture<PhoneNumberTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhoneNumberTypesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PhoneNumberTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
