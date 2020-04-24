const mapSchema = (inputProps = {}, schema) => {
    if(schema.get('minLength')) {
        inputProps['minLength'] = schema.get('minLength');
    }
    if(schema.get('maxLength')) {
        inputProps['maxLength'] = schema.get('maxLength');
    }
    if(schema.get('minimum')) {
        // todo add exclusive
        inputProps['min'] = schema.get('minimum');
    }
    if(schema.get('maximum')) {
        // todo add exclusive
        inputProps['max'] = schema.get('maximum');
    }
    if(schema.get('multipleOf')) {
        inputProps['step'] = schema.get('multipleOf');
    }
    if(schema.get('pattern')) {
        inputProps['pattern'] = schema.get('pattern');
    }

    return inputProps;
};

const checkNativeValidity = (currentRef, valid) => {
    if(currentRef) {
        for(let error in currentRef.validity) {
            if(error === 'valid') continue;
            valid = !valid ? false : !currentRef.validity[error];
        }
    }

    return valid;
};

export {mapSchema, checkNativeValidity}
