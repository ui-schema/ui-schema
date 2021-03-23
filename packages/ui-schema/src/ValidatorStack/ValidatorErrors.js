import {List, Map, Record} from 'immutable';

export const ValidatorErrors = Record({
    errors: Map({}),
    childErrors: Map({}),
    errCount: 0,
    errorsToJS: function() {
        return this.get('errors').toJS()
    },
    getErrors: function() {
        return this.get('errors')
    },
    getChildErrors: function() {
        return this.get('childErrors')
    },
    addError: function(type, context = new Map()) {
        let typeErrors = this.getIn(['errors', type])
        if(!List.isList(typeErrors)) {
            typeErrors = new List()
        }
        typeErrors = typeErrors.push(context)
        return this.setIn(['errors', type], typeErrors).set('errCount', this.errCount + 1)
    },
    addChildError: function(type, context = new Map()) {
        let typeErrors = this.getIn(['childErrors', type])
        if(!List.isList(typeErrors)) {
            typeErrors = new List()
        }
        typeErrors = typeErrors.push(context)
        return this.setIn(['childErrors', type], typeErrors)
            // incrementing the global errCount not the children
            .set('errCount', this.errCount + 1)
    },
    addChildErrors: function(errors) {
        let currentErr = this;
        errors.getChildErrors().keySeq().forEach(type => {
            errors.getChildError(type).forEach(error => {
                currentErr = currentErr.addChildError(type, error)
            })
        })
        return currentErr
    },
    addErrors: function(errors) {
        let currentErr = this;
        errors.getErrors().keySeq().forEach(type => {
            errors.getError(type).forEach(error => {
                currentErr = currentErr.addError(type, error)
            })
        })
        return currentErr
    },
    addErrorsToChild: function(errors) {
        let currentErr = this;
        errors.getErrors().keySeq().forEach(type => {
            errors.getError(type).forEach(error => {
                currentErr = currentErr.addChildError(type, error)
            })
        })
        return currentErr
    },
    hasError: function(type = undefined) {
        let typeErrors = this.getIn(type ? ['errors', type] : ['errors'])
        return !!(
            (List.isList(typeErrors) && typeErrors.size) ||
            (Map.isMap(typeErrors) && typeErrors.keySeq().size)
        )
    },
    getError: function(type) {
        return this.getIn(['errors', type]) || new List()
    },
    getChildError: function(type) {
        return this.getIn(['childErrors', type]) || new List()
    },
});

export const createValidatorErrors = () => {
    return new ValidatorErrors()
};
