import React from 'react'
import { UIStoreProvider, UIStoreContext } from '@ui-schema/ui-schema/UIStore'
import { UIMetaContext, UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { UIRootRenderer, UIRootRendererProps } from '@ui-schema/ui-schema/UIRootRenderer'
import { UIStoreActionsContext } from '@ui-schema/ui-schema/UIStoreActions'

/**
 * Main Component to create a schema based UI generator
 * @deprecated use the provider setup directly [migration notes](https://ui-schema.bemit.codes/updates/v0.3.0-v0.4.0#deprecations)
 */
export const UIGenerator: React.ComponentType<React.PropsWithChildren<UIMetaContext & UIStoreContext & UIStoreActionsContext & UIRootRendererProps>> = (
    {
        children,
        ...props
    }
) => (
    // eslint-disable-next-line deprecation/deprecation
    <UIProvider {...props}>
        {/* eslint-disable-next-line deprecation/deprecation */}
        <UIRootRenderer schema={props.schema}/>
        {children}
        {/* providing a dynamic ui context and rendering the root renderer */}
    </UIProvider>
)

/**
 * @deprecated use the provider setup directly [migration notes](https://ui-schema.bemit.codes/updates/v0.3.0-v0.4.0#deprecations)
 */
export const UIProvider: React.ComponentType<React.PropsWithChildren<UIMetaContext & UIStoreContext & UIStoreActionsContext>> = (
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
