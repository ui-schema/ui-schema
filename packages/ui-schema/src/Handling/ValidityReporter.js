import React from "react";
import {NextPluginRenderer} from "../Schema/EditorWidgetStack";
import {Map} from 'immutable';
import {cleanUp, updateValidity,} from "../Schema/EditorStore";

let ValidityReporter = (props) => {
    const {
        onChange, showValidity,
        storeKeys,
    } = props;
    let {errors, valid} = props;

    React.useEffect(() => {
        // onValidity always needs to return a `Map`, otherwise it is not set-able again when validity cleared on hoisted component etc.

        onChange(updateValidity(storeKeys, valid));

        return () => {
            // delete own validity state on component unmount
            onChange(cleanUp(storeKeys, 'validity'));
        };
    }, [valid]);

    return <NextPluginRenderer {...props} valid={valid} errors={errors} showValidity={showValidity}/>;
};

const searchRecursive = (immutable, val, keys, count = false) => {
    if(!immutable) return 0;

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

const isInvalid = (validity, scope = [], count = false) => {
    if(!validity) return 0;

    return searchRecursive(validity.getIn(scope), false, ['__valid'], count);
};

export {ValidityReporter, isInvalid, searchRecursive}
