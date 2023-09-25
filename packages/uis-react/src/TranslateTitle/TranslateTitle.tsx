import React from 'react'
import { Map, List } from 'immutable'
import { beautifyKey } from '@ui-schema/system/Utils/beautify'
import { Translate } from '@ui-schema/react/Translate'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { StoreKeys } from '@ui-schema/system/ValueStore'

export interface TranslateTitleProps {
    schema: UISchemaMap
    storeKeys: StoreKeys
}

/**
 * Reusable title translation component
 */
export const TranslateTitle: React.FC<TranslateTitleProps> = ({schema, storeKeys}) =>
    <Translate
        schema={schema.get('t')}
        text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
        context={Map({'relative': List(['title'])})}
        fallback={schema.get('title') || beautifyKey(storeKeys.last(), schema.get('tt'))}
    />
