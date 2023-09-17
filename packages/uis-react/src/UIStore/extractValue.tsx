import React from 'react'
import { getDisplayName } from '@ui-schema/react/Utils/memo'
import { useUIStore, WithValue, ExtractValueOverwriteProps } from '@ui-schema/react/UIStore'
import { UIStoreActions, useUIStoreActions } from '@ui-schema/react/UIStoreActions'
import { StoreKeys } from '@ui-schema/system/ValueStore'

export function extractValue<A = UIStoreActions, P extends Partial<WithValue<A>> & { storeKeys: StoreKeys } = Partial<WithValue<A>> & { storeKeys: StoreKeys }>(
    Component: React.ComponentType<P>
): React.ComponentType<Omit<P, keyof WithValue<A>> & ExtractValueOverwriteProps> {
    const ExtractValue = (p: Omit<P, keyof WithValue<A>> & ExtractValueOverwriteProps) => {
        const {store, showValidity} = useUIStore()
        const {onChange} = useUIStoreActions()
        const values = store?.extractValues(p.storeKeys)
        // @ts-ignore
        return <Component
            {...p}
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            showValidity={p.showValidity || showValidity}
            onChange={onChange}
            {...values || {}}
        />
    }
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`
    return ExtractValue
}
