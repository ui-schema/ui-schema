import React from 'react'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'
import { getDisplayName } from '@ui-schema/react/Utils/memo'
import { StoreKeys, useUIStore, ExtractValueOverwriteProps, WithValidity, addNestKey } from '@ui-schema/react/UIStore'

export const extractValidity = <P extends WithValidity & { storeKeys: StoreKeys }>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof WithValidity> & ExtractValueOverwriteProps> => {
    const ExtractValidity = (p: Omit<P, keyof WithValidity> & ExtractValueOverwriteProps) => {
        const {store, showValidity} = useUIStore()
        const {onChange} = useUIStoreActions()
        // @ts-expect-error typing not resolvable
        return <Component
            {...p}
            // passing down all of validity, to be able to know if childs are invalid
            validity={p.storeKeys.size ? store?.getValidity()?.getIn(addNestKey('children', p.storeKeys)) : store?.getValidity()}
            onChange={onChange}
            showValidity={p.showValidity || showValidity}
        />
    }
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`
    return ExtractValidity
}
