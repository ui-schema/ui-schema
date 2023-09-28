import React from 'react'
import FormLabel from '@mui/material/FormLabel'
import FormControl from '@mui/material/FormControl'
import MuiFormGroup from '@mui/material/FormGroup'
import { useTheme } from '@mui/material/styles'
import { WidgetProps } from '@ui-schema/react/Widgets'
import { TranslateTitle } from '@ui-schema/react/TranslateTitle'
import { SchemaValidatorContext } from '@ui-schema/system/SchemaPluginStack'
import { LeafsRenderMapping } from '@tactic-ui/react/LeafsEngine'
import { UISchemaMap } from '@ui-schema/json-schema/Definitions'

export const FormGroup =
    <P extends WidgetProps & SchemaValidatorContext & { renderMap: LeafsRenderMapping<{}, {}, { schema?: UISchemaMap }> }>(props: P): React.ReactElement<P> => {
        const {storeKeys, renderMap} = props
        const {spacing} = useTheme()
        let {schema} = props
        // deleting the `widget` to directly use `WidgetEngine` for nesting
        // with `widget` it would lead to an endless loop
        // using e.g. default `object` renderer then
        // @ts-ignore
        schema = schema.delete('widget')

        const Widget = renderMap.matchLeaf({...props, schema}, renderMap.leafs)
        // schema.get('type') ? renderMap.leafs['type:' + schema.get('type')] : undefined

        return <FormControl
            component="fieldset"
            style={{
                display: 'block',
                marginBottom: spacing(1),
            }}
        >
            <FormLabel component="legend">
                <TranslateTitle schema={schema} storeKeys={storeKeys}/>
            </FormLabel>
            <MuiFormGroup
                style={{
                    marginTop: spacing(1),
                    marginBottom: spacing(1),
                }}
            >
                {/* todo: re-use the NoWidget component when nothing matched */}
                {/* @ts-ignore */}
                {Widget ? <Widget {...props} schema={schema}/> : '-'}
            </MuiFormGroup>
            {/*<FormHelperText>Be careful</FormHelperText>*/}
        </FormControl>
    }
