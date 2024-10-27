/**
 * @jest-environment jsdom
 */
import React from 'react'
import { Translator } from '@ui-schema/system/Translator'
import { translateRelative } from '@ui-schema/system/TranslatorRelative'
import { createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'

export const MockWidgets: WidgetsBindingFactory = {
    ErrorFallback: () => null,
    GroupRenderer: () => null,
    NoWidget: () => null,
    VirtualRenderer: VirtualWidgetRenderer,
    widgetPlugins: [WidgetRenderer],
    schemaPlugins: [],
    types: {},
    custom: {},
}

export const MockSchema = createOrderedMap({type: 'object'})

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
