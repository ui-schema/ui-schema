# Widget Plugins

Plugins are wrapped around each widget/json-schema level and are used to add logic to all. Each plugin should decide if it should do something according to it's props/schema.

## Schema Driven

Plugins that work schema-driven are handling the schema in different ways, these are not used for validation but for creating functionality around the schema - which may influence the validations.

| Plugin                                              | Package              | Handles              | Added Props | Status |
| :---                                                | :---                 | :---                 | :---        | :--- |
| [DefaultHandler](#defaulthandler)                   | @ui-schema/ui-schema | keyword `default`    | - | ✔ |
| [ValidityReporter](#validityreporter)               | @ui-schema/ui-schema | setting validity changes | - | ✔ |
| [DependentHandler](#dependenthandler)               | @ui-schema/ui-schema | keywords `dependencies`, `dependentSchemas` | - | ✔(without property-dependencies) |
| [ConditionalHandler](#conditionalhandler)           | @ui-schema/ui-schema | keywords `allOf`, `if`, `else`, `then` | - | ✔ |
| [CombiningHandler](#combininghandler)               | @ui-schema/ui-schema | keyword `allOf`, `oneOf`, `anyOf`, ... | - | ✔(allOf) ❗ |
| [CombiningNetworkHandler](#combiningnetworkhandler) | @ui-schema/ui-schema | ... | ... | ❌ |

## Validation Plugins

Validation plugins also work schema-driven, but are only used for validation of the values/schema.

| Plugin               | Package              | Validity Fn.         | Handles              | Added Props | Status |
| :---                 | :---                 | :---                 | :---                 | :---        | :--- |
| MinMaxValidator      | @ui-schema/ui-schema | validateMinMax       | min/max validity     | `valid`, `errors` | ✔(string,number,array) ❗ |
| TypeValidator        | @ui-schema/ui-schema | validateType         | keyword `type`       | `valid`, `errors` | ✔ |
| ValueValidatorConst  | @ui-schema/ui-schema | validateConst        | keywords `type`, `const` | `valid`, `errors` | ✔ |
| ValueValidatorEnum   | @ui-schema/ui-schema | validateEnum         | keywords `type`, `enum` | `valid`, `errors` | ✔ |
| PatternValidator     | @ui-schema/ui-schema | validatePattern      | keywords `type:string`, `pattern` | `valid`, `errors` | ✔ |
| MultipleOfValidator  | @ui-schema/ui-schema | validateMultipleOf   | keywords `type:number,integer`, `multipleOf` | `valid`, `errors` | ✔ |
| ArrayValidator       | @ui-schema/ui-schema |                      | `type:array`          | `valid`, `errors` | ✔(partial sub-schema for single sub-schema) ❗ |
| ObjectValidator      | @ui-schema/ui-schema |                      | `type:object`         | ... | ❌ |
| RequiredValidator    | @ui-schema/ui-schema | checkValueExists     | keywords `type:object`, `required` | `valid`, `errors`, `required` | ✔ |

- `MinMaxValidator` depends on `RequiredValidator` ✔
    - on render it behaves `strict` only when `required` ✔
    - strictness: `0` is only invalid when `minimum` is `1` **and** it is `required`, etc.
    - validation checking outside is never strict, this may change (again)
- sub-schema validation/array validation is done by `validateSchema`  ✔ 
    - (todo: new override-prop/more docs)

## Plugin List

### DefaultHandler

Checks if the current schema has a defined `default` keyword and it's value is `undefined`. The value is set directly, the actual store is updated within an effect.

### ValidityReporter

Submits the validity of each widget up to the state hoisted component when it changes.

> Reported format is not like specified in [2019-09#rfc-10.4.2](https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.section.10.4.2), current used is better for performance and the render-validation used.

The component deletes the invalidation status on its own dismount, resulting in: only mounted components get's validated, this is intended behaviour at the moment! JSON-Schema is handled through props calculation at React render flow.

Supplies function: `isInvalid(validity, scope = [], count = false)` to check if some scope e.g. `storeKeys` is invalid.

- return: `0` when **no** error was found, otherwise `1` or more
- `scope` : `{Array|List}` with the keys of which schema level should be searched
- `count` to true will search for the amount of invalids and not end after first invalid

Build around [Editor Invalidity Provider](/docs/core#editor-invalidity-provider).

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

Supports `not` keyword for any validation, see [spec.](https://json-schema.org/understanding-json-schema/reference/combining.html#not). When `not` is specified, it's sub-schema is evaluated and not anything else - (behaviour may change).

### DependentHandler

Enables on-the-fly sub-schema rendering based on single property data and schema, see also [ConditionalHandler](#conditionalhandler).

- keyword `dependencies`, `dependentSchemas`
    - property dependencies, handled as dynamic "is-not-empty then required" [spec](https://json-schema.org/understanding-json-schema/reference/object.html#property-dependencies) ❌
    - schema dependencies [spec](https://json-schema.org/understanding-json-schema/reference/object.html#schema-dependencies) ✔
        - simple: extend the schema when a value is not empty (using `not-empty` instead of `property exists`)
        - `oneOf`: if one of the sub-schemas match, this one is applied, think about it as an `switch`
            - not JSON-Schema standard, for compatibility with [react-jsonschema-form](https://react-jsonschema-form.readthedocs.io/en/latest/dependencies/#dynamic)
- changes the schema dynamically on runtime ✔
- does not re-render the Widget when the dependency matching didn't change ✔
- ❗ only checks some schema: everything [validateSchema](#validateschema) supports
- ❗ partly-merge from dyn-schema: everything [mergeSchema](/docs/core#mergeschema) supports
- ❗ full feature set needs [ConditionalHandler](#conditionalhandler), [CombiningHandler](#combininghandler), [CombiningNetworkHandler](#combiningnetworkhandler), which are not implemented yet

[Specification](https://json-schema.org/understanding-json-schema/reference/conditionals.html)

Example with `oneOf`:

- create dependencies
- use the properties name which's value should be used
- define a restricting sub-schema for the used property name, if the value is valid against it:
    - the whole sub-schema is added dynamically from that property
    - please note: there will be no schema-change in hoisted state, it's property calculated on-render and dynamically changed in the referencing instance

```js
let schema = {
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

Example with schema-dependencies, e.g. with `boolean`:

```js
let schema = {
    type: "object",
    properties: {
        // here `country` is defined
        country_eu: {
            type: "boolean",
        },
        country_canada: {
            type: "boolean",
        }
    },
    dependencies: {
        country_eu: {
            // add boolean input when `canada_eu` is not null
            properties: {
                privacy: {
                    type: "boolean"
                }
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
[dependencies](https://json-schema.org/understanding-json-schema/reference/object.html#dependencies)
[combining schemas](https://json-schema.org/understanding-json-schema/reference/combining.html)

### ConditionalHandler

Enables on-the-fly sub-schema rendering based on current objects data.

- `if` the sub-schema against which the object is validated ✔
- `else` when valid, else is applied ✔
- `then` when invalid, then is applied ✔
- `not` sub-schema that must be invalid ✔
- `allOf` list of if/else/then which are evaluated ✔
    - is handled by [CombiningHandler](#combininghandler)
- ❗ only checks some schema: everything [validateSchema](#validateschema) supports
- ❗ partly-merge from dyn-schema: everything [mergeSchema](/docs/core#mergeschema) supports

Examples:

- [simple/only one](#conditionalhandler-example-simple)
- [complex/multiple](#conditionalhandler-example-complex)
- [using not](#conditionalhandler-example-not)

#### ConditionalHandler Example Simple

Example schema that shows `accept` and makes it required when not selected `canada`. When `canada` is selected a number field is added.1

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
                type: 'string',
                const: "canada"
            }
        }
    },
    then: {
        properties: {
            "maple_trees": {
                type: "number"
            }
        },
    },
    else: {
        properties: {
            "accept": {
                type: "boolean"
            }
        },
        required: [
            "accept"
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
                }
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
                }
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
                }
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
        }
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

Combining schemas from within one schema with:

- `definition` ❌
- `$id` ❌ 
- `$ref` ❌
- `allOf` ✔
    - all defined schemas are merged together
    - each `if/else/then` is applied separately to the instance created or existing
        - uses the merged schema (if something is there to merge)
        - applies result directly after defined `allOf` item or on already existing items
    - supports nested `allOf` evaluation for combining-conditional schemas
- `oneOf` ❗
- `anyOf` ❗
- ❗ only checks some schema: everything [validateSchema](#validateschema) supports
- ❗ partly-merge from dyn-schema: everything [mergeSchema](/docs/core#mergeschema) supports

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
                        }
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
                        }
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
                                }
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
                                }
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
                        }
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
    // special prop which don't reach `Widget`, only for plugins
    const {current} = props;

    // doing some logic
    const newProp = props.schema.get('keyword') ? 'success' : 'error';

    // keep rendering the stack or do something else
    return <NextPluginRenderer {...props} newProp={newProp}/>;// `current` gets `+1` in here
};

export {NewPlugin}
```

- `{current, Widget, widgetStack, ...props}` prop signature of each plugin
- `current` index/current position in stack
- `props` are the props which are getting pushed to the `Widget`
- recommended: use `<NextPluginRenderer {...props} newProp={false}/>` 
    - automatically render the plugins nested
    - `newProp` is available in the widget and the next plugins
    
See also:
- [how to add custom plugins to the binding](/docs/widgets#adding--overwriting-widgets).
- [Editor hooks and HOCs](/docs/core#editorstore) can be used to access any data, keep [performance](/docs/performance) in mind! 
