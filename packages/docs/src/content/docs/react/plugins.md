---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    files:
        - "CombiningHandler/*"
        - "ConditionalHandler/*"
        - "DefaultHandler/*"
        - "DependentHandler/*"
        - "ExtractStorePlugin/*"
        - "InjectSplitSchemaPlugin/*"
        - "ValidityReporter/*"
---

# Widget Plugins

Widget Plugins are standard React components, rendered for each widget prior to rendering the `binding.WidgetRenderer`.

```typescript jsx
// typing:
import { PluginProps, PluginType } from "@ui-schema/ui-schema/PluginStack/Plugin"
```

## Create a Widget Plugin

Each plugin can use `props` and the schema to change or add properties to the final widget, change the render behaviour, do asynchronous actions or whatever React and JS allows.

Creating a plugin like:

```jsx
import React from "react";
import { NextPluginMemo } from '@ui-schema/react/WidgetEngine'

const NewPlugin = ({Next, ...props}) => {
    // doing some logic (for such simple logic use a schemaPlugin!)
    const newProp = props.schema.get('keyword') ? 'success' : 'error';

    // render the next plugin, and add/modify any prop you want
    return <Next.Component {...props} newProp={newProp}/>;

    // or use util to render it memoized
    return <NextPluginMemo {...props} newProp={newProp}/>;
};
```

- `{Next, ...props}` prop signature of each plugin
- `Next` object of the next plugin to render
    - with `Next.Component` being the next plugin or the final `binding.WidgetRenderer`
- `props` are the props which are getting pushed to the `Widget`
- recommended: use `getNextPlugin()` for getting the next to render plugin
    - automatically render the plugins nested
    - `newProp` is available in the widget and the next plugins

Design system binding in `widgets.widgetPlugins`.

See also:

