import { List, Map, Record } from 'immutable'

export type ValidatorErrorsSingle = List<Map<string, any>>
export type ValidatorErrorsValue = Map<string, ValidatorErrorsSingle>

export interface ValidatorErrorsInterface {
    errCount: number
    errors: ValidatorErrorsValue
    childErrors: Map<string, any>
    errorsToJS: () => { [key: string]: { [key: string]: any }[] }
    getErrors: () => ValidatorErrorsValue
    addError: (type: string, context?: Map<string, any>) => ValidatorErrorsType
    addErrors: (errors: ValidatorErrorsType) => ValidatorErrorsType
    addChildErrors: (errors: ValidatorErrorsType) => ValidatorErrorsType
    addErrorsToChild: (errors: ValidatorErrorsType) => ValidatorErrorsType
    hasError: (type?: string) => boolean
    getError: (type: string) => ValidatorErrorsSingle
}

export type onErrorHandler = (errors: ValidatorErrorsType | undefined) => void
export type onErrors = (cb: onErrorHandler) => void

export type ValidatorErrorsType = Record<ValidatorErrorsInterface> & ValidatorErrorsInterface

export class ValidatorErrors extends Record({
    errors: Map({}),
    childErrors: Map({}),
    errCount: 0,
}) {
    errorsToJS(): { [key: string]: { [key: string]: any }[] } {
        return this.get('errors').toJS() as { [key: string]: { [key: string]: any }[] }
    }

    getErrors(): ValidatorErrorsValue {
        return this.get('errors') as ValidatorErrorsValue
    }

    getChildErrors(): ValidatorErrorsValue {
        return this.get('childErrors') as ValidatorErrorsValue
    }

    addError(type: string, context: Map<string, any> = Map()): ValidatorErrors {
        let typeErrors = (this.get('errors') as ValidatorErrorsValue)?.get(type) as ValidatorErrorsSingle
        if (!List.isList(typeErrors)) {
            typeErrors = List()
        }
        typeErrors = typeErrors.push(context)
        return this
            .setIn(['errors', type], typeErrors)
            .set('errCount', this.errCount + 1)
    }

    private addChildError(type: string, context: Map<string, any> = Map()): ValidatorErrors {
        let typeErrors = this.getIn(['childErrors', type]) as ValidatorErrorsSingle
        if (!List.isList(typeErrors)) {
            typeErrors = List()
        }
        typeErrors = typeErrors.push(context)
        return this.setIn(['childErrors', type], typeErrors)
            // incrementing the global errCount not the children
            .set('errCount', this.errCount + 1)
    }

    addChildErrors(errors: ValidatorErrors): ValidatorErrors {
        return errors.getChildErrors().keySeq().reduce((errs, type) => {
            return errors.getChildError(type).reduce((errs, error) => {
                return errs.addChildError(type, error)
            }, errs)
        }, this as ValidatorErrors)
    }

    addErrors(errors: ValidatorErrors): ValidatorErrors {
        return errors.getErrors().keySeq().reduce((errs, type) => {
            return errors.getError(type).reduce((errs, error) => {
                return errs.addError(type, error)
            }, errs)
        }, this as ValidatorErrors)
    }

    addErrorsToChild(errors: ValidatorErrors): ValidatorErrors {
        return errors.getErrors().keySeq().reduce((errs, type) => {
            return errors.getError(type).reduce((errs, error) => {
                return errs.addChildError(type, error)
            }, errs)
        }, this as ValidatorErrors)
    }

    hasError(type?: string): boolean {
        const typeErrors = this.getIn(type ? ['errors', type] : ['errors'])
        return !!(
            (List.isList(typeErrors) && typeErrors.size) ||
            (Map.isMap(typeErrors) && typeErrors.keySeq().size)
        )
    }

    getError(type: string): ValidatorErrorsSingle {
        return this.getIn(['errors', type]) as ValidatorErrorsSingle || List()
    }

    getChildError(type: string): ValidatorErrorsSingle {
        return this.getIn(['childErrors', type]) as ValidatorErrorsSingle || List()
    }
}

export const createValidatorErrors = (): ValidatorErrorsType => {
    return new ValidatorErrors() as unknown as ValidatorErrorsType
}
