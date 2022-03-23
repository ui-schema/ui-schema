import React, { MouseEventHandler } from 'react'
import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'
import { TransTitle } from '@ui-schema/ui-schema/Translate/TransTitle'
import { ValidityHelperText } from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText'
import { useUIMeta, WidgetProps, WithScalarValue } from '@ui-schema/ui-schema'
import { MuiWidgetBinding } from '@ui-schema/ds-material/widgetsBinding'
import { UIMetaReadContextType } from '@ui-schema/ui-schema/UIMetaReadContext'

export interface StringRendererBaseProps {
    onClick?: MouseEventHandler<HTMLDivElement> | undefined
}

export interface StringRendererReadProps extends StringRendererBaseProps {
    multiline?: boolean
    style?: React.CSSProperties
}

export const StringRendererRead = <P extends WidgetProps<MuiWidgetBinding> & UIMetaReadContextType = WidgetProps<MuiWidgetBinding> & UIMetaReadContextType>(
    {
        multiline,
        storeKeys, ownKey, schema, value,
        showValidity, valid, errors,
        style,
        onClick,
        widgets,
    }: P & WithScalarValue & StringRendererReadProps,
): React.ReactElement => {
    const hideTitle = schema.getIn(['view', 'hideTitle'])
    const InfoRenderer = widgets?.InfoRenderer
    const lines = multiline && typeof value === 'string' ? value.split('\n') : []
    const hasInfo = Boolean(InfoRenderer && schema?.get('info'))
    const {readDense} = useUIMeta<UIMetaReadContextType>()
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
            {multiline ?
                typeof value === 'string' ?
                    lines.map((line, i) =>
                        <Typography
                            key={i}
                            gutterBottom={i < lines.length - 1}
                            variant={schema.getIn(['view', 'dense']) || readDense ? 'body2' : 'body1'}
                        >{line}</Typography>,
                    ) :
                    <Typography><span style={{opacity: 0.65}}>-</span></Typography> :
                <Typography variant={schema.getIn(['view', 'dense']) || readDense ? 'body2' : 'body1'}>
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
