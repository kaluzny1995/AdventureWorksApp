import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { filter } from 'rxjs';
import { ColumnNotFoundError, FilterNameError, FilterValueError, OptionalParamError } from 'src/app/app.errors';
import { EPersonType } from 'src/app/models/admin-pannels/persons/e-person-type';
import { Person } from 'src/app/models/admin-pannels/persons/person';
import { PersonDefaults } from 'src/app/models/admin-pannels/persons/person-defaults';
import { AlertMessage } from 'src/app/models/utils/alert-message';
import { PersonFilterParams } from 'src/app/models/admin-pannels/common/filter-params';
import { QueryParams } from 'src/app/models/admin-pannels/common/query-params';
import { PersonService } from 'src/app/services/admin-pannels/person.service';
import { ColumnDisplayingService } from 'src/app/services/url/column-displaying.service';
import { FilterParamsService } from 'src/app/services/url/filter-params.service';
import { QueryParamsService } from 'src/app/services/url/query-params.service';
import { PersonsFilterFormDialog } from './persons-filter-form-dialog';
import { PersonsColumnSettingsDialog } from './persons-column-settings-dialog';
import { AuthenticationService } from 'src/app/services/awfapi-user/authentication.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UtilsService } from 'src/app/services/utils/utils.service';
import { Sort } from '@angular/material/sort';
import { EOrderType } from 'src/app/models/admin-pannels/common/e-order-type';
import { ViewParams } from 'src/app/models/admin-pannels/common/view-params';
import { ViewParamsService } from 'src/app/services/url/view-params.service';
import { EAlertType } from 'src/app/models/utils/e-alert-type';
import { DeletionConfirmationDialog } from '../../utils/deletion-confirmation-dialog';
import { EDeletionConfirmation } from 'src/app/models/utils/e-deletion-confirmation';
import { DeletionConfirmationData } from 'src/app/models/utils/deletion-confirmation-data';
import { AlertMessageService } from 'src/app/services/utils/alert-message.service';
import { UrlProcessingService } from 'src/app/services/url/url-processing.service';

const LS_PREFIX = 'person';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss']
})
export class PersonsComponent implements OnInit {
  isLoaderUp: boolean;
  mainAlert: AlertMessage | null = null;

  isReadonly: boolean;

  viewParams: ViewParams;

  personDefaults: PersonDefaults;
  displayedColumns: string[];
  columnNameMapping: {[key: string]: string};

  queryParams: QueryParams;
  filterNameMapping: {[key: string]: string};

