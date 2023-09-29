import React from 'react'
import { useUIStore, WithValue } from '@ui-schema/react/UIStore'
import { DecoratorPropsNext, ReactBaseDecorator } from '@tactic-ui/react/Deco'
import { StoreKeys } from '@ui-schema/system/ValueStore'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'

export interface ExtractStorePluginProps {
    storeKeys: StoreKeys
    showValidity?: boolean
}

/**
 * @todo add support for memo next component again
 */
export function ExtractStorePlugin<P extends DecoratorPropsNext>(props: P & ExtractStorePluginProps): React.ReactElement<P & WithValue> {
    const Next = props.next(props.decoIndex + 1) as ReactBaseDecorator<P & WithValue>
    const {store, showValidity} = useUIStore()
    const {onChange} = useUIStoreActions()
    if (!store) {
        throw new Error('UIStore is missing, check the UIStoreProvider')
    }

    const values = store.extractValues(props.storeKeys)
    return <Next
        {...props}
        // `showValidity` is overridable by render flow, e.g. nested Stepper
        showValidity={props.showValidity || showValidity}
        onChange={onChange}
        decoIndex={props.decoIndex + 1}
        {...values || {}}
    />
}
