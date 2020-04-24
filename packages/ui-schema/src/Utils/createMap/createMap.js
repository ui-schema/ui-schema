import {Seq, List, Map, OrderedMap, fromJS} from "immutable";

export function fromJSOrdered(js) {
    if(Map.isMap(js) || OrderedMap.isOrderedMap(js) || List.isList(js)) {
        console.warn('converting immutable to immutable may lead to wrong types');
    }

    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(fromJSOrdered).toList() :
            Seq(js).map(fromJSOrdered).toOrderedMap();
}

export const createOrderedMap = (data = {}) => new OrderedMap(fromJSOrdered(data));

export const createMap = (data = {}) => new Map(fromJS(data));