  dataSource: Person[] = [];
  totalCount: number = 0;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _urlProc: UrlProcessingService,
    private _auth: AuthenticationService,
    private _view: ViewParamsService,
    private _cols: ColumnDisplayingService,
    private _columnDialog: MatDialog,
    private _queryParams: QueryParamsService,
    private _filterParams: FilterParamsService,
    private _filterDialog: MatDialog,
    private _person: PersonService,
    private _alert: AlertMessageService,
    private _deletionDialog: MatDialog,
    private _utils: UtilsService
  ) { }

  ngOnInit(): void {
    /* Reload on every backward click */
    this._router.events.pipe(
      filter((e): e is NavigationStart => e instanceof NavigationStart)
    ).subscribe((event: NavigationStart) => {
      if (event.navigationTrigger === 'popstate') {
        window.location.reload();
        this.isLoaderUp = true;
      }
    });

    /* Status alerts setting */
    if (this._route.snapshot.paramMap.has('status')) {
      const status = this._route.snapshot.paramMap.get('status');
      switch (status) {
        case 'signed_in': {
          this.mainAlert = AlertMessage.SIGNED_IN;
          break;
        }
        default: {
          this.mainAlert = AlertMessage.UNKNOWN_STATUS;
          break;
        }
      }
    }

    /* User readonly state checking */
    this._auth.getCurrentUser().subscribe({
      next: (result: any) => {
        this.isReadonly = Boolean(result.is_readonly);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while checking user readonly mode.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });

    /* View and object defaults */
    try {
      this.viewParams = this._view.fromLocalStorage(LS_PREFIX);
      this.personDefaults = this._person.defaults();

      this.displayedColumns = this._cols.displayedColumns(
        this._cols.fromLocalStorage(LS_PREFIX, this.personDefaults.displayedIndices),
        this.personDefaults.availableColumns);
      this.columnNameMapping = this._utils.dictFromArrays(
        this.personDefaults.availableColumns, this.personDefaults.availableColumnNames);
      this.filterNameMapping = this._utils.dictFromArrays(
        this.personDefaults.availableFilters, this.personDefaults.availableFilterNames);
    } catch (error: unknown) {
      console.error(error);

      if (error instanceof ColumnNotFoundError) {
        this.mainAlert = AlertMessage.COLUMN_NOT_FOUND;
      } else {
        this._redirect500(`${error}`);
      }
    }

    /* Object query parameters */
    try {
      this.queryParams = this._queryParams.defaults(); // needed if the method beneath would produce an error
      this.queryParams = this._queryParams.fromOptParamString(this._router.url, this.personDefaults.availableFilters);
    } catch (error: unknown) {
      console.error(error);
      
      if (error instanceof OptionalParamError) {
        this.mainAlert = AlertMessage.WRONG_OPT_PARAM_NAME;
      } else if (error instanceof FilterNameError) {
        this.mainAlert = AlertMessage.WRONG_FILTER_NAME;
      } else if (error instanceof FilterValueError) {
        this.mainAlert = AlertMessage.WRONG_FILTER_VALUE;
      } else {
        this._redirect500(`${error}`);
      }
    }

    /* Data loading */
    this.isLoaderUp = true;
    this._person.getPersons(this.queryParams).subscribe({
      next: (results: any[]) => {
        this.dataSource = results.map((result: any) => Person.fromAPIStructure(result));
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while getting persons.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });
    this._person.countPersons(this.queryParams.filters).subscribe({
      next: (result: any) => {
        this.totalCount = +result.count;
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error while getting persons count.', error);
        this.mainAlert = this._alert.statusAlertMesssage(error.status);
      }
    });
    this.isLoaderUp = false;

    /* Newly added person handling */
    if (this.viewParams.newId !== null) {
      this.mainAlert = new AlertMessage(EAlertType.SUCCESS, '', `New person with id: '${this.viewParams.newId}' registered successfully.`);

      this._person.getPerson(this.viewParams.newId).subscribe({
        next: (result: any) => {
          const newPerson: Person = Person.fromAPIStructure(result);
          const existingPersons = this.dataSource.filter((person: Person) => person.personId === this.viewParams.newId);
          if (existingPersons.length === 0) {
            this.dataSource = this._utils.prepend(newPerson, this.dataSource);
          }
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error while getting newly added person.', error);
          this.mainAlert = this._alert.statusAlertMesssage(error.status);
        }
      });
    }

    /* Recently changed person handling */
    if (this.viewParams.changedId !== null) {
      this.mainAlert = new AlertMessage(EAlertType.SUCCESS, '', `Persons data with id: '${this.viewParams.changedId}' changed successfully.`);
    }
  }

  /**
   * Toggles visibility of column display pannel
  */
  toggleColumnsPannel(): void {
    this.viewParams.isColumnSetOn=!this.viewParams.isColumnSetOn;
    this._setLocalStorage();
  }

  /**
   * Restores displayed columns to default settings
  */
  restoreColumns(): void {
    this.displayedColumns = this._cols.displayedColumns(this.personDefaults.displayedIndices, this.personDefaults.availableColumns);
    this._setLocalStorage()
  }

  /**
   * Opens column display setting-up dialog
  */
  openColumnSettingsDialog(): void {
    const dialogRef = this._columnDialog.open(PersonsColumnSettingsDialog, {
      data: this.displayedColumns.slice(),
      width: '80%',
      position: {top: '200px'}
    });

    dialogRef.afterClosed().subscribe((results?: string[]) => {
      if (results !== undefined) {
        this.displayedColumns = results;
        this._setLocalStorage()
      }
    });
  }

  /**
   * Toggles visibility of filters pannel
  */
  toggleFiltersPannel(): void {
    this.viewParams.isFilterSetOn=!this.viewParams.isFilterSetOn;
    this._setLocalStorage();
  }

  /**
   * Removes all filters restricting the displayed data
  */
  clearFilters(): void {
    this.queryParams.filters = null;
    this._setURL();
  }

  /**
   * Opens filters setting-up dialog
  */
  openFilterFormDialog(): void {
    const formData: PersonFilterParams = PersonFilterParams.fromDict(this.queryParams.filters);

    const dialogRef = this._filterDialog.open(PersonsFilterFormDialog, {
      data: formData,
      width: '400px',
      position: {top: '200px'}
    });

    dialogRef.afterClosed().subscribe((results?: PersonFilterParams) => {
      if (results !== undefined) {
        this.queryParams.filters = this._filterParams.minimized(results.toDict());
        this.queryParams.page = 1; // page must be reset to first one
        this._setURL();
      }
    });
  }

  /**
   * Orders data by the clicked table header and ordering type
  */
  order(order: Sort): void {
    if (order.direction === '') {
      this.queryParams.orderBy = null;
      this.queryParams.type = EOrderType.ASC;
    } else {
      this.queryParams.orderBy = order.active;
      this.queryParams.type = EOrderType[order.direction.toUpperCase() as keyof typeof EOrderType];
    }
    this._setURL();
  }

  /**
   * Switches table between pages and sets up the count of records displayed per page
  */
  paginate(e: PageEvent): void {
    this.queryParams.perPage = e.pageSize;
    this.queryParams.page = e.pageIndex + 1;
    this._setURL();
  }

  /**
   * Sets up the local storage entries with proper view parameters
  */
  private _setLocalStorage(isIdCleared: boolean = false): void {
    if (isIdCleared) {
      this.viewParams.newId = null;
      this.viewParams.changedId = null;
    }
    this._view.toLocalStorage(this.viewParams, LS_PREFIX, true);
    this._cols.toLocalStorage(this.displayedColumns, this.personDefaults.availableColumns,
                              this.personDefaults.displayedIndices, LS_PREFIX, false);
  }

  /**
   * Sets up the page URL with proper optional parameters
  */
  private _setURL(isReloaded: boolean = true): void {
    this._router.navigate(['pannels', 'persons', {
      ...this._queryParams.necessaryOptParams(this.queryParams)
    }]).then(() => {
      if (isReloaded) {
        window.location.reload();
        this.isLoaderUp = true;
      }
    });
  }

  /**
   * Redirects to 500 internal server error page
  */
  private _redirect500(message: string) {
    console.error('Internal Error Occurred');
    this._router.navigate(['500', {message: message, url: this._router.url}]);
  }

  /**
   * Sets the selected person id
  */
  setSelectedId(personId: number): void {
    this.viewParams.selectedId = personId;
    this._setLocalStorage();
  }

  /**
   * Redirects to person form view as ADD mode.
  */
  addPerson(): void {
    this._router.navigate(['pannels', 'persons', 'new', {returnUrl: this._urlProc.bracket(this._router.url)}]);
  }

  /**
   * Redirects to person form view as EDIT mode.
  */
  editPerson(): void {
    this._router.navigate(['pannels', 'persons', this.viewParams.selectedId, {returnUrl: this._urlProc.bracket(this._router.url)}]);
  }

  /**
   * Deletes person & removes from view table
  */
  deletePerson(): void {
    const deletionConfirmationData: DeletionConfirmationData = new DeletionConfirmationData(
      'Person dropping',
      `Are you sure, you wanna drop person with id '${this.viewParams.selectedId}'?`,
      'Cannot drop person.'
    );

    const dialogRef = this._deletionDialog.open(DeletionConfirmationDialog, {
      data: deletionConfirmationData,
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((result: EDeletionConfirmation) => {
      switch (result) {
        case EDeletionConfirmation.OK:
          /* Deleting person via API */
          this._person.deletePerson(this.viewParams.selectedId || -1).subscribe({
            next: (result: any) => {
              console.log('Person dropped successfully.', result);
              this.mainAlert = new AlertMessage(EAlertType.SUCCESS, '', `Person with id: '${this.viewParams.selectedId}' dropped successfully.`);

              /* Removing person from view table */
              this.dataSource = this.dataSource.filter((person: Person) => person.personId !== this.viewParams.selectedId);
              this.viewParams.selectedId = null;
              this._setLocalStorage(true);
            },
            error: (error: HttpErrorResponse) => {
              console.error('Error while deleting person.', error);
              this.mainAlert = this._alert.statusAlertMesssage(error.status);
            }
          });
          break;
        case EDeletionConfirmation.ERROR_0:
        case EDeletionConfirmation.ERROR_400:
        case EDeletionConfirmation.ERROR_401:
        case EDeletionConfirmation.ERROR_404:
        case EDeletionConfirmation.ERROR_500:
          console.error('Password verification ended with error.');
          this.mainAlert = this._alert.statusAlertMesssage(result);
          break;
        case EDeletionConfirmation.CANCEL:
        default:
          break;
      }
    });
  }
}

/* For view testing purposes only */
const TEST_DATA: Person[] = [
  new Person(0, EPersonType.GC, '0', null, 'Roberto', 'Murray', 'Tamburello', null, 1, '<address><street>24th Avenue</street><city>NYC</city><postalcode>34256-311</postalcode></address>', null, 'e1a2555e-0828-434b-a33b-6f38136a37de', new Date('2007-11-04 00:00:00.000')),
  new Person(1, EPersonType.GC, '1', null, 'Rob', null, 'Walters', null, 0, null, null, 'f2d7ce06-38b3-4357-805b-f4b6b71c01ff', new Date('2007-11-28 00:00:00.000')),
  new Person(2, EPersonType.VC, '0', null, 'Gail', null, 'Erickson', 'Ov.', 0, null, null, 'f3a3f6b4-ae3b-430c-a754-9f2231ba6fef', new Date('2007-12-30 00:00:00.000')),
  new Person(3, EPersonType.SC, '0', 'Mr.', 'Jossef', null, 'Goldberg', null, 0, '<address><street>5th Avenue</street><city>Chigaco</city><postalcode>00110-012</postalcode></address>', '<demographics><gender>male</gender><age>29</age></demographics>', '0dea28fd-effe-482a-afd3-b7e8f199d56f', new Date('2013-12-16 00:00:00.000')),
  new Person(4, EPersonType.GC, '2', null, 'Dylan', 'J.', 'Miller', null, 1, null, null, 'c45e8ab8-01be-4b76-b215-820c8368181a', new Date('2009-02-01 00:00:00.000')),
  new Person(5, EPersonType.SC, '1', 'Ms.', 'Diane', 'Alice', 'Margheim', null, 0, null, '<demographics><gender>female</gender><age>24</age></demographics>', 'a948e590-4a56-45a9-bc9a-160a1cc9d990', new Date('2008-12-22 00:00:00.000')),
  new Person(6, EPersonType.SP, '1', null, 'Gigi', null, 'Matthew', null, 1, null, null, '5fc28c0e-6d36-4252-9846-05caa0b1f6c5', new Date('2009-01-09 00:00:00.000')),
  new Person(7, EPersonType.IN, '1', 'Mr.', 'Michael', 'Jr.', 'Raheem', 'ex.', 0, null, null, 'ca2c740e-75b2-420c-9d4b-e3cbc6609604', new Date('2009-04-26 00:00:00.000')),
  new Person(8, EPersonType.GC, '2', null, 'Ovidiu', 'M.', 'Cracium', null, 2, null, null, 'd2cc2577-ef6b-4408-bd8c-747337fe5645', new Date('2010-11-28 00:00:00.000')),
  new Person(9, EPersonType.SC, '0', null, 'Thierry', null, 'D\'Hers', null, 1, null, null, 'fa263c7f-600d-4e89-8dcd-0978f3530f5f', new Date('2007-12-04 00:00:00.000')),
];
