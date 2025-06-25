/* eslint-disable @typescript-eslint/no-deprecated */
import { UIMetaContext } from '@ui-schema/react/UIMeta'
import React from 'react'
import { WidgetEngine, WidgetEngineWrapperProps } from '@ui-schema/react/WidgetEngine'
import { getDisplayName, memo } from '@ui-schema/react/Utils/memo'
import { WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'

/**
 * @deprecated no direct replacement
 */
export type WidgetEngineInjectProps = 'currentPluginIndex' | 'errors' | 'valid' | 'storeKeys'/* | 'parentSchema'*/// |
// todo find a better way to define from-plugin injected values as "required" - or shouldn't?
// 'value' | 'onChange' | 'internalValue'

/**
 * @deprecated no direct replacement
 */
export type AppliedWidgetEngineProps<CMeta = UIMetaContext, PWidget extends WidgetProps = WidgetProps> =
    Omit<PWidget, WidgetEngineInjectProps | keyof CMeta | keyof WithValue>
    // Omit<PWidget, WidgetEngineInjectProps | keyof (UIMetaContext<W> & CMeta) | keyof WithValue>
    // & Partial<UIMetaContext<W> & CMeta>
    & Partial<CMeta>
    & Partial<Pick<PWidget, 'showValidity'>>

//& WidgetEngineRootOrNestedProps

/**
 * @deprecated no direct replacement
 */
export function applyWidgetEngine<CMeta = UIMetaContext, PWidget extends WidgetProps = WidgetProps>(
    CustomWidget: React.ComponentType<PWidget>,
): <PPlugin extends {} = {}>(props: AppliedWidgetEngineProps<CMeta, PWidget> & PPlugin) => React.ReactElement {
    const CustomStack = (p) =>
        <WidgetEngine
            {...p}
            WidgetOverride={CustomWidget}
        />

    CustomStack.displayName = `ApplyWidgetEngine(${getDisplayName(CustomWidget)})`
    return memo(CustomStack)
}

/**
 * @deprecated no direct replacement
 */
export function injectWidgetEngine<CMeta = UIMetaContext, PWidget extends WidgetProps = WidgetProps>(
    Wrapper: React.ComponentType<WidgetEngineWrapperProps>,
    CustomWidget?: React.ComponentType<PWidget>,
): <PPlugin extends {} = {}>(props: AppliedWidgetEngineProps<CMeta, PWidget> & PPlugin) => React.ReactElement {
    const CustomStack = (p) =>
        <WidgetEngine
            {...p}
            StackWrapper={Wrapper}
            WidgetOverride={CustomWidget}
        />

    CustomStack.displayName = `InjectWidgetEngine(${getDisplayName(Wrapper)}${CustomWidget ? `(${getDisplayName(CustomWidget)})` : ''})`
    return memo(CustomStack)
}
