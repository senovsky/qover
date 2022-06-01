# Qover business case

This repository contains an example test case implemented in Cypress, for the whitelabel service of [Qover](https://cover.com/).

## Prerequisites

- [Node.js](https://nodejs.org/en/) 12 and above installed (LTS recommended)
- This [repository](https://github.com/senovsky/qover) cloned or downloaded to your computer
- Run `npm install` to download all dependencies

## Running the tests

- Run `npm test` to open the Cypress test runner, then click on any `*.spec.ts` file
- Run `npm run cy:run:chrome` or `npm run cy:run:firefox` to run all tests in a headless mode of a given browser

## Test results

- When using the test runner, test results are displayed in a browser window
- When using the headless mode, test results are displayed in the terminal. In case of one or more test failures, you can also see [Screenshots](cypress/screenshots) and [Videos](cypress/videos)