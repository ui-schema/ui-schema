import React from 'react'
import {WidgetEngine} from '@ui-schema/react/WidgetEngine'
import {getDisplayName, memo} from '@ui-schema/react/Utils/memo'

export function applyWidgetEngine(CustomWidget) {
    const CustomStack = (p) =>
        <WidgetEngine
            {...p}
            WidgetOverride={CustomWidget}
        />

    CustomStack.displayName = `ApplyWidgetEngine(${getDisplayName(CustomWidget)})`
    return memo(CustomStack)
}

export function injectWidgetEngine(Wrapper, CustomWidget) {
    const CustomStack = (p) =>
        <WidgetEngine
            {...p}
            StackWrapper={Wrapper}
            WidgetOverride={CustomWidget}
        />

    CustomStack.displayName = `InjectWidgetEngine(${getDisplayName(Wrapper)}${CustomWidget ? `(${getDisplayName(CustomWidget)})` : ''})`
    return memo(CustomStack)
}
