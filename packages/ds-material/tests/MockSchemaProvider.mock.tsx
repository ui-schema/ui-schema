/**
 * @jest-environment jsdom
 */
import { standardValidators } from '@ui-schema/json-schema/StandardValidators'
import { Validator } from '@ui-schema/json-schema/Validator'
import React from 'react'
import { Translator } from '@ui-schema/ui-schema/Translator'
import { createEmptyStore, UIStoreProvider } from '@ui-schema/react/UIStore'
import { createOrderedMap } from '@ui-schema/ui-schema/createMap'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { BindingTypeGeneric } from '@ui-schema/react/Widget'
import { UIMetaProvider } from '@ui-schema/react/UIMeta'
import { WidgetRenderer } from '@ui-schema/react/WidgetRenderer'
import { translateRelative } from '@ui-schema/ui-schema/TranslatorRelative'
import { WidgetEngine } from '@ui-schema/react/WidgetEngine'
import { storeUpdater } from '@ui-schema/react/storeUpdater'
import { UIStoreActions } from '@ui-schema/react/UIStoreActions'

export const MockWidgets: BindingTypeGeneric = {
    ErrorFallback: () => null,
    GroupRenderer: () => null,
    widgetPlugins: [],
    WidgetRenderer: WidgetRenderer,
    widgets: {},
}

const validate = Validator(standardValidators).validate

export const MockSchema: any = createOrderedMap({type: 'object'})

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
