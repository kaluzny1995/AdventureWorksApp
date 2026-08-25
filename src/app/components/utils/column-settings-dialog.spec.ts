import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ColumnSettingsDialog } from './column-settings-dialog';
import { ColumnSettingsData } from 'src/app/models/utils/column-settings-data';
import { ColumnDisplayingService } from 'src/app/services/url/column-displaying.service';

describe('ColumnSettingsDialog', () => {
  let component: ColumnSettingsDialog;
  let fixture: ComponentFixture<ColumnSettingsDialog>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<ColumnSettingsDialog>>;
  let colDisplayingSpy: jasmine.SpyObj<ColumnDisplayingService>;

  const mockData = new ColumnSettingsData(
    'Person',
    ['Name', 'Email'],
    ['Name', 'Email', 'Phone', 'Address'],
    {Name: 'Name', Email: 'Email', Phone: 'Phone', Address: 'Address'},
    [0, 1]
  );

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);
    colDisplayingSpy = jasmine.createSpyObj('ColumnDisplayingService', ['displayedColumns']);
    colDisplayingSpy.displayedColumns.and.returnValue(['Name', 'Email', 'Phone']);

    const freshData = new ColumnSettingsData(
      'Person',
      ['Name', 'Email'],
      ['Name', 'Email', 'Phone', 'Address'],
      {Name: 'Name', Email: 'Email', Phone: 'Phone', Address: 'Address'},
      [0, 1]
    );

    await TestBed.configureTestingModule({
      imports: [ColumnSettingsDialog, HttpClientTestingModule, NoopAnimationsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: freshData },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: ColumnDisplayingService, useValue: colDisplayingSpy }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ColumnSettingsDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize from data', () => {
    expect(component.entityName).toBe('Person');
    expect(component.selectedNames).toEqual(['Name', 'Email']);
    expect(component.availableColumns).toEqual(['Name', 'Email', 'Phone', 'Address']);
    expect(component.defaultIndices).toEqual([0, 1]);
  });

  it('should insert a column', () => {
    component.insert({value: 'Phone'} as any);
    expect(component.selectedNames).toContain('Phone');
  });

  it('should reset available columns control after insert', () => {
    component.insert({value: 'Phone'} as any);
    expect(component.form.get('availableColumnsControl')?.value).toBeNull();
  });

  it('should remove a column by index', () => {
    component.selectedNames = ['Name', 'Email', 'Phone'];
    component.remove(1);
    expect(component.selectedNames).toEqual(['Name', 'Phone']);
  });

  it('should move a column within the list', () => {
    component.selectedNames = ['Name', 'Email'];
    component.move({previousIndex: 0, currentIndex: 1} as any);
    expect(component.selectedNames).toEqual(['Email', 'Name']);
  });

  it('should close dialog on cancel()', () => {
    component.cancel();
    expect(dialogRefSpy.close).toHaveBeenCalled();
  });

  it('should restore defaults on restore()', () => {
    colDisplayingSpy.displayedColumns.and.returnValue(['Name', 'Email']);
    component.restore();
    expect(component.selectedNames).toEqual(['Name', 'Email']);
  });

  it('should close with selectedNames on setUp()', () => {
    component.setUp();
    expect(dialogRefSpy.close).toHaveBeenCalledWith(component.selectedNames);
  });
});
