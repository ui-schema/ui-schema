import React from 'react';
import {Map, List} from 'immutable';
import {beautifyKey} from '@ui-schema/system/Utils/beautify';
import {Translate} from '@ui-schema/react/Translate';

/**
 * Reusable title translation component
 */
export const TranslateTitle = ({schema, storeKeys}) => <Translate
    schema={schema.get('t')}
    text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
    context={Map({'relative': List(['title'])})}
    fallback={schema.get('title') || beautifyKey(storeKeys.last(), schema.get('tt'))}
/>;
