import React from 'react';
import {beautifyKey, Trans} from '@ui-schema/ui-schema';
import FormLabel from '@mui/material/FormLabel';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText';
import {CodeRenderer} from '@ui-schema/material-code/CodeRenderer';

export const Code = (props) => {
    const {valid, showValidity, ownKey, schema, required, errors} = props
    const format = schema.get('format')

    if(process.env.NODE_ENV === 'development' && typeof format !== 'string') {
        console.log('Code schema without string format')
    }

    const hideTitle = schema.getIn(['view', 'hideTitle'])
    return <>
        <FormLabel error={!valid && showValidity} style={{marginBottom: 12, display: 'block'}}>
            {!hideTitle ?
                beautifyKey(ownKey, schema.get('tt')) + (required ? ' *' : '')
                : null}
            {!hideTitle && ' ('}
            <Trans text={'formats.' + format}/>
            {!hideTitle && ') '}
        </FormLabel>
        {typeof format === 'string' ? <CodeRenderer
            {...props}
            format={format}
        /> : null}
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </>
};
