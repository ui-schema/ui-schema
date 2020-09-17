import React from 'react'
import { PluginProps } from "@ui-schema/ui-schema/PluginStack/Plugin"

export function WidgetRenderer<P extends Pick<PluginProps,
    "level" | "errors" | "onChange" | "ownKey" | "parentSchema" | "required" | "requiredList" | "schema" |
    "showValidity" | "storeKeys" | "value" | "valid" | "widgets">>(props: P): React.ReactElement<P>
