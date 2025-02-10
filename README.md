![AW2017MA app logo](/src/assets/images/logo/aw2017ma_app_logo_blue.png)
# AdventureWorks2017 Management App

The AW2017 Management App is a solution for the maintenance of AdventureWorks2017 datawarehouse. It enables performing four basic CRUD operations on the datawarehouse entities. This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.0.2.

## Setup
### 1. Node.js
First what you need to install is [Node.js](https://nodejs.org/). Proceed with installation instructions from official Node.js site.

### 2. Angular
After setting up Node.js install [Angular](https://angular.io/guide/setup-local) from the project page. Then install the following packages:
| Package                                                                   | Command                           | Description                         |
|---------------------------------------------------------------------------|-----------------------------------|-------------------------------------|
| [ng-scrollbar](https://www.npmjs.com/package/ngx-scrollbar)               | npm i ngx-scrollbar@11.0.0        | Customized floating scrollbar       |
| [XML-formatter](https://www.npmjs.com/package/xml-formatter)              | npm i xml-formatter@3.6.2         | Pretty formatted XML documents      |
| [Angular 2 Input Mask](https://www.npmjs.com/package/angular2-text-mask)  | npm i angular2-text-mask@14.3.3   | Text input masks (date, phone, etc.)|
| [NgxMatSelectSearch](https://www.npmjs.com/package/ngx-mat-select-search) | npm i ngx-mat-select-search@7.0.5 | Select dropdown list with searching |
| [ngx-countdown](https://www.npmjs.com/package/ngx-countdown)              | npm i ngx-countdown@15.0.0        | Countdown timer                     |

### 3. Github repo downloading
Download from the [Github repo](https://github.com/kaluzny1995/AdventureWorksApp). Include [Angular Material](https://material.angular.io/guide/getting-started) packages into the project typing in `ng add @angular/material`. Open downloaded project repo via Visual Studio Code or other relevant Angular editor.

## Running application server

To launch application server type in `ng serve` in terminal or click `Run/Run Without Debugging (Ctrl+F5)` from Visual Studio Code. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.
