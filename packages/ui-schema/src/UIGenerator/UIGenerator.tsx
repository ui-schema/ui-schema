import React from 'react'
import { UIStoreProvider, UIStoreContext } from '@ui-schema/ui-schema/UIStore'
import { UIMetaContext, UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { UIRootRenderer, UIRootRendererProps } from '@ui-schema/ui-schema/UIRootRenderer'

/**
 * Main Component to create a schema based UI generator
 */
export const UIGenerator: React.ComponentType<React.PropsWithChildren<UIMetaContext & UIStoreContext & UIRootRendererProps>> = (
    {
        children,
        ...props
    }
) => (
    <UIProvider {...props}>
        <UIRootRenderer schema={props.schema}/>
        {children}
        {/* providing a dynamic ui context and rendering the root renderer */}
    </UIProvider>
)

export const UIProvider: React.ComponentType<React.PropsWithChildren<UIMetaContext & UIStoreContext>> = (
    {
        children,
        store, onChange,
        widgets, t,
        showValidity,
    }
) => {
    return <UIMetaProvider widgets={widgets} t={t}>
        <UIStoreProvider store={store} onChange={onChange} showValidity={showValidity}>
            {children}
        </UIStoreProvider>
    </UIMetaProvider>
}
