/**
 * @jest-environment jsdom
 */
import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translate/makeTranslator'
import { createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/ui-schema/Utils/createMap'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'
import { WidgetsBindingFactory } from '@ui-schema/react/WidgetsBinding'
import { UIMetaProvider } from '@ui-schema/ui-schema/UIMeta'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { relTranslator } from '@ui-schema/ui-schema/Translate'
import { PluginStack } from '@ui-schema/ui-schema/PluginStack'
import { storeUpdater } from '@ui-schema/ui-schema/storeUpdater'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'

export const MockWidgets: WidgetsBindingFactory = {
    ErrorFallback: () => null,
    GroupRenderer: () => null,
    WidgetRenderer: WidgetRenderer,
    widgetPlugins: [],
    pluginSimpleStack: [],
    types: {},
    custom: {},
}

export const MockSchema = createOrderedMap({type: 'object'})

export const MockSchemaProvider: React.ComponentType<{
    t?: Translator
    widgets: WidgetsBindingFactory
    schema: StoreSchemaType
}> = (
    {t, widgets, schema}
) => {
    // @ts-ignore
    const [store, setStore] = React.useState(() => createEmptyStore(schema && schema.get('type')))

    const onChange = React.useCallback((actions: UIStoreActions[] | UIStoreActions) => {
        setStore(storeUpdater(actions))
    }, [setStore])

    return <UIMetaProvider
        // @ts-ignore
        widgets={widgets}
        t={t || relTranslator}
    >
        <UIStoreProvider
            store={store}
            onChange={onChange}
        >
            <PluginStack isRoot schema={schema}/>
        </UIStoreProvider>
    </UIMetaProvider>
}

export const MockSchemaMetaProvider: React.ComponentType<React.PropsWithChildren<{
    t?: Translator
    widgets?: WidgetsBindingFactory
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
