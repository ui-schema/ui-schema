import React from 'react'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { extractValue, WithValue } from '@ui-schema/react/UIStore'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { memo } from '@ui-schema/react/Utils/memo'
import { sortScalarList } from '@ui-schema/system/Utils/sortScalarList'
import { Translate } from '@ui-schema/react/Translate'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import { MuiWidgetsBinding } from '@ui-schema/ds-material/BindingType'
import { List } from 'immutable'
import { useOptionsFromSchema } from '@ui-schema/ds-material/Utils'

export const SelectChipsBase: React.ComponentType<WidgetProps<MuiWidgetsBinding> & WithValue> = (
    {
        storeKeys, schema, value, onChange,
        showValidity, errors, required,
        valid,
    }
) => {
    const {valueSchemas} = useOptionsFromSchema(storeKeys, schema.get('items') as UISchemaMap)

    const currentValue = (typeof value !== 'undefined' ? value : (List(schema.get('default') as string[]) || List())) as List<string>

    return <Box>
        <Typography color={showValidity && !valid ? 'error' : undefined}>
            <TranslateTitle schema={schema} storeKeys={storeKeys}/>
        </Typography>

        <Box mt={1} style={{display: 'flex', flexWrap: 'wrap'}}>
            {valueSchemas?.map(({value: itemValue, text, fallback, context, schema: itemSchema}) =>
                <Chip
                    key={itemValue}
                    label={<Translate
                        schema={itemSchema?.get('t') as unknown as UISchemaMap}
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

export const SelectChips = extractValue(memo(SelectChipsBase)) as React.ComponentType<WidgetProps<MuiWidgetsBinding>>
