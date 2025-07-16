---
docModule:
    package: '@ui-schema/ds-bootstrap'
    modulePath: "ds-bootstrap/src/"
    files:
        - "BindingDefault/*"
        - "Component/*/*"
        - "Grid/*"
        - "GridContainer/*"
        - "Widgets/*/*"
---

# Bootstrap Design System

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
