import * as React from 'react'
import { WidgetProps } from '@ui-schema/react/Widget'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { ObjectRendererBase as ObjectRenderer } from '@ui-schema/react/ObjectRenderer'
import Box from '@mui/material/Box'
import Typography, { TypographyProps } from '@mui/material/Typography'

export const LabelBox = (props: WidgetProps): React.ReactElement => {
    const {schema, storeKeys} = props

    return <Box
        mt={schema.getIn(['view', 'mt']) as number}
        mr={schema.getIn(['view', 'mr']) as number}
        mb={schema.getIn(['view', 'mb']) as number}
        ml={schema.getIn(['view', 'ml']) as number}
        pt={schema.getIn(['view', 'pt']) as number}
        pr={schema.getIn(['view', 'pr']) as number}
        pb={schema.getIn(['view', 'pb']) as number}
        pl={schema.getIn(['view', 'pl']) as number}
    >
        {schema.getIn(['view', 'hideTitle']) ? null :
            <Typography
                gutterBottom
                variant={(schema.getIn(['view', 'titleVariant']) as TypographyProps['variant']) || 'h5'}
                component={(schema.getIn(['view', 'titleComp']) as React.ElementType) || 'p'}
            >
                <TranslateTitle schema={schema} storeKeys={storeKeys}/>
                {/* todo: add `info` support */}
            </Typography>}
        {/* todo: use widget matcher? i think i migrated this away on purpose */}
        <ObjectRenderer {...props}/>
    </Box>
}
