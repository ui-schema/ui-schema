# Design Systems

Through widgets, the schema can work with any design system or individual component library, just use the properties to build the supported behaviour needed.

For some popular design-systems default bindings exists, otherwise see [create your own binding](/docs/widgets#create-design-system-binding) or [overwriting widgets](/docs/widgets#adding--overwriting-widgets).

## Material-UI

Install:

```bash
npm i --save @ui-schema/ui-schema @ui-schema/ds-material @material-ui/core @material-ui/icons immutable
```

## Bootstrap

Use only HTML:

```bash
npm i --save @ui-schema/ui-schema @ui-schema/ds-bootstrap immutable
```

Use with `bootstrap` package:

```bash
npm i --save @ui-schema/ui-schema @ui-schema/ds-bootstrap immutable bootstrap
```

Bootstrap has jQuery as dependency. To access it, the following imports are necessary in the parent-bootstrap-component (`Main.js`):

```js
import "bootstrap";
import $ from "jquery";
```

jQuery must be assigned to window like: `window.$`

## Add Design System Package

> For contributors - useless for users

Create new lerna package:

e.g. `lerna create ds-bootstrap` enter as package name `@ui-schema/ds-bootstrap`

Copy/create the basic files for the design system.

Add new package (and needed peer-dependencies) to demo package, see [Contributing - add new package](https://github.com/ui-schema/ui-schema#contributing)

Add to build process: [/config.js](https://github.com/ui-schema/ui-schema/blob/master/config.js), add there another design-system with namings like the others.

Initialize/bootstrap and hoist the packages: `npm run bootstrap && npm run hoist`

Create demo pages in demo package.

Start and see: `npm start`
