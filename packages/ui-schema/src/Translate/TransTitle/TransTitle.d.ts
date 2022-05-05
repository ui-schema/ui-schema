import React from 'react'
import { StoreKeyType, StoreKeys } from '@ui-schema/ui-schema/UIStore'
import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

export interface TransTitleProps {
    schema: StoreSchemaType
    storeKeys: StoreKeys
    /**
     * the last index of the current widget
     * @deprecated will be removed in `0.5.0`, no longer used internally [migration notes](https://ui-schema.bemit.codes/updates/v0.3.0-v0.4.0#deprecations)
     */
    ownKey?: StoreKeyType
}

export function TransTitle<P extends TransTitleProps>(props: P): React.ReactElement
