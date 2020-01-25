import React from "react";
import {NextPluginRenderer} from "../Schema/Editor";

const ValidityReporter = (props) => {
    const {
        storeKeys, onValidity,
    } = props;
    let {errors} = props;

    let {valid} = props;

    React.useEffect(() => {
        if(onValidity) {
            // todo: only call onValidity when validity really changed and not set? [performance]
            //   use effect may forget dependencies
            let key_str = storeKeys.valueSeq().join('.');
            onValidity(validity => validity.set(key_str, valid));
        }
    }, [valid]);

    return <NextPluginRenderer {...props} valid={valid} errors={errors}/>;
};

export {ValidityReporter}
