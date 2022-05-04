import React from 'react';
import {Map, List} from 'immutable';
import {beautifyKey} from '../../Utils/beautify';
import {Trans} from '../Trans';

/**
 * Reusable title translation component
 */
export const TransTitle = ({schema, storeKeys, ownKey}) => <Trans
    schema={schema.get('t')}
    text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
    context={Map({'relative': List(['title'])})}
    // todo: remove fallback of `ownKey` when removing `ownKey` in `v0.5.0`
    fallback={schema.get('title') || beautifyKey(typeof ownKey === 'undefined' ? storeKeys.last() : ownKey, schema.get('tt'))}
/>;