- [how to add custom plugins to the binding](/docs/widgets#adding--overwriting-widgets)
- [`UIStoreContext`/`UIConfigContext`](/docs/react/store) and [`UIMetaContext`](/docs/react/meta) hooks, HOCs and utils can be used to access, update, delete, move any data, keep [performance](/docs/performance) in mind!

## Included Widget Plugins

- [DefaultHandler](#defaulthandler)
- [ValidityReporter](#validityreporter)
- [ExtractStorePlugin](#extractstoreplugin)

### DefaultHandler

```js
import { DefaultHandler } from '@ui-schema/ui-schema/Plugins/DefaultHandler';
````

Applies the `default` keyword and handles persistence of "has-done-default", turn of default handling with the prop `doNotDefault={true}` in `UIConfigContext`/`UIStoreProvider`.

Will only apply default when:

- `default` keyword exists and default value is `not-undefined`
- `doNotDefault` is `not-true`
- `readOnly` and `schema.get('readOnly')` are `not-true`
- no-default-applied-already marker for the current `store` position
- `value` is `not-undefined`

Will mark "has-done-default" when:

- `default` keyword exists and default value is `not-undefined`
- no-default-applied-already marker for the current `store` position

Only when it applies the `default`, the store will get the flag `Store.internals.%storeKeys%.defaultHandled`.

Will start again when `default` was `undefined`, not handled beforehand, then changes to `not-undefined`.

Does not reset the flag when the widget unmounts, thus does not re-apply default, once it was marked and the store was not cleared.

### ValidityReporter

```js
import { ValidityReporter, isInvalid } from '@ui-schema/ui-schema/ValidityReporter';
````

Submits the validity of each widget up to the state hoisted component when it changes.

> Reported format is not like specified in [2019-09#rfc-10.4.2](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.10.4.2), current used is better for performance and the render-validation used.

The component deletes the invalidation status on its own dismount, resulting in: only mounted components get's validated, this is intended behaviour at the moment! JSON-Schema is handled through props calculation at React render flow.

Supplies function: `isInvalid(validity, count = false)` to check if a validity node contains an invalid node.

- return: `0` when **no** error was found, otherwise `1` or more
- `count` to true will search for the amount of invalids and not end after first invalid

#### ValidationErrors

Is a Record containing all errors for the current widget/plugin stack, each new widget-tree receives a new instance - thus containing only the errors for the current widget.

Except e.g. `array`, where errors for keyword `items` are also on the `array` not only on the single item widgets.

The `errors` property is an instance of this type.

- `errCount`: `number`
- `errors`: `Map<{}, undefined>`
- `childErrors`: `Map<{}, undefined>`
- `errorsToJS`: `() => any`
- `hasError`: `(type?: string) => boolean`
- `addError`: `(type: string, context?: Map<any, any>) => ValidatorErrorsType`
- `addErrors`: `(errors: ValidatorErrorsType) => ValidatorErrorsType`
- `getError`: `(type: string) => List<any>`
- `getErrors`: `() => Map<{ [key: string]: List<any> }, undefined>`
- `addChildError`: `(type: string, context?: Map<any, any>) => ValidatorErrorsType`
- `addChildErrors`: `(errors: ValidatorErrorsType) => ValidatorErrorsType`
- `getChildError`: `(type: string) => List<any>`
- `getChildErrors`: `() => Map<{ [key: string]: List<any> }, undefined>`

```js
import { Map } from "immutable"
import { createValidatorErrors, ERROR_NOT_SET } from "@ui-schema/ui-schema"

errors = errors.addError(ERROR_NOT_SET)

// with context, e.g. for detailed error messages
errors = errors.addError(ERROR_NOT_SET, Map({}))

errors.hasError(ERROR_NOT_SET) // true!
errors.hasError('custom-error') // false!

typeErrors = errors.getError(ERROR_NOT_SET)

console.log(errors.errCount) // 2

typeErrors.forEach(errorContext => {
    // multiple errors for the same type
    // maybe different contexts, the context is a `Map`, even when empty
    let info = errorContext.get('info')
    if(info) {
    } else {
    }
})

let tmpError = createValidatorErrors() // create an empty Record
tmpError.addErrors(errors) // add the errors of e.g. another validation function to the actual errors
```

### ExtractStorePlugin

Default plugin to extract the store values for one schema-level, using the HOC `extractValue`.

**Included in `widgets.widgetPlugins` by default.**

> the PluginProps/extractValue typing is a bit unstable atm. [issue #91](https://github.com/ui-schema/ui-schema/issues/91)

## Legacy Widget Plugins

The following are legacy which plugins, which are included in validators in v0.5.x.

> These plugins are deprecated and will be removed in a future version.

Widget plugins which work with **default JSON-Schema keywords**:

| Plugin                                                  | Package              | Handles                                                          | Added Props | Status       |
|:--------------------------------------------------------| :---                 |:-----------------------------------------------------------------| :---        |:-------------|
| [DependentHandler](#dependenthandler)                   | @ui-schema/ui-schema | keywords `dependencies`, `dependentSchemas`, `dependentRequired` | - | ✔            |
| [ConditionalHandler](#conditionalhandler)               | @ui-schema/ui-schema | keywords `allOf`, `if`, `else`, `then`, `not`                    | - | ✔            |
| [CombiningHandler](#combininghandler)                   | @ui-schema/ui-schema | keyword `allOf`                                                  | - | ✔            |
| [ReferencingHandler](#referencinghandler)               | @ui-schema/ui-schema | keywords `$defs`, `$anchor`, `$id`, `$ref` ...                   | ... | ✔            |
| [ReferencingNetworkHandler](#referencingnetworkhandler) | @ui-schema/ui-schema | keywords `$ref`                                                  | ... | ✔            |

- [DependentHandler](#dependenthandler)
- [ConditionalHandler](#conditionalhandler)
- [CombiningHandler](#combininghandler)
- [ReferencingHandler](#referencinghandler)
- [ReferencingNetworkHandler](#referencingnetworkhandler)
- [InjectSplitSchemaPlugin](#injectsplitschemaplugin)

### DependentHandler

```js
import {DependentHandler} from '@ui-schema/ui-schema/Plugins/DependentHandler';
````

Enables on-the-fly sub-schema rendering based on single property data and schema, see also [ConditionalHandler](#conditionalhandler).

- keyword `dependencies`, `dependentSchemas`, `dependentRequired`
    - property dependencies [spec](https://json-schema.org/understanding-json-schema/reference/conditionals.html#property-dependencies)
    - schema dependencies [spec](https://json-schema.org/understanding-json-schema/reference/conditionals.html#schema-dependencies)
        - simple: extend the schema when a value is not set (using `property exists` check enforces usage of `deleteOnEmpty` or `required` keywords)
- changes the schema dynamically on runtime
- does not re-render the Widget when the dependency matching didn't change

[Specification](https://json-schema.org/understanding-json-schema/reference/conditionals.html)

Example with schema-dependencies, e.g. with `boolean`:

```js
let schema = {
    type: "object",
    properties: {
        // here `country` is defined
        country_eu: {
            type: "boolean",
            // use for deleting the property when `false`, for correct UX behaviour
            deleteOnEmpty: true,
        },
        country_canada: {
            type: "boolean",
            // use for deleting the property when `false`, for correct UX behaviour
            deleteOnEmpty: true,
        }
    },
    dependencies: {
        country_eu: {
            // add boolean input when `canada_eu` is not null
            properties: {
                privacy: {
                    type: "boolean",
                    const: true,
                },
            },
            required: [
                "privacy"
            ]
        },
        country_canada: {
            properties: {
                maple_trees: {
                    type: "number"
                }
            }
        }
    }
};
```

Specifications:
[dependencies](https://json-schema.org/understanding-json-schema/reference/conditionals.html#dependencies)
[combining schemas](https://json-schema.org/understanding-json-schema/reference/combining.html)

### ConditionalHandler

```js
import {ConditionalHandler} from '@ui-schema/ui-schema/Plugins/ConditionalHandler';
````

Enables on-the-fly sub-schema rendering based on current objects data.

- `if` the sub-schema against which the value is validated [spec](https://json-schema.org/understanding-json-schema/reference/conditionals.html#if-then-else)
- `else` when valid, else is applied
- `then` when invalid, then is applied
- `not` sub-schema that must be invalid
- `allOf` list of if/else/then which are evaluated
    - is handled by [CombiningHandler](#combininghandler)

Examples:

- [simple/only one](#conditionalhandler-example-simple)
- [complex/multiple](#conditionalhandler-example-complex)
- [using not](#conditionalhandler-example-not)

#### ConditionalHandler Example Simple

Example schema that shows `accept` and makes it required when not selected `canada`. When `canada` is selected a number field is added.1

```js
const schemaWConditional = createOrderedMap({
    type: 'object',
    properties: {
        country: {
            type: 'string',
            widget: 'Select',
            enum: [
                'usa',
                'canada',
                'eu',
            ],
            default: 'eu',
        },
    },
    required: [
        'country',
    ],
    if: {
        properties: {
            'country': {
                type: 'string',
                const: 'canada',
            },
        },
        required: ['country'],
    },
    then: {
        properties: {
            'maple_trees': {
                type: 'number',
            },
        },
    },
    else: {
        properties: {
            'accept': {
                type: 'boolean',
                const: true,
            },
        },
        required: [
            'accept',
        ],
    }
});
```

#### ConditionalHandler Example Complex

Example using `allOf`, every item is applied in the defined order like above `if/else/then`, multiple changes of the same schema-level will get merged together.

```js
const schemaWConditional = createOrderedMap({
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
    allOf: [
        {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "canada"
                    }
                },
                required: ['country'],
            },
            then: {
                properties: {
                    "maple_trees": {
                        type: "number"
                    }
                },
            }
        }, {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "eu"
                    }
                },
                required: ['country'],
            },
            then: {
                properties: {
                    "privacy": {
                        type: "boolean"
                    }
                }
            }
        }, {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "usa"
                    }
                },
                required: ['country'],
            },
            then: {
                properties: {
                    "nickname": {
                        type: "string"
                    }
                },
            }
        }
    ]
});
```

#### ConditionalHandler Example Not

Example using `not` to display the `accept` input only when not `usa` is selected:

```js
const schemaWConditional = createOrderedMap({
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
    if: {
        properties: {
            "country": {
                not: {
                    type: 'string',
                    const: "usa"
                }
            }
        },
        required: ['country'],
    },
    then: {
        properties: {
            "accept": {
                type: "boolean"
            }
        },
    }
});
```

[Specification](https://json-schema.org/understanding-json-schema/reference/conditionals.html)

### CombiningHandler

```js
import {CombiningHandler} from '@ui-schema/ui-schema/Plugins/CombiningHandler';
````

Combining schemas from within one schema with:

- `allOf`
    - all defined schemas are merged together
    - each `if/else/then` is applied separately to the instance created or existing
        - uses the merged schema (if something is there to merge)
        - applies result directly after defined `allOf` item or on already existing items
    - supports nested `allOf` evaluation for combining-conditional schemas
- `oneOf` ❗
- `anyOf` ❗

Works in conjunction with the [conditional handler](#conditionalhandler).

[Specification](https://json-schema.org/understanding-json-schema/reference/combining.html)

```js
const schemaWCombining = createOrderedMap({
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
        },
        address: {
            allOf: [
                {
                    type: "object",
                    properties: {
                        street_address: {type: "string"},
                        city: {type: "string"},
                        state: {type: "string"}
                    },
                    required: ["street_address", "city", "state"],
                    if: {
                        properties: {
                            "state": {
                                type: 'string',
                                const: "rlp"
                            }
                        },
                        required: ['state'],
                    },
                    then: {
                        properties: {
                            "zip": {
                                type: "number"
                            }
                        },
                    },
                }, {
                    type: "object",
                    properties: {
                        phone: {type: "string"},
                        email: {type: "string", format: "email"},
                    },
                    required: ["email"],
                    if: {
                        properties: {
                            "phone": {
                                type: 'string',
                                minLength: 6,
                            }
                        },
                        required: ['phone'],
                    },
                    then: {
                        properties: {
                            "phone": {
                                // only valid for: (888)555-1212 or 555-1212
                                pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
                            }
                        },
                    },
                }
            ]
        }
    }
});
```

Example with multiple `if`, nested `allOf`:

```ui-schema
{
    "type": "object",
    "properties": {
        "country": {
            "type": "string",
            "widget": "Select",
            "enum": [
                "usa",
                "canada",
                "eu"
            ],
            "default": "eu"
        },
        "address": {
            "allOf": [
                {
                    "type": "object",
                    "properties": {
                        "street_address": {"type": "string"},
                        "city": {"type": "string"},
                        "state": {"type": "string", "widget": "Select", "enum": ["rlp", "ny", "other"]}
                    },
                    "required": ["street_address", "city", "state"],
                    "allOf": [
                        {
                            "if": {
                                "properties": {
                                    "state": {
                                        "type": "string",
                                        "const": "rlp"
                                    }
                                },
                                "required": ["state"]
                            },
                            "then": {
                                "properties": {
                                    "zip": {
                                        "type": "number"
                                    }
                                }
                            }
                        }, {
                            "properties": {
                                "accept": {
                                    "type": "boolean"
                                }
                            }
                        }, {
                            "if": {
                                "properties": {
                                    "state": {
                                        "type": "string",
                                        "const": "ny"
                                    }
                                },
                                "required": ["state"]
                            },
                            "then": {
                                "properties": {
                                    "block": {
                                        "type": "string",
                                        "maximum": 15
                                    }
                                }
                            }
                        }
                    ]
                }, {
                    "type": "object",
                    "properties": {
                        "phone": {"type": "string"},
                        "email": {"type": "string", "format": "email"}
                    },
                    "required": ["email"],
                    "if": {
                        "properties": {
                            "phone": {
                                "type": "string",
                                "minLength": 6
                            }
                        },
                        "required": ["phone"]
                    },
                    "then": {
                        "properties": {
                            "phone": {
                                "pattern": "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
                            }
                        }
                    }
                }
            ]
        }
    }
}
```

### ReferencingHandler

Combining schemas from inside a schema by using references, [specification](https://json-schema.org/understanding-json-schema/structuring.html#the-id-property).

> Network references require the additional provider `UIApiProvider`

Supports:

- `definition`/`$defs` to define schemas with identification keywords `$id`, `id`, `$anchor`
- `$ref` as selector for `$defs`
- `$ref` with relative (needs `$id/id` above) and absolute URLs
- `$ref` with JSON-Pointer selectors

Supports conditionals up to three levels, otherwise when the conditional get's rendered it supports endless recursion. Only renders the next level when no data exists, allows recursive usage without endless loops.

Uses the `ReferencingNetworkHandler` hook `useNetworkRef` to handle resolving, which uses `UIApi` to load the schema.

### ReferencingNetworkHandler

> Deprecated, not needed anymore, just use `ReferencingHandler`
>
> Loads the first/root reference of a schema level, also done by `ReferencingHandler`, but not beforehand parsing.
>
> **Not added in default `widgetPlugins`, needs the additional provider `UIApiProvider`**

Plugin allows loading schemas from external APIs, uses the [UIApi](/docs/core-uiapi#uiapi) component to handle the schema loading and caching.

- merging resolved ref with current schema, using mergeDeep
    - but not with `$ref` for recursion protection
    - without `version`, to be sure to get the latest `version`

Add to plugin stack:

```jsx
const widgetPlugins = [...widgets.widgetPlugins]
widgetPlugins.splice(1, 0, ReferencingNetworkHandler)
widgets.widgetPlugins = widgetPlugins
```

### InjectSplitSchemaPlugin

Uses a separate style schema and merges it into the matching data schema.

> **Currently works with the `storeKeys`, thus data keys.**
>
> **Alpha version**

Adding the plugin to default widget binding, using Typescript:

```typescript jsx
import { widgets } from '@ui-schema/ds-material'
import { InjectSplitSchemaPlugin, InjectSplitSchemaRootContext } from '@ui-schema/ui-schema/Plugins/InjectSplitSchemaPlugin'

const customWidgets = {...widgets}
const widgetPlugins = [...customWidgets.widgetPlugins]
// the InjectSplitSchema should be after the ReferencingHandler
widgetPlugins.splice(1, 0, InjectSplitSchemaPlugin)
customWidgets.widgetPlugins = widgetPlugins

const schemaData = createOrderedMap({
    // id is not needed when using the `rootContext` prop
    //id: 'https://example.org/schema/split-schema',
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        postal_code: {
            type: 'string',
        },
        city: {
            type: 'string',
        },
    },
    required: ['name', 'postal_code'],
})

const schemaStyle = createOrderedMap({
    '': {
        widget: 'FormGroup',
        title: 'Address',
    },
    '/name': {
        view: {
            sizeMd: 12,
        },
    },
    '/postal_code': {
        view: {
            sizeMd: 3,
        },
    },
    '/city': {
        view: {
            sizeMd: 9,
        },
    },
} as { [k: string]: UISchema })

// keep the `rootContext` reference integration!
// e.g. be sure it does not force a re-render of UIRootRenderer with `React.useMemo` and maybe `useImmutable`
const rootContext: InjectSplitSchemaRootContext = {schemaStyle: schemaStyle as UISchemaMap}

const Main = () => {
    const [showValidity, setShowValidity] = React.useState(false)

    const [store, setStore] = React.useState((): UIStoreType => createStore(OrderedMap()))

    const onChange = React.useCallback((actions) => {
        setStore((prevStore: UIStoreType) => {
            return storeUpdater(actions)(prevStore)
        })
    }, [setStore])

    return <UIStoreProvider
        store={store}
        onChange={onChange}
        showValidity={showValidity}
    >
        <UIRootRenderer<InjectSplitSchemaRootContext> schema={schemaData} rootContext={rootContext}/>
    </UIStoreProvider>
}
```
