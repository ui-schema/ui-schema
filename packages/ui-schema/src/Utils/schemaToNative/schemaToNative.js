export const mapSchema = (inputProps = {}, schema) => {
    if(typeof schema.get('minLength') === 'number') {
        inputProps['minLength'] = schema.get('minLength');
    }
    if(typeof schema.get('maxLength') === 'number') {
        inputProps['maxLength'] = schema.get('maxLength');
    }
    if(typeof schema.get('minimum') === 'number') {
        // todo add exclusive
        inputProps['min'] = schema.get('minimum');
    }
    if(typeof schema.get('maximum') === 'number') {
        // todo add exclusive
        inputProps['max'] = schema.get('maximum');
    }
    if(typeof schema.get('multipleOf') === 'number') {
        inputProps['step'] = schema.get('multipleOf');
    }
    if(schema.get('pattern')) {
        inputProps['pattern'] = schema.get('pattern');
    }

    return inputProps;
};

export const checkNativeValidity = (currentRef, valid) => {
    if(currentRef) {
        for(let error in currentRef.validity) {
            if(error === 'valid') continue;
            valid = !valid ? false : !currentRef.validity[error];
        }
    }

    return valid;
};
