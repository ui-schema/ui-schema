/**
 * @jest-environment jsdom
 */
import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translate/makeTranslator'
import { createEmptyStore } from '@ui-schema/ui-schema/UIStore'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap'
import { UIProvider } from '@ui-schema/ui-schema/UIGenerator'
import { UIRootRenderer } from '@ui-schema/ui-schema/UIRootRenderer'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetsBindingBase } from '@ui-schema/ui-schema/WidgetsBinding'
import { relTranslator, UIMetaProvider, WidgetRenderer } from '@ui-schema/ui-schema'

export const MockWidgets: WidgetsBindingBase = {
    ErrorFallback: () => null,
    RootRenderer: () => null,
    GroupRenderer: () => null,
    WidgetRenderer: WidgetRenderer,
    pluginStack: [],
    pluginSimpleStack: [],
    types: {},
    custom: {},
}

export const MockSchema = createOrderedMap({type: 'object'})

export const MockSchemaProvider: React.ComponentType<{
    t?: Translator
    widgets: WidgetsBindingBase
    schema: StoreSchemaType
}> = (
    {t, widgets, schema}
) => {
    // @ts-ignore
    const [store, setStore] = React.useState(() => createEmptyStore(schema && schema.get('type')))

    return <UIProvider
        store={store}
        onChange={setStore}
        // @ts-ignore
        widgets={widgets}
        t={t || relTranslator}
    >
        <UIRootRenderer schema={schema}/>
    </UIProvider>
}

export const MockSchemaMetaProvider: React.ComponentType<React.PropsWithChildren<{
    t?: Translator
    widgets?: WidgetsBindingBase
}>> = (
    {t, widgets, children}
) => {

    return <UIMetaProvider
        // @ts-ignore
        widgets={widgets}
        t={t || relTranslator}
    >
        {children}
    </UIMetaProvider>
}
