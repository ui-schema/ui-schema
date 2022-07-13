import React from 'react'
import { StoreKeys } from '@ui-schema/react/UIStore'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export interface TranslateTitleProps {
    schema: UISchemaMap
    storeKeys: StoreKeys
}

export function TranslateTitle<P extends TranslateTitleProps>(props: P): React.ReactElement
