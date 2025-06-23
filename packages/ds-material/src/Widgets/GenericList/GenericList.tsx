import { List } from 'immutable'
import type { ReactNode } from 'react'
import { memo } from '@ui-schema/react/Utils/memo'
import type { WidgetProps } from '@ui-schema/react/Widgets'
import {
    GenericListContent, GenericListFooter,
    GenericListItem,
    GenericListItemMore, GenericListItemPos,
} from '@ui-schema/ds-material/BaseComponents/GenericList'

export const GenericListContentMemo = memo(GenericListContent)

export const GenericList = (
    {
        value,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        internalValue,
        ...props
    }: WidgetProps,
): ReactNode => {
    // const {store} = useUIStore()
    // const {value} = store?.extractValues<List<any>>(props.storeKeys) || {}
    // extracting and calculating the list size here, not passing down the actual list for performance reasons
    // https://github.com/ui-schema/ui-schema/issues/133
    //
    // note: with v0.5.x values in any type can reach the widget, no extractValues needed anymore,
    // but now you need to take care to not pass down what could cause performance issues;
    // (you can add the old behaviour back with a schemaPlugin or widgetPlugin that omits whatever prop;
    // safest would be a widgetPlugin right before the WidgetRenderer)

    return <GenericListContentMemo
        {...props}
        listSize={List.isList(value) ? value.size : 0}
        ComponentItemPos={GenericListItemPos}
        ComponentItemMore={GenericListItemMore}
        ComponentItem={GenericListItem}
        ComponentFooter={GenericListFooter}
        // e.g. use `Button` instead of `IconButton` for `add-item`
        //btnAddShowLabel
    />
}

