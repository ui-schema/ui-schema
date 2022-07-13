import React, { MouseEventHandler } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { WithScalarValue } from '@ui-schema/react/UIStore'
import { useUIMeta } from '@ui-schema/react/UIMeta'
import { MuiWidgetBinding } from '@ui-schema/ds-material/WidgetsBinding'
import { UIMetaReadContextType } from '@ui-schema/react/UIMetaReadContext'
import { TitleBoxRead } from '@ui-schema/ds-material/Component/TitleBoxRead'
import { InfoRendererType } from '@ui-schema/ds-material/Component'

export interface StringRendererBaseProps {
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
}

export interface StringRendererReadProps extends StringRendererBaseProps {
    multiline?: boolean
    style?: React.CSSProperties
}

export const StringRendererRead = <P extends WidgetProps<MuiWidgetBinding<{ InfoRenderer?: InfoRendererType }>> & UIMetaReadContextType>(
    {
        multiline,
        storeKeys, schema, value,
        showValidity, valid, errors,
        style,
        onClick,
        widgets,
    }: P & WithScalarValue & StringRendererReadProps,
): React.ReactElement => {
    const hideTitle = Boolean(schema.getIn(['view', 'hideTitle']))
    const InfoRenderer = widgets?.InfoRenderer
    const lines = multiline && typeof value === 'string' ? value.split('\n') : []
    const hasInfo = Boolean(InfoRenderer && schema?.get('info'))
    const {readDense} = useUIMeta<UIMetaReadContextType>()
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
            {multiline ?
                typeof value === 'string' ?
                    lines.map((line, i) =>
                        <Typography
                            key={i}
                            gutterBottom={i < lines.length - 1}
                            variant={readDense ? 'body2' : 'body1'}
                        >{line}</Typography>,
                    ) :
                    <Typography><span style={{opacity: 0.65}}>-</span></Typography> :
                <Typography variant={readDense ? 'body2' : 'body1'}>
                    {typeof value === 'string' || typeof value === 'number' ?
                        value : <span style={{opacity: 0.65}}>-</span>
                    }
                </Typography>}

            <ValidityHelperText
                errors={errors} showValidity={showValidity} schema={schema}
            />
        </Box>
    </>
}

export const TextRendererRead = <P extends WidgetProps<MuiWidgetBinding> & UIMetaReadContextType = WidgetProps<MuiWidgetBinding> & UIMetaReadContextType>(
    {
        schema,
        ...props
    }: P & WithScalarValue & StringRendererBaseProps,
): React.ReactElement => {
    return <StringRendererRead
        {...props}
        schema={schema}
        multiline
    />
}

export const NumberRendererRead = <P extends WidgetProps<MuiWidgetBinding> & UIMetaReadContextType = WidgetProps<MuiWidgetBinding> & UIMetaReadContextType>(
    props: P & WithScalarValue & StringRendererBaseProps,
): React.ReactElement => {
    return <StringRendererRead
        {...props}
        type={'number'}
    />
}
