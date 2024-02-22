import { Component } from '@angular/core';
import { EAdminPannelStep } from 'src/app/models/instructions/e-admin-pannel-step';

@Component({
  selector: 'app-admin-pannels',
  templateUrl: './admin-pannels.component.html',
  styleUrls: ['./admin-pannels.component.scss']
})
export class AdminPannelsComponent {
  selectedInstruction: string = EAdminPannelStep.VIEW;
  instructionButtons: any[] = [
    {name: "View", value: EAdminPannelStep.VIEW, icon: "view_list"},
    {name: "Pagination", value: EAdminPannelStep.PAGINATION, icon: "last_page"},
    {name: "Ordering", value: EAdminPannelStep.ORDER, icon: "sort_by_alpha"},
    {name: "Columns displaying", value: EAdminPannelStep.COLUMNS, icon: "view_column"},
    {name: "Filters", value: EAdminPannelStep.FILTER, icon: "filter_list"},
    {name: "Object registration", value: EAdminPannelStep.ADD, icon: "add"},
    {name: "Changing objects data", value: EAdminPannelStep.EDIT, icon: "edit"},
    {name: "Object deletion", value: EAdminPannelStep.DELETE, icon: "delete_forever"},
    {name: "Specials", value: EAdminPannelStep.SPECIAL, icon: "stars"},
  ];

