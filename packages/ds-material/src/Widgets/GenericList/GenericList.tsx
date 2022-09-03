import React from 'react'
import { List } from 'immutable'
import { memo } from '@ui-schema/react/Utils/memo'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { useUIStore, WithOnChange } from '@ui-schema/react/UIStore'
import {
    GenericListContent, GenericListFooter,
    GenericListItem,
    GenericListItemMore, GenericListItemPos,
} from '@ui-schema/ds-material/BaseComponents/GenericList'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/WidgetsBinding'

export const GenericListContentMemo = memo(GenericListContent)

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
        // e.g. use `Button` instead of `IconButton` for `add-item`
        //btnAddShowLabel
    />
}

