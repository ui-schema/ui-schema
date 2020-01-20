const defaultSetter = (value, schema, setData, storeKeys) => {
    if(typeof value === 'undefined') {
        let default_val = schema.get('default');
        if(typeof default_val !== "undefined") {
            setData(storeKeys, default_val)
        }
    }
};

export {defaultSetter}
