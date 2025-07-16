---
docModule:
    package: '@ui-schema/ui-schema'
    modulePath: "ui-schema/src/"
    files:
        - "SchemaPlugin/*"
        - "SchemaPluginStack/*"
---

# Schema Plugins

Schema plugins are just functions, they can't change the React render-flow, but can change any `props`.

> See [SchemaPluginsAdapter](/docs/react/schemapluginsadapter) for how to use them in the React `binding`.

> Working with validation? Check out the new [json-schema validators](/docs/json-schema/validators). They're designed for ui-schemas incremental validation and merging of rules across fields.

## SchemaPluginStack

Executes the schema plugins, one after another.

Can be used to build own / further simple plugin stacks:

```typescript
import { SchemaPluginStack } from '@ui-schema/ui-schema/SchemaPluginStack'

const schemaPlugins = [
    // add SchemaPlugins here
]

// initial WidgetPluginProps, that is WidgetProps + injected context
const props = {/* storeKeys, schema, parentSchema, value, ... */}

const resource = undefined // optional SchemaResource, to support $ref

// resulting WidgetPluginProps
const changedProps = SchemaPluginStack({resource, ...props}, schemaPlugins)
```

## Create a Schema Plugin

A schema plugin is a JS-Object with a `handle` function that is called for each schema level. They are not a React component, they can not control the render-flow or use hooks!

Each function receives the props the actual widget component receives, the return object of `noHandle` and `handle` is shallow-merged into the current props. Adding e.g. new or changed properties to the actual widget.

- `handle`: only run when it `should`, must return `object` or `null`
- *(deprecated)* `should`: optional checker if the `handle` function should do something
- *(deprecated)* `noHandle`: gets run when it `should not` be handling, must return `object`

```js
import { OrderedMap, List } from 'immutable'

// Simple plugin for a custom `sortOrder` json-schema keyword.
const SortPlugin = {
    handle: ({schema}) => {

        // return null or an empty object to skip this plugin
        const sortOrder = schema.get('sortOrder');
        if(List.isList(!sortOrder)) return null;

        const properties = schema.get('properties');
        if(OrderedMap.isOrderedMap(properties)) return {};

        // return the properties which this plugin changes
        return {
            schema: schema.set(
                'properties',
                sortOrder.reduce(
                    (properties, key) =>
                        properties.set(key, schema.getIn(['properties', key])),
                    OrderedMap(),
                )
            )
        }

    },

    // (deprecated)
    should: (props) => {
        return shouldSort ? true : false;
    },
    // (deprecated)
    noHandle: (props) => ({newProp: false}),
};
```
