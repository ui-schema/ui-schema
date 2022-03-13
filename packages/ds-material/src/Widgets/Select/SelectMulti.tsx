import React from 'react'
import { Map, List, OrderedMap } from 'immutable'
import { useUID } from 'react-uid'
import {
    FormControl, Checkbox, InputLabel,
    MenuItem, Select as MuiSelect, ListItemText,
} from '@material-ui/core'
import { TransTitle, Trans, beautifyKey, extractValue, memo, WidgetProps, WithValue, StoreSchemaType, tt } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { sortScalarList } from '@ui-schema/ui-schema/Utils/sortScalarList'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'

export const SelectMultiBase: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithValue> = (
    {
        storeKeys, ownKey, schema, value, onChange,
        showValidity, valid, required, errors, t,
    }
) => {
    const uid = useUID()
    if (!schema) return null

    const oneOfValues = schema.getIn(['items', 'oneOf']) as List<OrderedMap<string, any>>
    if (!oneOfValues) return null

    const currentValue = typeof value !== 'undefined' ? value :
        schema.get('default') ? List(schema.get('default')) : List()

    return <FormControl
        required={required} error={!valid && showValidity} fullWidth
        disabled={schema.get('readOnly') as boolean}
        size={schema.getIn(['view', 'dense']) ? 'small' : undefined}
    >
        <InputLabel id={'uis-' + uid}><TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/></InputLabel>
        <MuiSelect
            labelId={'uis-' + uid}
            id={'uis-' + uid + '-label'}
            value={currentValue.toArray()}
            multiple
            renderValue={selected => {
                const sel = selected as string[]
                return sel.map(s => {
                    s = s + ''
                    const oneOfValue = oneOfValues.find(oof => oof.get('const') === s)
                    const Translated = t(s, Map({relative: List(['title'])}), oneOfValue?.get('t') as StoreSchemaType)
                    return typeof Translated === 'string' || typeof Translated === 'number' ?
                        Translated :
                        beautifyKey(s, oneOfValue?.get('tt') as tt) + ''
                }).join(', ')
            }}
            disabled={schema.get('readOnly') as boolean}
            onChange={(e) =>
                !schema.get('readOnly') &&
                onChange({
                    storeKeys,
                    scopes: ['value'],
                    type: 'set',
                    schema,
                    required,
                    data: {
                        value: sortScalarList(List(e.target.value)),
                    },
                })
            }
        >
            {oneOfValues ? oneOfValues.map((oneOfSchema, i) =>
                <MenuItem
                    key={oneOfSchema.get('const') + '-' + i}
                    value={oneOfSchema.get('const') as string}
                    dense={schema.getIn(['view', 'denseOptions']) as boolean}
                    disabled={oneOfSchema.get('readOnly') as boolean}
                >
                    <Checkbox checked={currentValue.contains(oneOfSchema.get('const'))}/>
                    <ListItemText primary={<Trans
                        schema={oneOfSchema.get('t') as unknown as StoreSchemaType}
                        text={oneOfSchema.get('title') || oneOfSchema.get('const') as string | number}
                        context={Map({'relative': List(['title'])})}
                        fallback={oneOfSchema.get('title') || beautifyKey(oneOfSchema.get('const') as string | number, oneOfSchema.get('tt') as tt)}
                    />}/>
                </MenuItem>,
            ).valueSeq() : null}
        </MuiSelect>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </FormControl>
}

export const SelectMulti = extractValue(memo(SelectMultiBase))

