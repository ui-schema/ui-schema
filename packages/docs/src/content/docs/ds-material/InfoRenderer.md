# InfoRenderer

A component that shows custom information to a user for a schema.

1. Adding it to the widgetsBinding:

```js
import {widgets} from '@ui-schema/ds-material';

const customWidgets = {...widgets}
customWidgets.InfoRenderer = InfoRenderer
```

2. Add the `info` keyword to your component, anything treated as `true` will render the `InfoRenderer`.

## Options

The component can render anything and should support:

- two variants as closed rendering:
    - `icon`, e.g. an `IconButton` with `Info` icon that opens a dialog
    - `preview`, e.g. only render the first line
- two variants as opened rendering:
    - `embed`, should show it e.g. as introduction directly in the page
    - `modal`, should show it e.g. as a dialog
- these are passed down by props and indicate what the best view option would be at their position
    - for further control add e.g. `infoConfig` to the schema and use it inside your `InfoRenderer`

The `InfoRenderer` receives props:

- `schema`: like the widget received it
- `storeKeys`: like the widget received it
- `valid`: like the widget received it
- `errors`: like the widget received it
- `variant`: `icon` or `preview`
- `openAs`: `embed` or `modal`

## Example Component

This component is included in the design system and provides a simple implementation, in a custom you could read it from an API, render markdown and so on.

[Source Code](https://github.com/ui-schema/ui-schema/tree/master/packages/ds-material/src/Component/InfoRenderer)

It uses the `info` keyword to either render it directly `string` or for each line `string[]`.

Example usage:

```typescript jsx
import { React } from 'react'
import { WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { InfoRenderer } from '@ui-schema/ds-material/Component/InfoRenderer'

export const Widget: React.ComponentType<WidgetProps<{}, MuiWidgetBinding> & WithScalarValue> = (
    {
        widgets, schema, valid, errors, storeKeys,
    }
) => {
    const InfoRenderer = widgets?.InfoRenderer
    return <>
        {InfoRenderer && schema?.get('info') ?
            <InfoRenderer
                schema={schema} variant={'icon'} openAs={'modal'}
                storeKeys={storeKeys} valid={valid} errors={errors}
            /> :
            undefined}
    </>
}
```
