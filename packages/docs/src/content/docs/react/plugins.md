---
docModule:
    package: '@ui-schema/react'
    modulePath: "react/src/"
    files:
        - "ExtractStorePlugin/*"
        - "ValidityReporter/*"
---

# Widget Plugins

Widget Plugins are standard React components rendered for each widget prior to rendering the `binding.WidgetRenderer`.

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
- [`UIStoreContext`/`UIConfigContext`](/docs/core-store) and [`UIMetaContext`](/docs/core-meta) hooks, HOCs and utils can be used to access, update, delete, move any data, keep [performance](/docs/performance) in mind!

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

Also check the `UIStore.extractValues(storeKeys)` function for custom extractions.