  viewSteps: any[] = [
    {name: "1. Overview", title: "Admin pannel overview.", description: "Every admin pannel in the application includes three main components: the table, action buttons bar at the top and bottom bar (with pagination elements). Every admin pannel view has got its 5 basic parameters: filters, ordering, ordering type, page number and number of items displayed per page."},
    {name: "2. Top bar", title: "Action buttons bar.", description: "Action button bar (of each of admin pannels) contains the following buttons. Going from the left: two switches for popping up columns and filters setting bars, button for new item insertion, edition and removing. WARNING: Before edition/removing the desired item in row must be selected first. Insertion, edition and removing are disabled for user with readonly access."},
    {name: "3. Table", title: "Table with data (items).", description: "Every table beside the data rows has got their headers. If clicked, the data will be sorted ascending and descending (if clicked again) by the clicked header."},
    {name: "4. Bottom bar", title: "Bottom actions bar.", description: "On the bottom of the pannels table on the right hand side are located actions for pagination, ie. switching between pages and setting up the number of items displayed per page."},
  ];
  paginationSteps: any[] = [
    {name: "1. Horizontal restrictions", title: "Horizontal data displaying restrictions", description: "The data displaying in the admin pannels is restricted (horizontally) by the number of items (rows) in the table and the page (ordinal number of displaying)."},
    {name: "2. Page number", title: "Number of displayed page (rows set) in table.", description: "Current page of table rows could be switched by using [<] and [>] button on the right hand side."},
    {name: "3. Items per page", title: "Number of items displayed per page.", description: "Number of items (rows) visible in table could be changed by clicking the dropup list on the left hand side and selecting the desired number."}
  ];
  orderSteps: any[] = [
    {name: "1. Headers", title: "Clickable table headers.", description: "Every of the table headers could be clicked in order to order the data by the clicked header ascending. If clicked again the data will be ordered descending. Clicking again erases ordering. Clicking another header orders the data by this header and erases the previous ordering."},
    {name: "2. Top/bottom arrows", title: "Headers ordering arrows.", description: "Every time the header is clicked to order the data, the top or bottom arrow appears beside. If ordered ascending, the top arrow appears and if descending - the bottom arrow."},
    {name: "3. Exceptions", title: "Excluded data types for ordering.", description: "Exceptionally the headers containing images or files (instead of strings or numbers) could not be ordered as there are no comparison methods implemented for such data types in PostgreSQL (where the data are stored)."}
  ];
  columnsSteps: any[] = [
    {name: "1. Vertical restrictions", title: "Vertical data displaying restrictions.", description: "The data displaying in the admin pannels is also (vertically) restricted by the visible columns placed in certain order."},
    {name: "2. Switch", title: "Columns setting pannel switch.", description: "The columns setting pannel could be shown up by clicking the first from the left switch (with columns icon). Clicking it again hides the pannel."},
    {name: "3. Settings pannel", title: "Columns order in pannel", description: "In the columns display setting pannel there are column header names placed in desired order. That order denotes which columns and on which positions will be displayed in the main table. By default there are displyed columns in the most common order. The reset icon resets the column displaying to default order."},
    {name: "4. Settings dialog", title: "Modal column settings dialog", description: "Clicking the 'Set columns' button shows up the modal dialog for setting the column displaying order. The new columns to display could be selected from dropdown list. Selected columns could be removed by clicking 'x' beside the selected names. The selections could be also dragged-and-dropped to change the displaying order. Clicking 'Set up' closes the dialog and sets up the displaying order, 'Restore to default' - resets to default order and 'Cancel' - closes the dialog without making changes."}
  ];
  filterSteps: any[] = [
    {name: "1. Criterial restrictions", title: "Criterial data displaying restrictions.", description: "The data displaying is also restricted by so called filters. These are the predicates (conditions) concerning the data stored in the source database, which are used for restricting the loaded data only into these satysfying the mentioned conditions. Example: (person type = 'GC') --> only the data for GC (general contact) persons."},
    {name: "2. Switch", title: "Filters setting pannel switch.", description: "The filters setting pannel could be shown up by clicking the second from left switch (with filter icon). Clicking it again hides the pannel"},
    {name: "3. Settings pannel", title: "Filters in pannel.", description: "In the filters pannel there are predicated which the data displayed in the main table have to satisfy. By default there are no filters set up. Clicking the reset icon erases the filters."},
    {name: "4. Settings dialog", title: "Model filter settings dialog.", description: "Clicking the 'Set filters' button shows up the model dialog for setting the filters. That is the form with fields denoting available criterias for filtering and making predicates. Editing the control sets up the predicate and clearing it - removes. Clicking the 'Filter' closes the dialog and set up the filters, 'Clear' - removes all predicates and 'Cancel' - closes the dialog without making changes."}
  ];
  addSteps: any[] = [
    {name: "1. Registration button", title: "Register new object button.", description: "The view with form for registering new object could be launched via clicking the button with [+] located in the center of all buttons and switches. For users with readonly access mode this button will be disabled as they cannot register new objects. The form could be also opened via adding '/new' to URL address base of the admin pannel. If user has readonly access instead of form will be displayed page with 503 Forbidden error."},
    {name: "2. Registration form", title: "Registration form overview.", description: "Every new object registration form has the fields relevant for the database entity. The mandatory fields are marked with (*) asterisk. Under certain field could be found italicized /hint/ text, after hovering which the tooltip with hints for helping filling in."},
    {name: "3. Validation", title: "Form fields validation.", description: "Every field has to be valid according to certain rules. If the field value does not meet the requirements, then it goes red with appropriate red text below. Until at least one field is invalid, thre won't be a possibility of form submission."},
    {name: "4. Submission", title: "Submit button and other actions.", description: "After proper filling in the form it could be submitted by clicking 'Confirm' button on the right hand side of the bottom. The object will be then inserted into the database table, view will be switched to an admin pannel with highlighted on green table row with newly added object. Clicking 'Clear' button on the left resets the form, ie. clears all form fields."}
  ];
  editSteps: any[] = [
    {name: "1. Changing data button", title: "Change objects data button.", description: "To change the data of certain object, it must be first highlighted in the main table by clicking the row representing revelant object. The view with form for changing objects data could be launched via clicking the button with pen icon located after the registration button. For users with readonly access mode this button will be disabled as they cannot change data of any objects. The form could be also opened via adding '/<object id>' to URL address base of the admin pannel. If user has readonly access instead of form will be displayed page with 503 Forbidden error."},
    {name: "2. Changing data form", title: "Changing data form overview.", description: "Every changed object (just like inserted) form has the fields relevant for the database entity. The mandatory fields are marked with (*) asterisk. Under certain field could be found italicized /hint/ text, after hovering which the tooltip with hints for helping filling in."},
    {name: "3. Validation", title: "Form fields validation.", description: "Every field has to be valid according to certain rules. If the field value does not meet the requirements, then it goes red with appropriate red text below. Until at least one field is invalid, thre won't be a possibility of form submission."},
    {name: "4. Submission", title: "Submit button and other actions.", description: "After proper filling in the form it could be submitted by clicking 'Confirm' button on the right hand side of the bottom. The object will be then updated in the database table, view will be switched to an admin pannel with highlighted on yellow table row with recently changed object. Clicking 'Clear' button on the left resets the form, ie. clears all form fields."}
  ];
  deleteSteps: any[] = [
    {name: "1. Deletion button", title: "Drop objects button.", description: "To drop certain object, it must be first highlighted in the main table by clicking the row representing revelant object. The deletion confirmation dialog could be launched via clicking the button with trash bin icon located at the very right position. For users with readonly access mode this button will be disabled as they cannot drop any objects."},
    {name: "2. Confirmation dialog", title: "Modal dialog with deletion confirmation.", description: "The modal dialog with Yes/No options and message 'This action cannot be undone.' will be displayed after clicking the drop object button. Clicking 'No' option hiden the pannel and 'Yes' - shows up the field with password."},
    {name: "3. Password checking", title: "Mandatory password checking.", description: "Before deletion of every object user has to provide his own account password for safety. After correctly typed password and clicking 'Confirm', the certain object will be physically removed from the database table and visually from the main table in admin pannel."}
  ];
  specialSteps: any[] = [
    {name: "1. Specials", title: "Specific widgets and elements", description: "Admin pannels also contain some specific widgets and elements to improve visual side of application. These could be for example animated loaders or progress bars and also specific modal dialog dedicated for certain actions."},
    {name: "2. Loader", title: "Page loader widget", description: "Every time the view parameter values are changing the data should be reloaded. During the data reloading the animated page loader is shown up and hidden immediately the data have been loaded into table in admin pannel. The same action takes place while registering, changing data or dropping object."},
    {name: "3. Xml editor", title: "Modal pannel for xml editing", description: "Some fields must contain valid xml strings. To make the things easier users could edit xml documents in modal pannels, which have possibility to display aside pretty xml document. That could prevent from mistakes during xml edition."}
  ];

