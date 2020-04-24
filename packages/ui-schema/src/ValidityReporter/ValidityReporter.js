import React from "react";
import {NextPluginRenderer} from "../EditorPluginStack";
import {cleanUp, updateValidity,} from "../EditorStore";

export const ValidityReporter = (props) => {
    const {
        onChange, showValidity,
        storeKeys,
    } = props;
    let {errors, valid} = props;

    React.useEffect(() => {
        onChange(updateValidity(storeKeys, valid));

        return () => {
            // delete own validity state on component unmount
            onChange(cleanUp(storeKeys, 'validity'));
        };
    }, [valid]);

    return <NextPluginRenderer {...props} valid={valid} errors={errors} showValidity={showValidity}/>;
};
