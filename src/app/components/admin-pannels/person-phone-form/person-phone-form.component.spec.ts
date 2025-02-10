import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPhoneFormComponent } from './person-phone-form.component';

describe('PersonPhoneFormComponent', () => {
  let component: PersonPhoneFormComponent;
  let fixture: ComponentFixture<PersonPhoneFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonPhoneFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonPhoneFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
