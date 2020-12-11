import React from 'react';
import InputAdornment from '@material-ui/core/InputAdornment';
import Palette from '@material-ui/icons/Palette';
import {StringRenderer} from '@ui-schema/ds-material';
import {convertColor} from '../transformers';
import merge from 'deepmerge';

/**
 * To close the picker dialog on blur change
 * @param setHasFocus
 * @return {*}
 * @constructor
 */
const ColorCloser = ({setHasFocus}) => <button
    style={{position: 'fixed', width: '100%', inset: 0, border: 0, zIndex: 1, background: 0}}
    aria-label={'Close Color Picker'}
    title={'Close Color Picker'}
    /* onClick is called when user clicks any where on page */
    onClick={() => setHasFocus(false)}
    /* on Blur is called when changing keyboard focus*/
    onBlur={() => setHasFocus(false)}
/>;

const PickerPosition = ({children}) => <div style={{position: 'relative'}}>
    <div
        style={{position: 'absolute', zIndex: 2}}
        children={children}
    />
</div>;

export const ColorBase = ({
                              storeKeys, schema, value, onChange, required, PickerContainer, ColorPicker,
                              styles: customStyles = {}, refocus = true, forceIcon = false,
                              pickerProps = {},
                              ...props
                          }) => {
    const inputRef = React.useRef();
    const [hasFocus, setHasFocus] = React.useState(false);
    const [inputType, setInputType] = React.useState('');

    const InputProps = hasFocus || value || forceIcon || schema.getIn(['view', 'iconOn']) ? {
        startAdornment: <InputAdornment position="start" style={{cursor: 'pointer'}}>
            <Palette style={{fill: value}}/>
        </InputAdornment>,
    } : {};

    const styles = merge({}, customStyles);
    const format = schema.get('format');

    const PickerWrapper = PickerContainer || PickerPosition;

    return <React.Fragment>
        {hasFocus ? <ColorCloser setHasFocus={setHasFocus}/> : null}

        <StringRenderer
            InputLabelProps={{shrink: schema.getIn(['view', 'shrink'])}}
            schema={schema}
            value={value}
            onChange={onChange}
            storeKeys={storeKeys}
            inputRef={inputRef}
            onClick={() => setHasFocus(true)}
            onFocus={() => setHasFocus(true)}
            InputProps={InputProps}
            {...props}
        />

        {hasFocus ? <PickerWrapper
            setFocus={() => setHasFocus(false)}
            hasFocus={hasFocus}
        ><ColorPicker
            color={value || ''}
            disableAlpha={
                schema.getIn(['view', 'alpha']) !== true ||
                format === 'hex' ||
                format === 'rgb'
            }
            onChange={(color, e) => {
                setInputType(e && e.type);
                onChange(
                    storeKeys, ['value'],
                    () => ({value: convertColor(color, format)}),
                    schema.get('deleteOnEmpty') || required,
                    schema.get('type'),
                )
            }}
            onChangeComplete={() => {
                let type = inputType;
                // refocus with input field/dialog could lead to errors
                // type is empty when e.g. user input/state controlled changes
                // todo: are change, keydown only needed no-focus events?
                setInputType('');
                if(!refocus || type === 'change' || type === 'keydown' || !type) return;

                if(inputRef && inputRef.current) {
                    // refocus the input field, better ux for keyboard, e.g.: color-deletion by keyboard and not page-back
                    inputRef.current.focus()
                }
            }}
            styles={styles}
            {...pickerProps}
        /></PickerWrapper> : null}

        {hasFocus ? <ColorCloser setHasFocus={setHasFocus}/> : null}
    </React.Fragment>
};
