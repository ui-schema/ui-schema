# Widget Plugins

## Plugin List

### Schema Driven

| Plugin                                              | Package              | Handles              | Added Props | Status |
| :---                                                | :---                 | :---                 | :---        | :--- |
| DefaultHandler                                      | @ui-schema/ui-schema | keyword `default`    | - | ✔ |
| [ValidityReporter](#validityreporter)               | @ui-schema/ui-schema | setting validity changes | - | ✔ |
| [CombiningHandler](#combininghandler)               | @ui-schema/ui-schema | ... | ... | ❌ |
| [CombiningNetworkHandler](#combiningnetworkhandler) | @ui-schema/ui-schema | ... | ... | ❌ |

### Validation Plugins

| Plugin               | Package              | Handles              | Added Props | Status |
| :---                 | :---                 | :---                 | :---        | :--- |
| MinMaxValidator      | @ui-schema/ui-schema | min/max validity     | `valid`, `errors` | ✔(string,number) ❗ |
| TypeValidator        | @ui-schema/ui-schema | keyword `type`       | `valid`, `errors` | ✔ |
| ValueValidatorConst  | @ui-schema/ui-schema | keywords `type`, `const` | `valid`, `errors` | ✔ |
| ValueValidatorEnum   | @ui-schema/ui-schema | keywords `type`, `enum` | `valid`, `errors` | ✔ |
| PatternValidator     | @ui-schema/ui-schema | keywords `type:string`, `pattern` | `valid`, `errors` | ✔ |
| MultipleOfValidator  | @ui-schema/ui-schema | keywords `type:number,integer`, `multipleOf` | `valid`, `errors` | ✔ |
| ArrayValidator       | @ui-schema/ui-schema | `type:array`          | `valid`, `errors` | ✔(partial sub-schema for single sub-schema) ❗ |
| ObjectValidator      | @ui-schema/ui-schema | `type:object`         | ... | ❌ |
| RequiredValidator    | @ui-schema/ui-schema | keywords `type:object`, `required` | `valid`, `errors`, `required` | ✔ |

- `MinMaxValidator` depends on `RequiredValidator`

#### ValidityReporter

Submits the validity of each widget up to the state hoisted component when it changes.`

```js
import React from 'react';
import {SchemaEditor} from "@ui-schema/ui-schema";
import {widgets,} from "@ui-schema/ds-material";
import {Map} from 'immutable';

import {data1, schema1} from "../_schema1";

const MainStore = () => {
    /**
     * @var {Map} validity nested map with special key `__valid` which may be true or false, for each layer separately, if valid or not is not inherited upwards
     */
    const [validity, setValidity] = React.useState(Map({}));

    return <React.Fragment>
        <SchemaEditor
            schema={schema1}
            data={data1}
            widgets={widgets}
            onValidity={setValidity}
            { /* setter must get the previous state as value, it must be an immutable map, will return updated map */ }
            onValidity={(setter) => setValidity(setter(validity))}
            
        />
        {validity.contains(false) ? 'invalid' : 'valid'}
    </React.Fragment>
};
```

Checking if invalid scope in a **widget**:

> **[bug]** `isInvalid` seems to not work correctly recursively sometimes (strange bug)

```js
import {isInvalid} from "@ui-schema/ui-schema";

const SomeWidget = ({validity, storeKeys, ...props}) => {

    let invalid = isInvalid(validity, storeKeys, false); // Map, List, boolean: <if count>

    return null; // should be the binding component
};
```

#### CombiningHandler

Combining schemas from within one schema, [specification](https://json-schema.org/understanding-json-schema/reference/combining.html)

#### CombiningNetworkHandler

Combining schemas from external addressed by using `$id` and `$ref`, [specification](https://json-schema.org/understanding-json-schema/structuring.html#the-id-property)

## Creating Plugins

>
> ✔ working, not expected to change (that much) breaking in the near future
>

Each plugin can change or add properties to the final widget in an easy way, the render behaviour can be changed, even asynchronous actions could be applied schema driven.

Creating a plugin like:

```js
import React from "react";
import {NextPluginRenderer} from "@ui-schema/ui-schema";

const NewPlugin = (props) => {
    // special props which don't reach `Widget`, only for plugins
    const {current, Widget, widgetStack} = props;

    // doing some logic
    const newProp = props.schema.get('keyword') ? 'success' : 'error';

    // keep rendering the stack or do something else
    return <NextPluginRenderer {...props} newProp={newProp}/>;// `current` gets `+1` in here
};

export {NewPlugin}
```

- `{current, Widget, widgetStack, ...props}` prop signature of each plugin
- `current` index/current position in stack
- `Widget` actual component to render
- `widgetStack` whole stack that is currently rendered
- `props` are the props which are getting pushed to the `Widget`
- recommended: use `<NextPluginRenderer {...props} newProp={false}/>` 
    - automatically render the plugins nested
    - `newProp` is available in the widget and the next plugins

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Widget Plugins](./WidgetPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
