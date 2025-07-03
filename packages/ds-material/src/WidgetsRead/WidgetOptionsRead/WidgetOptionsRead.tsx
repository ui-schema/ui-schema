import { MuiBindingComponents } from '@ui-schema/ds-material'
import React, { MouseEventHandler } from 'react'
import { List } from 'immutable'
import { Translate } from '@ui-schema/react/Translate'
import { memo } from '@ui-schema/react/Utils/memo'
import { StoreKeys, extractValue } from '@ui-schema/react/UIStore'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import Box from '@mui/material/Box'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'
import Typography from '@mui/material/Typography'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import { OptionValueSchema, useOptionsFromSchema } from '@ui-schema/ds-material/Utils/useOptionsFromSchema'

const checkActive = (list: List<any>, name: string | undefined | number) => list && list.contains && typeof list.contains(name) !== 'undefined' ? list.contains(name) : false

const MultiOptionsItemsBase: React.ComponentType<{
    storeKeys: StoreKeys
    valueSchemas?: List<OptionValueSchema>
    schema: UISchemaMap
    dense: boolean
    value?: any
}> = (
    {
        valueSchemas, value, dense,
    },
) => {
    const activeValueSchemas = valueSchemas?.filter(v => checkActive(value, v.value))
    return activeValueSchemas?.size ?
        activeValueSchemas.map(({schema, text, fallback, context}, i) => {
            return <Typography
                variant={dense ? 'body2' : 'body1'}
                style={{paddingRight: i < (activeValueSchemas.size - 1) ? 4 : 0}}
                key={i}
            >
                <Translate
                    schema={schema?.get('t') as unknown as UISchemaMap}
                    text={text}
                    context={context}
                    fallback={fallback}
                />
                {i < (activeValueSchemas.size - 1) ? ', ' : ''}
            </Typography>
        }).valueSeq() as unknown as React.ReactElement :
        <Typography variant={dense ? 'body2' : 'body1'} style={{opacity: 0.65}}>-</Typography>
}

const MultiOptionsItems = extractValue(memo(MultiOptionsItemsBase))

const SingleOptionItem: React.ComponentType<{
    storeKeys: StoreKeys
    valueSchemas?: List<OptionValueSchema>
    dense: boolean
    value?: any
}> = (
    {valueSchemas, dense, value},
) => {
    const activeSchema = typeof value === 'undefined' ? undefined : valueSchemas?.find(s => s.value === value)

    return <Typography variant={dense ? 'body2' : 'body1'} color={typeof value === 'undefined' || activeSchema ? undefined : 'error'}>
        {activeSchema && typeof value !== 'undefined' ?
            <Translate
                schema={activeSchema.schema?.get('t')}
                text={activeSchema.text}
                context={activeSchema.context}
                fallback={activeSchema.fallback}
            /> :
            <span style={{opacity: 0.65}}>-</span>}
    </Typography>
}

export interface WidgetOptionsReadProps {
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
    style?: React.CSSProperties
}

export const WidgetOptionsRead: React.ComponentType<WidgetProps<BindingTypeGeneric & MuiBindingComponents> & UIMetaReadContextType & WidgetOptionsReadProps> = (
    {
        schema, storeKeys, showValidity,
        valid, errors, value,
        binding,
        onClick, style,
        readDense,
    },
) => {
    const hideTitle = schema.getIn(['view', 'hideTitle']) as boolean | undefined
    const InfoRenderer = binding?.InfoRenderer
    const hasInfo = Boolean(InfoRenderer && schema?.get('info')) as boolean | undefined
    const isMultiOption = Boolean(schema.get('items'))
    const {valueSchemas} = useOptionsFromSchema(
        storeKeys,
        schema.get('items') ? schema.get('items') as UISchemaMap : schema,
    )
    return <Box onClick={onClick} style={style} tabIndex={onClick ? 0 : undefined}>
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
            {isMultiOption ?
                <MultiOptionsItems
                    valueSchemas={valueSchemas}
                    storeKeys={storeKeys}
                    schema={schema}
                    dense={Boolean(readDense)}
                /> :
                <SingleOptionItem
                    valueSchemas={valueSchemas}
                    storeKeys={storeKeys}
                    dense={Boolean(readDense)}
                    value={value}
                />}
        </Box>

        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </Box>
}
