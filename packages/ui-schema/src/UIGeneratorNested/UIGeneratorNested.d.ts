import * as React from "react"
import { UIMetaContext, StoreKeys } from "../UIStore"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"

export interface UIGeneratorNestedProps {
    // the whole schema for this level
    schema: StoreSchemaType
    storeKeys: StoreKeys
    level?: number
    widgets?: UIMetaContext['widgets']
    t?: UIMetaContext['t']
    showValidity?: UIMetaContext['showValidity']
}

export function UIGeneratorNested<P extends UIGeneratorNestedProps>(props: P): React.ReactElement
