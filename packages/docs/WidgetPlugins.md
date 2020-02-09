# Widget Plugins

Plugins are wrapped around each widget/json-schema level and are used to add logic to all. Each plugin should decide if it should do something according to it's props/schema.

## Schema Driven

Plugins that work schema-driven are handling the schema in different ways, these are not used for validation but for creating functionality around the schema.

| Plugin                                              | Package              | Handles              | Added Props | Status |
| :---                                                | :---                 | :---                 | :---        | :--- |
| [DefaultHandler](#defaulthandler)                   | @ui-schema/ui-schema | keyword `default`    | - | ✔ |
| [ValidityReporter](#validityreporter)               | @ui-schema/ui-schema | setting validity changes | - | ✔ |
| [DependentHandler](#dependenthandler)               | @ui-schema/ui-schema | keyword `dependencies` | ... | ❗  |
| [ConditionalHandler](#conditionalhandler)           | @ui-schema/ui-schema | ... | ... | ❌ |
| [CombiningHandler](#combininghandler)               | @ui-schema/ui-schema | ... | ... | ❌ |
| [CombiningNetworkHandler](#combiningnetworkhandler) | @ui-schema/ui-schema | ... | ... | ❌ |

## Validation Plugins

Validation plugins also work schema-driven, but are only used for validation of the values/schema.

| Plugin               | Package              | Validity Fn.         | Handles              | Added Props | Status |
| :---                 | :---                 | :---                 | :---                 | :---        | :--- |
| MinMaxValidator      | @ui-schema/ui-schema | validateMinMax       | min/max validity     | `valid`, `errors` | ✔(string,number) ❗ |
| TypeValidator        | @ui-schema/ui-schema | validateType         | keyword `type`       | `valid`, `errors` | ✔ |
| ValueValidatorConst  | @ui-schema/ui-schema | validateConst        | keywords `type`, `const` | `valid`, `errors` | ✔ |
| ValueValidatorEnum   | @ui-schema/ui-schema | validateEnum         | keywords `type`, `enum` | `valid`, `errors` | ✔ |
| PatternValidator     | @ui-schema/ui-schema | validatePattern      | keywords `type:string`, `pattern` | `valid`, `errors` | ✔ |
| MultipleOfValidator  | @ui-schema/ui-schema | validateMultipleOf   | keywords `type:number,integer`, `multipleOf` | `valid`, `errors` | ✔ |
| ArrayValidator       | @ui-schema/ui-schema |                      | `type:array`          | `valid`, `errors` | ✔(partial sub-schema for single sub-schema) ❗ |
| ObjectValidator      | @ui-schema/ui-schema |                      | `type:object`         | ... | ❌ |
| RequiredValidator    | @ui-schema/ui-schema |                      | keywords `type:object`, `required` | `valid`, `errors`, `required` | ✔ |

- `MinMaxValidator` depends on `RequiredValidator` ✔
    - on render it behaves `strict` only when `required` ✔
    - validation checking outside is always strict ✔
- sub-schema validation/array validation is done by `validateSchema`  ✔ 
    - (todo: new override-prop/more docs)
- **important notice**
    - `type: object` and `type: array` can be handled like the others because of using it valueless ❌
    - this is for performance reasons, a nested object otherwise would trigger a full re-render from it's root-object  
    - use the hook `useSchemaData` within plugins/widgets that need to access it, build a functional component which wraps a memoized component and only push the values needed further on (or nothing)
    - arrays and objects should all be valueless and not only "widget-less objects" ❌
    - arrays should be possible to use `valueless` or `with-value` ❌
        - good for: full array is handled within one small component
        - good for: full array is one-level deep and contains only scalar values

## Plugin List

### DefaultHandler

Checks if the current schema has a defined `default` keyword and it's value is `undefined`, then it sets the store data and renders further on after it was set.

### ValidityReporter

Submits the validity of each widget up to the state hoisted component when it changes.

> Reported format is not like specified in [2019-09#rfc-10.4.2](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.10.4.2), current used is better for performance and the render-validation used.

Checking if invalid scope in a **widget**:

```js
import {isInvalid, useSchemaValidity} from "@ui-schema/ui-schema";

const SomeWidget = ({storeKeys, ...props}) => {
    const {
        validity, onValidity, // must be resolved by hook
        showValidity          // is also added to the props by `ValidityReporter` for ease of access
    } = useSchemaValidity();

    let invalid = isInvalid(validity, storeKeys, false); // Map, List, boolean: <if count>

    return null; // should be the binding component
};
```

>
> the component deletes the invalidation status on its own dismount, resulting in: only mounted components get's validated, this is intended behaviour at the moment!
>

#### validateSchema

```js
import {validateSchema} from '@ui-schema/ui-schema';
```

Exports the validation functions used by the plugins for usage outside of the render tree.

Returns `false` when **no error** was found, otherwise `true` or `List` with errors.

Currently includes the handlers of:

- validateType
- validatePattern
- validateMinMax
- validateMultipleOf
- validateConst
- validateEnum

### DependentHandler

Enables on-the-fly sub-schema rendering based on current data, e.g. show more address fields if a customer is a business.

- keyword `dependencies`, `dependentSchemas` ❌
    - nested combination keywords in here
- must be above HTML-Grid rendering plugin, otherwise the HTML will be nested wrongly ✔
- combining schemas ❌
    - `allOf`
    - `anyOf`
    - `oneOf` ❗
    - `not`
- ❗ only checks some schema: everything [validateSchema](#validateschema) supports
- full feature set needs [ConditionalHandler](#conditionalhandler), [CombiningHandler](#combininghandler), [CombiningNetworkHandler](#combiningnetworkhandler), which are not implemented yet

❗ Dynamically extending a schema is currently supported a little bit with `dependencies` and `oneOf`, interpret `oneOf` like a switch.

❗ Should be moved to group-level 

- create dependencies
- use the properties name which's value should be used
- define a restricting sub-schema for the used property name, if the value is valid against it:
    - the whole sub-schema is added dynamically from that property
    - please note: there will be no schema-change in state, it's property calculated on-render and dynamically rendered parallel to the referencing property

```js
let schema = {
    title: "Person",
    type: "object",
    properties: {
        // here `country` is defined
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
        // here `country` get's a dependency defined
        country: {
            oneOf: [
                // oneOf supports multiple sub-schema, the schema that matches first is used
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

Specifications:
[dependencies](https://json-schema.org/understanding-json-schema/reference/object.html#dependencies)
[combining schemas](https://json-schema.org/understanding-json-schema/reference/combining.html)

### ConditionalHandler

- [conditionals](https://json-schema.org/understanding-json-schema/reference/conditionals.html) ❌
    - `allOf`
    - `if`
    - `else`
    
### CombiningHandler

Combining schemas from within one schema by definition, id, ref, [specification](https://json-schema.org/understanding-json-schema/reference/combining.html)

### CombiningNetworkHandler

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
    const {current, Widget, widgetStack} = props;~~~~~~~~~~~~

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
    
See [how to add custom plugins to the binding](./Widgets.md#adding--overwriting-widgets).

## Docs

- [Overview](../../README.md)
- [UI-JSON-Schema](./Schema.md)
- [Widget System](./Widgets.md)
- [Widget Plugins](./WidgetPlugins.md)
- [Localization / Translation](./Localization.md)
- [Performance](./Performance.md)
