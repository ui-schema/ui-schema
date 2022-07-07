import React from 'react'
import { StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface TransTitleProps {
    schema: StoreSchemaType
    storeKeys: StoreKeys
}

export function TransTitle<P extends TransTitleProps>(props: P): React.ReactElement
