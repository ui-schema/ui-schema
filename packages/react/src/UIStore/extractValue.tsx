import React, { ReactNode } from 'react'
import { getDisplayName } from '@ui-schema/react/Utils/memo'
import { StoreKeys, useUIStore, WithValue, ExtractValueOverwriteProps } from '@ui-schema/react/UIStore'
import { UIStoreActions, useUIStoreActions } from '@ui-schema/react/UIStoreActions'

export function extractValue<A = UIStoreActions, P extends Partial<WithValue<A>> & { storeKeys: StoreKeys } = Partial<WithValue<A>> & { storeKeys: StoreKeys }>(
    // not using ComponentType here to solve problems with too strict types from propTypes
    Component: (props: P) => ReactNode,
): (props: Omit<P, keyof WithValue<A>> & ExtractValueOverwriteProps) => ReactNode {
    const ExtractValue = (p: Omit<P, keyof WithValue<A>> & ExtractValueOverwriteProps) => {
        const {store, showValidity} = useUIStore()
        const {onChange} = useUIStoreActions()
        const values = store?.extractValues(p.storeKeys)
        // @ts-expect-error typing not resolvable
        return <Component
            {...p}
            // `showValidity` is overridable by render flow, e.g. nested Stepper
            showValidity={p.showValidity || showValidity}
            onChange={onChange}
            {...values || {}}
            // todo: better interop with directly passing down values if store "is not yet filled"?
            //value={values?.value || p.value}
            //internalValue={values?.internalValue || p.internalValue}
        />
    }
    ExtractValue.displayName = `ExtractValue(${getDisplayName(Component)})`
    return ExtractValue
}
