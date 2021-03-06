import React from 'react'
import { TransTitle, WidgetProps } from '@ui-schema/ui-schema'
import { ObjectRenderer } from '@ui-schema/ui-schema/ObjectRenderer'

import Box from '@material-ui/core/Box'
import Typography from '@material-ui/core/Typography'

export const LabelBox = (props: WidgetProps): React.ReactElement => {
    const {schema, storeKeys, ownKey} = props

    return <Box mt={schema.getIn(['view', 'mt']) || 2}>
        <Typography
            gutterBottom
            variant={schema.getIn(['view', 'titleVariant']) || 'h5'}
            component={schema.getIn(['view', 'titleComp']) || 'p'}
        >
            <TransTitle schema={schema} storeKeys={storeKeys} ownKey={ownKey}/>
        </Typography>
        {/* todo: add `description` support */}
        <ObjectRenderer {...props}/>
    </Box>
}
