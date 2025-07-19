/* eslint-disable @typescript-eslint/no-deprecated */
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'
import * as React from 'react'
import { useUIStoreActions } from '@ui-schema/react/UIStoreActions'
import { getDisplayName } from '@ui-schema/react/Utils/memo'
import { useUIStore, WithValidity } from './UIStoreProvider.js'
import type { ExtractValueOverwriteProps } from './getValues.js'

/**
 * @deprecated will be removed in a future version
 */
export const extractValidity = <P extends WithValidity & { storeKeys: StoreKeys }>(Component: React.ComponentType<P>): React.ComponentType<Omit<P, keyof WithValidity> & ExtractValueOverwriteProps> => {
    const ExtractValidity = (p: Omit<P, keyof WithValidity> & ExtractValueOverwriteProps) => {
        const {store, showValidity} = useUIStore()
        const {onChange} = useUIStoreActions()
        // @ts-expect-error typing not resolvable
        return <Component
            {...p}
            // passing down all of validity, to be able to know if children are invalid
            validity={store?.extractValidity(p.storeKeys)}
            onChange={onChange}
            showValidity={p.showValidity || showValidity}
        />
    }
    ExtractValidity.displayName = `ExtractValidity(${getDisplayName(Component)})`
    return ExtractValidity
}
