import { MuiBindingComponents } from '@ui-schema/ds-material/BindingType'
import * as React from 'react'
import Box from '@mui/material/Box'
import IcYes from '@mui/icons-material/CheckCircle'
import IcNo from '@mui/icons-material/CancelOutlined'
import Typography from '@mui/material/Typography'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { WidgetProps, BindingTypeGeneric } from '@ui-schema/react/Widget'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'

export interface WidgetBooleanReadProps {
    style?: React.CSSProperties
    IconYes?: React.ComponentType<{ fontSize?: 'default' | 'inherit' | 'large' | 'medium' | 'small' }>
    IconNo?: React.ComponentType<{ fontSize?: 'default' | 'inherit' | 'large' | 'medium' | 'small' }>
}

export const WidgetBooleanRead = (
    {
        storeKeys, schema, value,
        showValidity, valid, errors,
        style,
        binding,
        IconYes, IconNo,
        readDense,
    }: WidgetProps<BindingTypeGeneric & MuiBindingComponents> & UIMetaReadContextType & WidgetBooleanReadProps,
): React.ReactElement => {
    const hideTitle = Boolean(schema.getIn(['view', 'hideTitle']))
    const InfoRenderer = binding?.InfoRenderer
    const hasInfo = Boolean(InfoRenderer && schema?.get('info'))
    return <>
        <Box style={style}>
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
                {value ?
                    IconYes ? <IconYes fontSize={'small'}/> : <IcYes fontSize={'small'}/> :
                    IconNo ? <IconNo fontSize={'small'}/> : <IcNo fontSize={'small'}/>}
            </Typography>

            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </Box>
    </>
}
