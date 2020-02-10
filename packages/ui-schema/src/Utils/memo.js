import React from "react";
import {List, Map} from 'immutable';

const compare = (prev, next) => {
    if(List.isList(next) || Map.isMap(next)) {
        return next.equals(prev);
    } else if(Array.isArray(next)) {
        return prev === next;
    } else if(typeof next === 'object') {
        return Object.is(prev, next);
    }

    // these should be any scalar values
    return prev === next;
};

function isEqual(prevProps, nextProps) {
    const prevKeys = Object.keys(prevProps);
    const nextKeys = Object.keys(nextProps);
    if(
        prevKeys.length !== nextKeys.length ||
        !prevKeys.every(v => nextKeys.includes(v))
    ) {
        return false;
    }

    for(let next in nextProps) {
        if(!compare(prevProps[next], nextProps[next])) {
            return false;
        }
    }

    return true;
}

/**
 * Immutable compatible `React.memo` comparision
 * @param Component
 * @return {function({}): *}
 */
const memo = Component => React.memo(Component, isEqual);

export {isEqual, memo}
