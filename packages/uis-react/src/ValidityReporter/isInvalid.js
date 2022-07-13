import {Map} from 'immutable';

const searchRecursive = (immutable, val, keys, count = false) => {
    if(!immutable || immutable.size === 0) return 0;

    let found = 0;

    let further = [];
    for(let [, value] of immutable) {
        if(Map.isMap(value)) {
            if(keys) {
                let t = value.getIn(keys);
                if(typeof t !== 'undefined' || typeof val === 'undefined') {
                    if(t === val) {
                        found++;
                        if(!count) {
                            break;
                        }
                    }
                }
                further.push(value.deleteIn(keys));
            } else {
                further.push(value);
            }
        } else if(value === val) {
            found++;

            if(!count) {
                break;
            }
        }
    }

    if(further.length && (!found || (found && count))) {
        for(let value of further) {
            found += searchRecursive(value, val, keys, count);

            if(found && !count) {
                break;
            }
        }
    }

    return found;
};

export const isInvalid = (validity, scope = [], count = false) => {
    if(!validity) return 0;

    return searchRecursive(validity.getIn(scope), false, ['__valid'], count);
};
