import React from 'react';
import {Map, List} from 'immutable';
import {beautifyKey} from '../../Utils/beautify';
import {Trans} from '../Trans';

/**
 * Reusable title translation component
 */
export const TransTitle = ({schema, storeKeys}) => <Trans
    schema={schema.get('t')}
    text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
    context={Map({'relative': List(['title'])})}
    fallback={schema.get('title') || beautifyKey(storeKeys.last(), schema.get('tt'))}
/>;
