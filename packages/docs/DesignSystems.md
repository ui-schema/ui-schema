# Design Systems

Through widgets, the schema can work with any design system or individual component library, just use the properties to build the supported behaviour needed.

For popular design-systems some default bindings exists, like for:

## Material-UI

Install:

```bash
npm i --save @ui-schema/ui-schema @ui-schema/ds-material @material-ui/core @material-ui/icons immutable
```

## Bootstrap

```bash
npm i --save @ui-schema/ui-schema @ui-schema/ds-bootstrap @material-ui/core @material-ui/icons immutable
```

## Add Design System Package

> Internal Usage only

Create new lerna package:

e.g. `lerna create ds-bootstrap` enter as package name `@ui-schema/ds-bootstrap`

Copy/create the basic files for the design system.

Add new package (and needed peer-dependencies) to demo package, see [Contributing - add new package](../../README.md#contributing)

Add to build process: [/config.js](../../config.js), add there a nother design-system with namings like the others.

Initialize/bootstrap and hoist the packages: `npm run bootstrap && npm run hoist`

Create demo pages in demo package.

Start and see: `npm start`
