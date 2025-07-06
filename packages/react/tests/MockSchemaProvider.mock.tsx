/**
 * @jest-environment jsdom
 */
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import { ObjectRenderer } from '@ui-schema/react-json-schema/ObjectRenderer'
import { NoWidget } from '@ui-schema/react/NoWidget'
import { OrderedMap } from 'immutable'
import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translator'
import { translateRelative } from '@ui-schema/ui-schema/TranslatorRelative'
import { createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'

export const MockWidgets: BindingTypeGeneric<{
    string?: React.ComponentType<WidgetProps>
    boolean?: React.ComponentType<WidgetProps>
    number?: React.ComponentType<WidgetProps>
    integer?: React.ComponentType<WidgetProps>
    object?: React.ComponentType<WidgetProps>
    array?: React.ComponentType<WidgetProps>
}> = {
    ErrorFallback: () => null,
    GroupRenderer: () => null,
    NoWidget: NoWidget,
    WidgetRenderer: WidgetRenderer,
    widgets: {
        object: ObjectRenderer,
    },
}

const validate = Validator(standardValidators).validate

export const MockSchema: OrderedMap<any, any> = createOrderedMap({type: 'object'})

export const MockSchemaProvider: React.ComponentType<{
    t?: Translator
    widgets: BindingTypeGeneric
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
        binding={widgets}
        t={t || translateRelative}
        validate={validate}
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
    widgets?: BindingTypeGeneric
}>> = (
    {t, widgets, children},
) => {

    return <UIMetaProvider
        // @ts-ignore
        binding={widgets}
        t={t || translateRelative}
        validate={validate}
    >
        {children}
    </UIMetaProvider>
}
