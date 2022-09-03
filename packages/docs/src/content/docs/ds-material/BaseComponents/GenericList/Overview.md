# DS Material GenericList

Base components for the `GenericList` widget, to easily configure and re-wire the widget parts, see also the [widget docs here](/docs/widgets/GenericList).

```typescript jsx
import React from 'react'
import { List } from 'immutable'
import { memo } from '@ui-schema/ui-schema/Utils/memo'
import { WidgetProps } from '@ui-schema/ui-schema/Widget'
import { useUIStore, WithOnChange } from '@ui-schema/ui-schema/UIStore'
import {
    GenericListContent, GenericListFooter,
    GenericListItem,
    GenericListItemMore, GenericListItemPos,
} from '@ui-schema/ds-material/BaseComponents/GenericList'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'

// it is important to use `memo` from `@ui-schema/ui-schema` for the content component,
// as the generic list will re-render on each change of anything in the store,
// with passing down `listSize` and not other data, the `GenericListContent` will only re-render when the `listSize` changes
export const GenericListContentMemo = memo(GenericListContent)

export const GenericList = (props: WidgetProps<MuiWidgetsBinding> & WithOnChange): React.ReactElement => {
    const {store} = useUIStore()
    // info: `store?.extractValues` is new since `0.3.0-alpha.11` and can be used instead of the `extractValue` HOC
    const {value} = store?.extractValues<List<any>>(props.storeKeys) || {}
    // extracting and calculating the list size here, not passing down the actual list for performance reasons
    // https://github.com/ui-schema/ui-schema/issues/133
    return <GenericListContentMemo
        {...props}
        listSize={value?.size || 0}
        ComponentItemPos={GenericListItemPos}
        ComponentItemMore={GenericListItemMore}
        ComponentItem={GenericListItem}
        ComponentFooter={GenericListFooter}
        // e.g. use `Button` instead of `IconButton` for `add-item`
        //btnAddShowLabel
    />
}
```

Easily define own schema keywords, for options which are only supported by `props`:

```typescript jsx
export const GenericList = (props: WidgetProps<MuiWidgetsBinding> & WithOnChange): React.ReactElement => {
    const {store} = useUIStore()
    const {value} = store?.extractValues<List<any>>(props.storeKeys) || {}
    // extracting and calculating the list size here, not passing down the actual list for performance reasons
    // https://github.com/ui-schema/ui-schema/issues/133
    return <GenericListContentMemo
        {...props}
        listSize={value?.size || 0}
        ComponentItemPos={GenericListItemPos}
        ComponentItemMore={GenericListItemMore}
        ComponentItem={GenericListItem}
        ComponentFooter={GenericListFooter}
        btnAddShowLabel={Boolean(schema.getIn(['view', 'btnAsLabel']))}
    />
}
```

Use the [GenericListContent.tsx](https://github.com/ui-schema/ui-schema/tree/master/packages/ds-material/src/BaseComponents/GenericList/GenericListContent.tsx) as a starting point if you need to further adjust the widget parts.

## Translation / Labels

- `labels.add-item` used by `GenericListFooter` for the add-button, supports named-labels key `add`
- `labels.remove-item` used by `GenericListItemMore` for the delete-button, supports named-labels key `remove`
- `labels.move-to-position` used by `GenericListItemPos` to render the up/down buttons, adds the context `nextIndex` to render to-which-position it will be moved
- `labels.entry` used by `GenericListItemPos` as `sr-only` for the nth-label

**Notices:**

- `sr-only` = `screen-reader-only` text `span` for a11y
- supports named-label: uses the `context` to pass down `actionLabels` for a not-generic-labelling, the given key is the intended action-key for the label

For `actionLabels` handling, see [dictionary/en/labels](https://github.com/ui-schema/ui-schema/tree/master/packages/dictionary/src/en/labels.js) as an example.

Example schema structure that activates `actionLabels`, with support for multiple languages and different buttons:

```json
{
    "type": "object",
    "widget": "GenericList",
    "listActionLabels": {
        "en": {
            "add": "New event",
            "remove": "Remove event"
        },
        "de": {
            "add": "Neue Veranstaltung",
            "remove": "Lösche Veranstaltung"
        }
    }
}
```

## Components

### GenericListContent

The list renderer component, uses the components passed down per `props` to build the needed list out of the `listSize` - it does not receive any data from the list.

`GenericListContentProps`:

- `btnAddShowLabel`: `boolean`, for the add-item button, when `true` displays a normal button and not only an icon-button
- `btnAddStyle`: `React.CSSProperties`, for the add-item button, custom react styles
- `ComponentItemPos`: `React.ComponentType<GenericListItemSharedProps>`, will be rendered in `ComponentItem`, contains the position and up/down buttons
- `ComponentItemMore`: `React.ComponentType<GenericListItemSharedProps>`, will be rendered in `ComponentItem`, contains the delete button
- `ComponentItem`: `React.ComponentType<GenericListItemProps>`, is rendered per item in the list, responsible to further render nested schema, also uses component props
- `ComponentFooter`: `React.ComponentType<GenericListFooterProps>`, will be rendered in `GenericListContent`, contains the add-button
- `listSize`: `number`, the size of the list
- `schemaKeys`: `StoreKeys`, experimental [#104](https://github.com/ui-schema/ui-schema/issues/104)
- `listSpacing`: `GridSpacing`, used as the spacing for the item-list

### GenericListItem

For props check typings.

### GenericListItemPos

For props check typings.

### GenericListItemMore

For props check typings.

### GenericListFooter

For props check typings.
