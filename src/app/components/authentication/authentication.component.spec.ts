import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationComponent } from './authentication.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AuthenticationComponent', () => {
  let component: AuthenticationComponent;
  let fixture: ComponentFixture<AuthenticationComponent>;

  let fakeActivatedRoute = {
    snapshot: { data: {} }
  } as ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AuthenticationComponent],
      providers: [{provide: ActivatedRoute, useValue: fakeActivatedRoute}],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthenticationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
