import React from 'react'
import { TransTitle, WidgetProps } from '@ui-schema/ui-schema'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer'
import Card, { CardProps } from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography, { TypographyProps } from '@material-ui/core/Typography'

export const CardRenderer = (props: WidgetProps): React.ReactElement => {
    const {schema, storeKeys, ownKey} = props

    return <Card
        elevation={schema.getIn(['view', 'ev']) as CardProps['elevation']}
        variant={schema.getIn(['view', 'variant']) as CardProps['variant']}
        style={schema.getIn(['view', 'bg']) === false ? {background: 'transparent'} : undefined}
    >
        <CardContent>
            {schema.getIn(['view', 'hideTitle']) ? null :
                <Typography
                    variant={(schema.getIn(['view', 'titleVariant']) || 'h5') as TypographyProps['variant']}
                    component={(schema.getIn(['view', 'titleComp']) || 'p') as React.ElementType}
                    gutterBottom
                >
                    <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
                </Typography>}
            {/* todo: add `description` support */}
            <ObjectRenderer {...props}/>
        </CardContent>
    </Card>
}
