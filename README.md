# openmrs-esm-opencare-app

![Node.js CI](https://github.com/openmrs/openmrs-esm-template-app/workflows/Node.js%20CI/badge.svg)

The OpenMRS Opencare application (micro front-end)

This repository provides a starting point for creating your own
[OpenMRS Microfrontend](https://wiki.openmrs.org/display/projects/OpenMRS+3.0%3A+A+Frontend+Framework+that+enables+collaboration+and+better+User+Experience).

For more information, please see the
[OpenMRS Frontend Developer Documentation](https://o3-docs.openmrs.org/#/).

In particular, the [Setup](https://o3-docs.openmrs.org/docs/frontend-modules/setup) section can help you get started developing microfrontends in general. The [Creating a microfrontend](https://o3-docs.openmrs.org/docs/recipes/create-a-frontend-module) section provides information about how to use this repository to create your own microfrontend.

## Running this code

```sh
# to install dependencies
yarn

# to run the dev server
# yarn start --backend=<backend url> --port=<port>
yarn start --backend=http://localhost/

```

Once it is running, a browser window
should open with the OpenMRS 3 application. Log in and then navigate to `/openmrs/spa/opencare`.
