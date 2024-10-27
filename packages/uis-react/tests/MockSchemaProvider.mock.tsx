/**
 * @jest-environment jsdom
 */
import { ObjectRenderer } from '@ui-schema/react-json-schema'
import { NoWidget } from '@ui-schema/react/NoWidget'
import { OrderedMap } from 'immutable'
import React from 'react'
import { Translator } from '@ui-schema/system/Translator'
import { translateRelative } from '@ui-schema/system/TranslatorRelative'
import { createEmptyStore, UIStoreProvider, WithScalarValue } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/system/createMap'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
import { VirtualWidgetRenderer } from '@ui-schema/react/VirtualWidgetRenderer'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'

export const MockWidgets: WidgetsBindingFactory<{}, {
    string?: React.ComponentType<WidgetProps & WithScalarValue>
    boolean?: React.ComponentType<WidgetProps & WithScalarValue>
    number?: React.ComponentType<WidgetProps & WithScalarValue>
    integer?: React.ComponentType<WidgetProps & WithScalarValue>
    object?: React.ComponentType<WidgetProps>
    array?: React.ComponentType<WidgetProps>
}> = {
    ErrorFallback: () => null,
    GroupRenderer: () => null,
    NoWidget: NoWidget,
    VirtualRenderer: VirtualWidgetRenderer,
    widgetPlugins: [WidgetRenderer],
    schemaPlugins: [],
    types: {
        object: ObjectRenderer,
    },
    custom: {},
}

export const MockSchema: OrderedMap<any, any> = createOrderedMap({type: 'object'})

export const MockSchemaProvider: React.ComponentType<{
    t?: Translator
    widgets: WidgetsBindingFactory
    schema: UISchemaMap
}> = (
    {t, widgets, schema},
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
    {t, widgets, children},
) => {

    return <UIMetaProvider
        // @ts-ignore
        widgets={widgets}
        t={t || translateRelative}
    >
        {children}
    </UIMetaProvider>
}
