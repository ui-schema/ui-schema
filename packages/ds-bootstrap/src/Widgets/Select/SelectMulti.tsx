import { WidgetProps } from '@ui-schema/react/Widgets'
import { beautifyKey, tt } from '@ui-schema/ui-schema/Utils/beautify'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { extractValue } from '@ui-schema/react/UIStore'
import { memo } from '@ui-schema/react/Utils/memo'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { List, Map, isImmutable } from 'immutable'
import { ValidityHelperText } from '@ui-schema/ds-bootstrap/Component/LocaleHelperText'

export const SelectMulti = extractValue(memo(({schema, storeKeys, showValidity, errors, value, onChange, required}: WidgetProps) => {
    const {t} = useUIMeta()

    if (!schema) return null
    const oneOfValues = schema.getIn(['items', 'oneOf'])
    if (!oneOfValues) return null

    const classForm = ['selectpicker', 'custom-select']
    const classFormParent = ['form-group']
    if (showValidity && errors?.size) {
        classForm.push('is-invalid')
    }
    if (showValidity && !errors?.size) {
        classForm.push('was-validated')
    }
    const currentValue = List.isList(value) ? value :
        schema.get('default') ? List(schema.get('default')) : List([])

    return <div className={classFormParent.join(' ')}>
        <label><TranslateTitle schema={schema} storeKeys={storeKeys}/></label>
        <select
            value={currentValue.toArray() as string[]}
            className={classForm.join(' ')}
            multiple
            onChange={(e) => {
                const target = e.target
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'update',
                    updater: () => ({
                        value: sortScalarList(List([...target.options].filter(o => o.selected).map(o => o.value))),
                    }),
                    schema,
                    required,
                })
            }}
        >
            {List.isList(oneOfValues) ? oneOfValues.map((oneOfSchema) => {
                if (!isImmutable(oneOfSchema)) return null
                const oneOfVal = oneOfSchema.get('const') + ''
                const Translated = t(oneOfVal, Map({relative: List(['title'])}), oneOfSchema.get('t') as any)

                return <option
                    key={oneOfVal}
                    value={oneOfVal}
                >
                    {typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(oneOfVal, oneOfSchema.get('tt') as tt)}
                </option>

            }).valueSeq() : null}
        </select>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </div>
}))
