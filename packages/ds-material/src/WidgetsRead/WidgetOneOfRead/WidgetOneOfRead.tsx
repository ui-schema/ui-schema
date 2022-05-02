import React from 'react'
import { Map, List, OrderedMap } from 'immutable'
import { Trans, beautifyKey, extractValue, memo, WidgetProps, StoreKeys, tt, StoreSchemaType, useUIMeta } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import Box from '@mui/material/Box'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'
import Typography from '@mui/material/Typography'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'

const checkActive = (list: List<any>, name: string | undefined | number) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false

const OneOfArrayValuesBase: React.ComponentType<{
    storeKeys: StoreKeys
    oneOfValues?: List<OrderedMap<string, any>>
    schema: StoreSchemaType
    dense: boolean
    value?: any
}> = (
    {
        oneOfValues, value, dense,
    },
) => {
    const vals = oneOfValues?.filter(v => checkActive(value, v.get('const')))
    return vals?.size ?
        vals.map((oneOfSchema, i) => {
            return <Typography
                variant={dense ? 'body2' : 'body1'}
                style={{paddingRight: i < (vals.size - 1) ? 4 : 0}}
                key={oneOfSchema.get('const')}
            >
                <Trans
                    schema={oneOfSchema.get('t') as unknown as StoreSchemaType}
                    text={oneOfSchema.get('title') as string || oneOfSchema.get('const') as string}
                    context={Map({'relative': List(['title'])})}
                    fallback={oneOfSchema.get('title') || beautifyKey(oneOfSchema.get('const') as string | number, oneOfSchema.get('tt') as tt)}
                />
                {i < (vals.size - 1) ? ', ' : ''}
            </Typography>
        }).valueSeq() as unknown as React.ReactElement :
        <Typography variant={dense ? 'body2' : 'body1'} style={{opacity: 0.65}}>-</Typography>
}

const OneOfArrayValues = extractValue(memo(OneOfArrayValuesBase))

export const WidgetOneOfRead: React.ComponentType<WidgetProps<MuiWidgetBinding>> = (
    {
        schema, storeKeys, showValidity,
        valid, errors,
        widgets,
    }
) => {
    const hideTitle = schema.getIn(['view', 'hideTitle']) as boolean | undefined
    const oneOfVal = schema.getIn(['items', 'oneOf'])
    const InfoRenderer = widgets?.InfoRenderer
    const hasInfo = Boolean(InfoRenderer && schema?.get('info')) as boolean | undefined
    if (!oneOfVal) return null
    const {readDense} = useUIMeta<UIMetaReadContextType>()
    return <Box>
        <TitleBoxRead
            hideTitle={hideTitle}
            hasInfo={hasInfo}
            InfoRenderer={InfoRenderer}
            valid={valid}
            errors={errors}
            storeKeys={storeKeys}
            schema={schema}
        />

        <Box style={{display: 'flex', flexWrap: 'wrap'}}>
            <OneOfArrayValues
                oneOfValues={oneOfVal as List<OrderedMap<string, string>>}
                storeKeys={storeKeys}
                schema={schema}
                dense={Boolean(readDense)}
            />
        </Box>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </Box>
}
