# Shopping Cart using MEAN stack

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.4.

## Dependency installation

`npm install`

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

Run `npm run start:server` to start the node express app and add your mongodb cloud `username`, `password` and `dbname` at `/mean-stack-shopping-cart/backend-api/config/dbconfig.js` and also add your local development IP and production server IP at `/mean-stack-shopping-cart/backend-api/app.js` to prevent the `CORS` issue. 

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

## Node.js express app deployment

Add `server.js` and `package.json` files into `/mean-stack-shopping-cart/backend-api/` from `/mean-stack-shopping-cart/` for deployment and remove unwanted dependencies in `/mean-stack-shopping-cart/backend-api/package.json` like angular dependencies. 
