import React from 'react'
import { TransTitle, WidgetProps } from '@ui-schema/ui-schema'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer'
import { PaperProps } from '@material-ui/core/Paper'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography, { TypographyProps } from '@material-ui/core/Typography'

export const CardRenderer = (props: WidgetProps): React.ReactElement => {
    const {schema, storeKeys, ownKey} = props

    return <Card
        elevation={schema.getIn(['view', 'ev']) as PaperProps['elevation']}
        variant={schema.getIn(['view', 'variant']) as PaperProps['variant']}
        style={schema.getIn(['view', 'bg']) === false ? {background: 'transparent'} : {}}
    >
        <CardContent>
            <Typography
                variant={(schema.getIn(['view', 'titleVariant']) as TypographyProps['variant']) || 'h5'}
                component={(schema.getIn(['view', 'titleComp']) as React.ElementType) || 'p'}
                gutterBottom
            >
                <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            </Typography>
            {/* todo: add `description` support */}
            <ObjectRenderer {...props}/>
        </CardContent>
    </Card>
}
