import React from 'react'
import { extractValue, memo, sortScalarList, StoreSchemaType, WidgetProps, WithValue } from '@ui-schema/ui-schema'
import { Trans, TransTitle } from '@ui-schema/ui-schema/Translate'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { List } from 'immutable'
import { useOptionsFromSchema } from '@ui-schema/ds-material/Utils'

export const SelectChipsBase: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithValue> = (
    {
        storeKeys, schema, value, onChange,
        showValidity, errors, required,
        valid,
    }
) => {
    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema.get('items') as StoreSchemaType)

    const currentValue = (typeof value !== 'undefined' ? value : (List(schema.get('default') as string[]) || List())) as List<string>

    return <Box>
        <Typography color={showValidity && !valid ? 'error' : undefined}>
            <TransTitle schema={schema} storeKeys={storeKeys}/>
        </Typography>

        <Box mt={1} style={{display: 'flex', flexWrap: 'wrap'}}>
            {valueSchemas?.map(({value: itemValue, text, fallback, context, schema: itemSchema}) =>
                <Chip
                    key={itemValue}
                    label={<Trans
                        schema={itemSchema?.get('t') as unknown as StoreSchemaType}
                        text={text}
                        context={context}
                        fallback={fallback}
                    />}
                    style={{marginRight: 4, marginBottom: 4}}
                    size={schema.getIn(['view', 'size']) === 'medium' ? 'medium' : 'small'}
                    variant={
                        currentValue?.indexOf(itemValue as string) === -1 ? 'outlined' : 'filled'
                    }
                    disabled={schema.get('readOnly') as boolean || itemSchema?.get('readOnly') as boolean}
                    color={(schema.getIn(['view', 'color']) as any) || 'primary'}
                    onClick={() => {
                        !schema.get('readOnly') &&
                        !itemSchema?.get('readOnly') &&
                        onChange({
                            storeKeys,
                            scopes: ['value'],
                            type: 'update',
                            schema,
                            required,
                            updater: ({value = List()}: { value?: List<string> }) => ({
                                value: value.indexOf(itemValue as string) === -1 ?
                                    sortScalarList(value.push(itemValue as string)) :
                                    sortScalarList(value.splice(value.indexOf(itemValue as string), 1)),
                            }),
                        })
                    }}
                />
            ).valueSeq()}
        </Box>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </Box>
}

export const SelectChips = extractValue(memo(SelectChipsBase)) as React.ComponentType<WidgetProps<MuiWidgetBinding>>
