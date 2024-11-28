import { UIMetaContext } from '@ui-schema/react/UIMeta'
import React from 'react'
import { WidgetEngine, WidgetEngineInjectProps, WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'
import { getDisplayName, memo } from '@ui-schema/react/Utils/memo'
import { StoreKeys, WithValue } from '@ui-schema/react/UIStore'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { WidgetProps, WidgetsBindingFactory } from '@ui-schema/react/Widgets'
// import { UIMetaContext } from '@ui-schema/react/UIMeta'

export type WidgetEngineRootProps = {
    isRoot: true
}

export type WidgetEngineNestedProps = {
    isRoot?: false
    // all indices of the current widget, must be set for nested plugins
    storeKeys: StoreKeys
    schemaKeys?: StoreKeys
    // `parentSchema` will only be `undefined` in the root level of a schema
    // todo: should this be typed differently between "props/passing-down" and "consuming/usages"?
    parentSchema: UISchemaMap | undefined
}

export type WidgetEngineRootOrNestedProps =
    WidgetEngineRootProps |
    WidgetEngineNestedProps

// todo: add also generic widgets here?
export type AppliedWidgetEngineProps<CMeta = UIMetaContext, W = WidgetsBindingFactory, PWidget extends WidgetProps<W> = WidgetProps<W>> =
    Omit<PWidget, WidgetEngineInjectProps | keyof CMeta | keyof WithValue>
    // Omit<PWidget, WidgetEngineInjectProps | keyof (UIMetaContext<W> & CMeta) | keyof WithValue>
    // & Partial<UIMetaContext<W> & CMeta>
    & Partial<CMeta>
    & Partial<Pick<PWidget, 'showValidity'>>
    & WidgetEngineRootOrNestedProps

export function applyWidgetEngine<CMeta = UIMetaContext, W = WidgetsBindingFactory, PWidget extends WidgetProps<W> = WidgetProps<W>>(
    CustomWidget: React.ComponentType<PWidget>,
): <PPlugin extends {} = {}>(props: AppliedWidgetEngineProps<CMeta, W, PWidget> & PPlugin) => React.ReactElement {
    const CustomStack = (p) =>
        <WidgetEngine
            {...p}
            WidgetOverride={CustomWidget}
        />

    CustomStack.displayName = `ApplyWidgetEngine(${getDisplayName(CustomWidget)})`
    return memo(CustomStack)
}

export function injectWidgetEngine<CMeta = UIMetaContext, W = WidgetsBindingFactory, PWidget extends WidgetProps<W> = WidgetProps<W>>(
    Wrapper: React.ComponentType<WidgetEngineWrapperProps>,
    CustomWidget?: React.ComponentType<PWidget>,
): <PPlugin extends {} = {}>(props: AppliedWidgetEngineProps<CMeta, W, PWidget> & PPlugin) => React.ReactElement {
    const CustomStack = (p) =>
        <WidgetEngine
            {...p}
            StackWrapper={Wrapper}
            WidgetOverride={CustomWidget}
        />

    CustomStack.displayName = `InjectWidgetEngine(${getDisplayName(Wrapper)}${CustomWidget ? `(${getDisplayName(CustomWidget)})` : ''})`
    return memo(CustomStack)
}
