import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonPhonesComponent } from './person-phones.component';

describe('PersonPhonesComponent', () => {
  let component: PersonPhonesComponent;
  let fixture: ComponentFixture<PersonPhonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonPhonesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonPhonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
