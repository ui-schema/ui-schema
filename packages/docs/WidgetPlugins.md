# Widget Plugins

## Plugin List

### Schema Driven

| Plugin                                              | Package              | Handles              | Added Props | Status |
| :---                                                | :---                 | :---                 | :---        | :--- |
| DefaultHandler                                      | @ui-schema/ui-schema | keyword `default`    | - | ✔ |
| [ValidityReporter](#validityreporter)               | @ui-schema/ui-schema | setting validity changes | - | ✔ |
| [DependentHandler](#dependenthandler)               | @ui-schema/ui-schema | keyword `dependencies` | ... | ❗  |
| [ConditionalHandler](#conditionalhandler)           | @ui-schema/ui-schema | ... | ... | ❌ |
| [CombiningHandler](#combininghandler)               | @ui-schema/ui-schema | ... | ... | ❌ |
| [CombiningNetworkHandler](#combiningnetworkhandler) | @ui-schema/ui-schema | ... | ... | ❌ |

### Validation Plugins

| Plugin               | Package              | Validity Fn.         | Handles              | Added Props | Status |
| :---                 | :---                 | :---                 | :---                 | :---        | :--- |
| MinMaxValidator      | @ui-schema/ui-schema | validateMinMax       | min/max validity     | `valid`, `errors` | ✔(string,number) ❗ |
| TypeValidator        | @ui-schema/ui-schema | validateType         | keyword `type`       | `valid`, `errors` | ✔ |
| ValueValidatorConst  | @ui-schema/ui-schema | validateConst        | keywords `type`, `const` | `valid`, `errors` | ✔ |
| ValueValidatorEnum   | @ui-schema/ui-schema | validateEnum         | keywords `type`, `enum` | `valid`, `errors` | ✔ |
| PatternValidator     | @ui-schema/ui-schema | validatePattern      | keywords `type:string`, `pattern` | `valid`, `errors` | ✔ |
| MultipleOfValidator  | @ui-schema/ui-schema |                      | keywords `type:number,integer`, `multipleOf` | `valid`, `errors` | ✔ |
| ArrayValidator       | @ui-schema/ui-schema |                      | `type:array`          | `valid`, `errors` | ✔(partial sub-schema for single sub-schema) ❗ |
| ObjectValidator      | @ui-schema/ui-schema |                      | `type:object`         | ... | ❌ |
| RequiredValidator    | @ui-schema/ui-schema |                      | keywords `type:object`, `required` | `valid`, `errors`, `required` | ✔ |

- `MinMaxValidator` depends on `RequiredValidator` ✔
    - on render it behaves `strict` only when `required` ✔
    - validation checking outside is always strict ✔
- sub-schema validation/array validation is done by `validateSchema`  ✔ 
    - (todo: new override-prop/more docs)

#### validateSchema

    import {validateSchema} from '@ui-schema/ui-schema';
    
Exports the validation functions used by the plugins for usage outside of the render tree.

Returns `false` when **no error** was found, otherwise `true` or `List` with errors.

Currently includes the handlers of:

- validateType
- validatePattern
- validateMinMax
- validateMultipleOf
- validateConst
- validateEnum

#### ValidityReporter

Submits the validity of each widget up to the state hoisted component when it changes.`

> Reported format is not like specified in [2019-09#rfc-10.4.2](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.10.4.2), current used is better for performance and the render-validation used.

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

```js
import {isInvalid} from "@ui-schema/ui-schema";

const SomeWidget = ({validity, storeKeys, ...props}) => {

    let invalid = isInvalid(validity, storeKeys, false); // Map, List, boolean: <if count>

    return null; // should be the binding component
};
```

> when it should evaluate to invalid - but it says valid, check your custom widgets and if correctly passing `onValidity` down the tree

#### DependentHandler

Enables on-the-fly sub-schema rendering based on current input, e.g. show more address fields if a customer is a business.

This plugin must be above your HTML-Grid rendering plugin, otherwise the HTML will be nested wrongly.

- keyword `dependencies`, `dependentSchemas`
    - nested combination keywords in here
- [combining schemas](https://json-schema.org/understanding-json-schema/reference/combining.html) ❌
    - `allOf`
    - `anyOf`
    - `oneOf` ❗
    - `not`
    
❗ Dynamically extending a schema is currently supported with `dependencies` and `oneOf`, interpret `oneOf` like a switch.

- create dependencies
- use the property name, its value will be used
- define a restricting sub-schema for the used property name, if the value is valid against it
- the whole sub-schema is added dynamically from that property
- please note: there will be no schema-change in state, it's property calculated on-render and dynamically rendered parallel to the referencing property

```js
let schema = {
    title: "Person",
    type: "object",
    properties: {
        country: {
            type: "string",
            widget: 'Select',
            enum: [
                "usa",
                "canada",
                "eu"
            ],
            default: "eu"
        }
    },
    required: [
        "country"
    ],
    dependencies: {
        country: {
            oneOf: [
                {
                    // do nothing when `usa` is selected 
                    properties: {
                        country: {
                            const: "usa"
                        }
                    }
                },
                {
                    // add number input when `canada` is selected
                    properties: {
                        country: {
                            const: "canada"
                        },
                        maple_trees: {
                            type: "number"
                        }
                    }
                },
                {
                    // add boolean input when `eu` is selected and make it required
                    properties: {
                        country: {
                            const: "eu"
                        },
                        privacy: {
                            type: "boolean"
                        }
                    },
                    required: [
                        "privacy"
                    ]
                }
            ]
        }
    }
};
```

#### ConditionalHandler

- [conditionals](https://json-schema.org/understanding-json-schema/reference/conditionals.html) ❌
    - `allOf`
    - `if`
    - `else`
    
#### CombiningHandler

Combining schemas from within one schema by definition, id, ref, [specification](https://json-schema.org/understanding-json-schema/reference/combining.html)

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
