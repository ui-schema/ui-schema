import React from 'react'
import {PluginStack} from '@ui-schema/ui-schema/PluginStack'
import {getDisplayName} from '@ui-schema/ui-schema/Utils/memo'

export function applyPluginStack(CustomWidget) {
    const CustomStack = (p) =>
        <PluginStack
            {...p}
            WidgetOverride={CustomWidget}
        />

    CustomStack.displayName = `ApplyPluginStack(${getDisplayName(CustomWidget)})`
    return CustomStack
}
