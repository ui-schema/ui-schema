import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translate/t'
import { createEmptyStore } from '@ui-schema/ui-schema/UIStore'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap'
import { UIProvider } from '@ui-schema/ui-schema/UIGenerator/UIGenerator'
import { StoreSchemaType, WidgetsBindingBase } from '@ui-schema/ui-schema'

export const MockWidgets: WidgetsBindingBase = {
    ErrorFallback: () => null,
    RootRenderer: () => null,
    GroupRenderer: () => null,
    pluginStack: [],
    validators: [],
    types: {},
    custom: {},
}

export const MockSchema = createOrderedMap({type: 'object'})

export const MockSchemaProvider = (
    {children, t, widgets, schema}: React.PropsWithChildren<{
        t?: Translator
        widgets: WidgetsBindingBase
        schema: StoreSchemaType
    }>
) => {
    const [store, setStore] = React.useState(() => createEmptyStore(schema && schema.get('type')))

    return <UIProvider
        schema={schema}
        store={store}
        onChange={setStore}
        // @ts-ignore
        widgets={widgets}
        t={t}
    >{children}</UIProvider>
}
