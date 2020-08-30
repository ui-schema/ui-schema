import React from "react";
import {NextPluginRenderer} from "../../EditorPluginStack";
import {updateValue} from "../../EditorStore";

const DefaultValueHandler = ({defaultVal, ...props}) => {
    const [defaultHandled, setDefaultHandled] = React.useState(false);
    const {onChange, storeKeys} = props;
    let {value} = props;

    React.useEffect(() => {
        if(typeof value === 'undefined' && !defaultHandled) {
            setDefaultHandled(true);
            onChange(updateValue(storeKeys, defaultVal));
        }
    }, [onChange, storeKeys, defaultVal, value, defaultHandled]);

    React.useEffect(() => {
        if(defaultHandled) {
            setDefaultHandled(false);
        }
    }, [onChange, storeKeys, defaultVal]);

    let nextValue = value;
    if(typeof value === 'undefined' && !defaultHandled) {
        nextValue = defaultVal;
    }

    return <NextPluginRenderer {...props} value={nextValue}/>;
};

const DefaultHandler = (props) => {
    const {schema,} = props;

    let defaultVal = schema.get('default');

    return typeof defaultVal !== 'undefined' ?
        <DefaultValueHandler {...props} defaultVal={defaultVal}/> :
        <NextPluginRenderer {...props}/>;
};

export {DefaultHandler}
