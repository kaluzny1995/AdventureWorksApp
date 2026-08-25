import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ImageDisplayDialog } from './image-display-dialog';
import { ImageDisplayData } from 'src/app/models/utils/image-display-data';

describe('ImageDisplayDialog', () => {
  let component: ImageDisplayDialog;
  let fixture: ComponentFixture<ImageDisplayDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ImageDisplayDialog>>;

  const mockData: ImageDisplayData = new ImageDisplayData('Test Image', 'http://example.com/img.png');

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ImageDisplayDialog, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: mockData },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ImageDisplayDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have data injected', () => {
    expect(component.data).toBe(mockData);
  });

  it('should close dialog on close()', () => {
    component.close();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });
});
