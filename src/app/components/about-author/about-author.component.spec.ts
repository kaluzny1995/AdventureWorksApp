import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AboutAuthorComponent } from './about-author.component';
import { AppConfigService } from 'src/app/services/utils/app-config.service';

describe('AboutAuthorComponent', () => {
  let component: AboutAuthorComponent;
  let fixture: ComponentFixture<AboutAuthorComponent>;

  const mockConfig = {
    author: {
      name: 'Test Author',
      position: 'Developer',
      email: { address: 'test@test.com' },
      urls: {
        projects: { MFD: 'https://test.com/mfd', HSD: 'https://test.com/hsd' },
        github: 'https://github.com/test',
        linkedin: 'https://linkedin.com/test',
        facebook: 'https://facebook.com/test'
      }
    },
    emailUrl: 'mailto:test@test.com?subject=Test&body=Test'
  };

  const mockAppConfigService = {
    get author() { return mockConfig.author; },
    get emailUrl() { return mockConfig.emailUrl; }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AboutAuthorComponent],
      providers: [
        { provide: AppConfigService, useValue: mockAppConfigService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutAuthorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
