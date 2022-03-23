import { Map, List } from 'immutable'
import { useUIMeta, TransTitle, beautifyKey, WidgetProps, tt, StoreSchemaType, WithScalarValue } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import React, { MouseEventHandler } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'

export interface WidgetSelectProps {
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
    style?: React.CSSProperties
}

export const WidgetSelectRead: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue & WidgetSelectProps> = (
    {
        storeKeys, ownKey, schema, value,
        showValidity, valid, errors,
        style,
        onClick, t,
        widgets,
    },
) => {
    const hideTitle = schema.getIn(['view', 'hideTitle'])
    const InfoRenderer = widgets?.InfoRenderer
    const hasInfo = Boolean(InfoRenderer && schema?.get('info'))
    const {readDense} = useUIMeta<UIMetaReadContextType>()
    if (!schema) return null

    const enum_val = schema.get('enum')
    if (!enum_val) return null

    const Translated = typeof value === 'string' ?
        t(value as string, Map({relative: List(['enum', value as string | number])}), schema.get('t') as StoreSchemaType) : undefined
    return <>
        <Box onClick={onClick} style={style}>
            <Box style={{display: 'flex', opacity: 0.75}}>
                {hideTitle ? null :
                    <Typography variant={'caption'} color={'textSecondary'}>
                        <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
                    </Typography>}
                {hasInfo ? <Box>
                    {InfoRenderer && schema?.get('info') ?
                        <InfoRenderer
                            schema={schema} variant={'icon'} openAs={'modal'}
                            storeKeys={storeKeys} valid={valid} errors={errors}
                        /> : null}
                </Box> : null}
            </Box>

            <Typography variant={schema.getIn(['view', 'dense']) || readDense ? 'body2' : 'body1'}>
                {typeof Translated === 'string' || typeof Translated === 'function' || typeof Translated === 'number' ?
                    typeof Translated === 'function' ?
                        // @ts-ignore
                        <Translated/> :
                        Translated :
                    typeof value !== 'undefined' ?
                        beautifyKey(value as string, schema.get('ttEnum') as tt) + '' :
                        '-'}
            </Typography>

            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </Box>
    </>
}
