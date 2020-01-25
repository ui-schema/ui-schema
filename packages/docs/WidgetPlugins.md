# Widget Plugins

## Plugin List

### Schema Driven

| Plugin               | Package              | Handles              | Added Props | Status |
| :---                 | :---                 | :---                 | :---        | :--- |
| DefaultHandler       | @ui-schema/ui-schema | keyword `default`    | - | ❗ |
| ValidityReporter     | @ui-schema/ui-schema | setting validity changes | - | ❌ |

### Validation Plugins

| Plugin               | Package              | Handles              | Added Props | Status |
| :---                 | :---                 | :---                 | :---        | :--- |
| MinMaxValidator      | @ui-schema/ui-schema | min/max validity     | `valid`, `errors` | ✔(string,number) ❗ |
| TypeValidator        | @ui-schema/ui-schema | keyword `type`       | `valid`, `errors` | ✔ |
| ValueValidatorConst  | @ui-schema/ui-schema | keywords `type`, `const` | `valid`, `errors` | ✔ |
| ValueValidatorEnum   | @ui-schema/ui-schema | keywords `type`, `enum` | `valid`, `errors` | ✔ |
| PatternValidator     | @ui-schema/ui-schema | keywords `type:string`, `pattern` | `valid`, `errors` | ❌ |
| MultipleOfValidator  | @ui-schema/ui-schema | keywords `type:number,integer`, `multipleOf` | `valid`, `errors` | ✔ |
| ArrayValidator       | @ui-schema/ui-schema | keywords `type:array` | `valid`, `errors` | ❌ |
| RequiredValidator    | @ui-schema/ui-schema | keywords `type:object`, `required` | `valid`, `errors` | ❌ |

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
