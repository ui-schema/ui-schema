import React from 'react';
import {getDisplayName} from './getDisplayName';
import {isEqualObject} from '@ui-schema/system/Utils/isEqualObject';

/**
 * Immutable compatible `React.memo` comparison
 * @param Component
 * @return {function({}): *}
 */
export const memo = Component => {
    const Memoized = React.memo(Component, isEqualObject);
    Memoized.displayName = getDisplayName(Component);
    return Memoized;
};
