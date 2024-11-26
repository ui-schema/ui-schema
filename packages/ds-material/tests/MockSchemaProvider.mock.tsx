/**
 * @jest-environment jsdom
 */
import React from 'react'
import { Translator } from '@ui-schema/system/Translator'
import { createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { translateRelative } from '@ui-schema/system/TranslatorRelative'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'

export const MockWidgets: WidgetsBindingFactory = {
    ErrorFallback: () => null,
    GroupRenderer: () => null,
    widgetPlugins: [WidgetRenderer],
    schemaPlugins: [],
    types: {},
    custom: {},
}

export const MockSchema: any = createOrderedMap({type: 'object'})

export const MockSchemaProvider: React.ComponentType<{
    t?: Translator
    widgets: WidgetsBindingFactory
    schema: UISchemaMap
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
        t={t || translateRelative}
    >
        <UIStoreProvider
            store={store}
            onChange={onChange}
        >
            <WidgetEngine isRoot schema={schema}/>
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
        t={t || translateRelative}
    >
        {children}
    </UIMetaProvider>
}
