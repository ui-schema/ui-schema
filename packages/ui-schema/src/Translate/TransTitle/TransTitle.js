import React from "react";
import {Map, List} from "immutable";
import {beautifyKey} from "../../Utils/beautify";
import {Trans} from "../Trans";

/**
 * Reusable title translation component
 * @param {Map} schema
 * @param {Map} storeKeys
 * @param {string} ownKey
 * @return {*}
 * @constructor
 */
export const TransTitle = ({schema, storeKeys, ownKey}) => <Trans
    schema={schema.get('t')}
    text={schema.get('title') || storeKeys.insert(0, 'widget').push('title').join('.')}
    context={Map({'relative': List(['title'])})}
    fallback={schema.get('title') || beautifyKey(ownKey, schema.get('tt'))}
/>;