  instructionPannels: any[] = [
    {name: "View", value: EAdminPannelStep.VIEW, images: [
      {name: "view_start", label: "Start up view", half: true},
      {name: "view_components", label: "View with visible components", half: true}
    ], steps: this.viewSteps},
    {name: "Pagination", value: EAdminPannelStep.PAGINATION, image: "pagination", half: false, steps: this.paginationSteps},
    {name: "Ordering", value: EAdminPannelStep.ORDER, image: "order", half: false, steps: this.orderSteps},
    {name: "Columns displaying", value: EAdminPannelStep.COLUMNS, images: [
      {name: "columns_shown_up", label: "Shown up settings bar", half: false},
      {name: "columns_setting", label: "Setting up the columns", half: true}
    ], steps: this.columnsSteps},
    {name: "Filters", value: EAdminPannelStep.FILTER, images: [
      {name: "filters_shown_up", label: "Shown up settings bar", half: false},
      {name: "filters_setting", label: "Setting up the filters", half: true}
    ], steps: this.filterSteps},
    {name: "Object registration", value: EAdminPannelStep.ADD, images: [
      {name: "add_start", label: "Start up form view", half: true},
      {name: "add_filled_in", label: "Filled in form", half: true}
    ], steps: this.addSteps},
    {name: "Changing objects data", value: EAdminPannelStep.EDIT, images: [
      {name: "edit_start", label: "Start up form view", half: true},
      {name: "edit_filled_in", label: "Filled in form", half: true}
    ], steps: this.editSteps},
    {name: "Object deletion", value: EAdminPannelStep.DELETE, image: "delete", half: false, steps: this.orderSteps},
    {name: "Specials", value: EAdminPannelStep.SPECIAL, images: [
      {name: "special_loader", label: "Page loader", half: false},
      {name: "special_xml", label: "Xml editor", half: false}
    ], steps: this.specialSteps}
  ];


  /**
   * Selects instruction to view
  */
  selectInstruction(instruction: string): void {
    this.selectedInstruction = instruction;
  } 
}
