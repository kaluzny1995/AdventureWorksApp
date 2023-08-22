import { Component } from '@angular/core';

@Component({
  selector: 'app-dataflow-diagrams',
  templateUrl: './dataflow-diagrams.component.html',
  styleUrls: ['./dataflow-diagrams.component.scss']
})
export class DataflowDiagramsComponent {
  frontendFlow: any[] = [
    {name: "1. Form/admin pannel view", title: "User opens form, admin pannel or other view.", description: "User may open the view with available controls. If the view contains form, then user may fill it. Application tells user whether form is valid and unless it is, it tells which fields have errors with appropriate description."},
    {name: "2. Actions/submissions", title: "User peforms actions in view and/or submits certain form.", description: "User may perform various actions like data request, form submission etc."},
    {name: "3. Service", title: "Actions/data passed into service.", description: "Application may pass user actions or submitted form data into services."},
    {name: "4. Endpoint request", title: "Requests sent to API endpoint.", description: "Application services may receive the action/data and pass them via API endpoints."},
    {name: "API", title: "API steps", description: "", disabled: true},
    {name: "5. Endpoint response", title: "Responses received from API endpoints and passed to the view.", description: "Application services may receive responses from API endpoints and pass the received data into views."},
    {name: "6. Data display", title: "Data received and displayed in view.", description: "User may receive the data from application services and see appropriately disaplyed informations in view."}
  ];
  backendFlow: any[] = [
    {name: "1. HTTP request", title: "HTTP request to API endpoint.", description: "API may receive HTTP requests from frontend application to appropriate endpoints."},
    {name: "2. Service", title: "Service methods invokation for required data.", description: "API endpoint may invoke API service methods for required data. API endpoint may also invoke API provider methods directly."},
    {name: "3. Provider", title: "Provider methods invokation for database data.", description: "API service may invoke provider methods in order to receive database data."},
    {name: "4. Databases", title: "Transactions on database servers.", description: "API may perform CRUD operations on two databases: Users -- MongoDB & AdventureWorks2017 -- PostgresDB."},
    {name: "5. Objects", title: "Database-structured data to Python objects transformation.", description: "API provider may transform database-structured data to Python objects and pass them to API service."},
    {name: "6. Objects processing", title: "Objects processing by service.", description: "API service may process received from API provider Python objects and pass the results to API endpoints."},
    {name: "7. HTTP response", title: "Passing processed data via HTTP response.", description: "API endpoint may receive processed data and pass it via HTTP response to frontend application."}
  ];
}
