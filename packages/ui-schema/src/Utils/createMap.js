import {Seq, Map, OrderedMap, fromJS} from "immutable";

function fromJSOrdered(js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Seq(js).map(fromJSOrdered).toList() :
            Seq(js).map(fromJSOrdered).toOrderedMap();
}

const createOrderedMap = (data = {}) => new OrderedMap(fromJSOrdered(data));

const createMap = (data = {}) => new Map(fromJS(data));

export {createMap, createOrderedMap, fromJSOrdered}
