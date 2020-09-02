import React from "react"
import { ownKey, StoreKeys } from "@ui-schema/ui-schema/EditorStore"
import { StoreSchemaType } from "@ui-schema/ui-schema/CommonTypings"

export interface TransTitleProps {
    schema: StoreSchemaType
    storeKeys: StoreKeys
    ownKey: ownKey
}

export function TransTitle<P extends TransTitleProps>(props: P): React.ReactElement
