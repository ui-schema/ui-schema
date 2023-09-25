import React from 'react'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'
import { getDisplayName } from '@ui-schema/react/Utils/memo'
import { useUIStore, ExtractValueOverwriteProps, WithValidity } from '@ui-schema/react/UIStore'
import { StoreKeys } from '@ui-schema/system/ValueStore'

export const extractValidity = <P extends WithValidity & { storeKeys: StoreKeys }>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof WithValidity> & ExtractValueOverwriteProps> => {
    const ExtractValidity = (p: Omit<P, keyof WithValidity> & ExtractValueOverwriteProps) => {
        const {store, showValidity} = useUIStore()
        const {onChange} = useUIStoreActions()
        // @ts-ignore
        return <Component
            {...p}
            validity={p.storeKeys.size ? store?.getValidity().getIn(p.storeKeys) : store?.getValidity()}
            onChange={onChange}
            showValidity={p.showValidity || showValidity}
        />
    }
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`
    return ExtractValidity
}
