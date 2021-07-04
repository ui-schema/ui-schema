import React from 'react';
import {convertColor} from '../transformers';
import merge from 'deepmerge';

export const ColorStaticBase = ({
                                    storeKeys, schema, value, onChange, ColorPicker,
                                    styles: customStyles = {}, required,
                                    pickerProps = {},
                                }) => {
    const styles = merge({}, customStyles);
    const format = schema.get('format');

    return <ColorPicker
        color={value || ''}
        disableAlpha={
            schema.getIn(['view', 'alpha']) !== true ||
            format === 'hex' ||
            format === 'rgb'
        }
        onChange={(color) => {
            onChange(
                storeKeys, ['value'],
                {
                    type: 'update',
                    updater: () => ({value: convertColor(color, format)}),
                    schema,
                    required,
                },
            )
        }}
        styles={styles}
        {...pickerProps}
    />
};
