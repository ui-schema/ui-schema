import React from 'react';
import {beautifyKey} from '@ui-schema/ui-schema';
import FormLabel from '@material-ui/core/FormLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import IcArrowDropDown from '@material-ui/icons/ArrowDropDown';
import {ValidityHelperText} from '@ui-schema/ds-material/Component/LocaleHelperText/LocaleHelperText';
import {CodeRenderer} from '@ui-schema/material-code/CodeRenderer';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans';
import {extractValue} from '@ui-schema/ui-schema/UIStore';
import {List} from 'immutable';

let CodeSelectable = (props) => {
    const {valid, showValidity, value = List(), onChange, storeKeys, ownKey, schema, required, errors} = props

    const [open, setOpen] = React.useState(null)
    const [format, setFormat] = React.useState(() => schema.get('formatDefault') || schema.getIn(['format', 0]))

    if(process.env.NODE_ENV === 'development' && schema.get('format').size < 0) {
        console.log('CodeSelectable schema without available formats')
    }

    const valFormat = value.get(0)
    React.useEffect(() => {
        onChange(
            storeKeys, ['value'], ({value: val = List()}) => ({value: val}),
        )
    }, [onChange, storeKeys])

    React.useEffect(() => {
        if(valFormat) {
            setFormat(valFormat)
        }
    }, [valFormat, setFormat])
    const hideTitle = schema.getIn(['view', 'hideTitle'])
    return <React.Fragment>
        <FormLabel
            error={!valid && showValidity} style={{marginBottom: 12, display: 'block'}}
            onClick={(e) => setOpen(e.currentTarget)}
            onKeyDown={(e) => e.key === 'Enter' ? setOpen(e.currentTarget) : undefined}
        >
            {!hideTitle ?
                beautifyKey(ownKey, schema.get('tt')) + (required ? ' *' : '')
                : null}
            {!hideTitle && ' ('}
            <Trans text={'formats.' + format}/>
            {!hideTitle && ') '}
            <IcArrowDropDown fontSize={'inherit'}/>
        </FormLabel>
        <Menu
            anchorEl={open}
            keepMounted
            open={Boolean(open)}
            onClose={() => setOpen(null)}
        >
            {schema.get('format').toArray().map(f => <MenuItem
                key={f}
                selected={f === format}
                onClick={() => {
                    setOpen(null)
                    onChange(
                        storeKeys.push(0), ['value'], () => ({value: f}),
                    )
                }}
            >
                <Trans text={'formats.' + f}/>
            </MenuItem>)}
        </Menu>

        {format && <CodeRenderer
            {...props}
            format={format}
            value={value.get(1)}
            storeKeys={storeKeys.push(1)}
        />}
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

CodeSelectable = extractValue(CodeSelectable)
export {CodeSelectable}
