import { SomeSchema } from '@ui-schema/ui-schema/CommonTypings'
import * as React from 'react'
import { Map, List } from 'immutable'
import { beautifyKey } from '@ui-schema/ui-schema/Utils/beautify'
import { Translate } from '@ui-schema/react/Translate'
import { StoreKeys } from '@ui-schema/ui-schema/ValueStore'

export interface TranslateTitleProps {
    schema: SomeSchema
    storeKeys: StoreKeys
}

/**
 * Reusable title translation component
 */
export const TranslateTitle: React.FC<TranslateTitleProps> = ({schema, storeKeys}) => {
    const ownKey = storeKeys.last()
    return <Translate
        schema={schema.get('t')}
        text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
        context={Map({'relative': List(['title'])})}
        fallback={schema.get('title') || (typeof ownKey === 'undefined' ? undefined : beautifyKey(ownKey, schema.get('tt')))}
    />
}
