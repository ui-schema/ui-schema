import React from 'react'
import { TransTitle, WidgetProps } from '@ui-schema/ui-schema'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'

export const CardRenderer = (props: WidgetProps): React.ReactElement => {
    const {schema, storeKeys, ownKey} = props

    return <Card
        elevation={schema.getIn(['view', 'ev'])}
        variant={schema.getIn(['view', 'variant'])}
        style={schema.getIn(['view', 'bg']) === false ? {background: 'transparent'} : {}}
    >
        <CardContent>
            <Typography
                variant={schema.getIn(['view', 'titleVariant']) || 'h5'}
                component={schema.getIn(['view', 'titleComp']) || 'p'}
                gutterBottom
            >
                <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
            </Typography>
            {/* todo: add `description` support */}
            <ObjectRenderer {...props}/>
        </CardContent>
    </Card>
}
