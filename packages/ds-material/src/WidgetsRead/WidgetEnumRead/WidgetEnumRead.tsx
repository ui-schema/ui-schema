import { Map, List } from 'immutable'
import { useUIMeta, beautifyKey, WidgetProps, tt, StoreSchemaType, WithScalarValue } from '@ui-schema/ui-schema'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import React, { MouseEventHandler } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'

export interface WidgetEnumReadProps {
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
    style?: React.CSSProperties
}

/**
 * @deprecated use `WidgetOptionsRead` instead
 */
export const WidgetEnumRead: React.ComponentType<WidgetProps<MuiWidgetBinding> & WithScalarValue & WidgetEnumReadProps> = (
    {
        storeKeys, schema, value,
        showValidity, valid, errors,
        style,
        onClick, t,
        widgets,
    },
) => {
    const hideTitle = schema.getIn(['view', 'hideTitle']) as boolean | undefined
    const InfoRenderer = widgets?.InfoRenderer
    const hasInfo = Boolean(InfoRenderer && schema?.get('info')) as boolean | undefined
    const {readDense} = useUIMeta<UIMetaReadContextType>()
    if (!schema) return null

    const enum_val = schema.get('enum')
    if (!enum_val) return null

    const Translated = typeof value === 'string' ?
        t(value as string, Map({relative: List(['enum', value as string | number])}), schema.get('t') as StoreSchemaType) : undefined
    return <>
        <Box onClick={onClick} style={style}>
            <TitleBoxRead
                hideTitle={hideTitle}
                hasInfo={hasInfo}
                InfoRenderer={InfoRenderer}
                valid={valid}
                errors={errors}
                storeKeys={storeKeys}
                schema={schema}
            />

            <Typography variant={readDense ? 'body2' : 'body1'}>
                {typeof Translated === 'string' || typeof Translated === 'function' || typeof Translated === 'number' ?
                    typeof Translated === 'function' ?
                        // @ts-ignore
                        <Translated/> :
                        Translated :
                    typeof value !== 'undefined' ?
                        beautifyKey(value as string, schema.get('ttEnum') as tt) + '' :
                        <span style={{opacity: 0.65}}>-</span>}
            </Typography>

            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </Box>
    </>
}
