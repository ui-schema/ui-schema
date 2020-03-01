const restrictColors = (pickerProps, schema, nestedArray = false) => {
    // todo: nested array should support grouping, needed only for SwatchesPicker
    if(schema.get('enum')) {
        pickerProps['colors'] = schema.get('enum').toArray();
        if(nestedArray) pickerProps['colors'] = [pickerProps['colors']];
    } else if(schema.getIn(['view', 'colors'])) {
        pickerProps['colors'] = schema.getIn(['view', 'colors']).toArray();
        if(nestedArray) pickerProps['colors'] = [pickerProps['colors']];
    }
};

export {restrictColors}
