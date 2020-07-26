const addAdditionalProps = (additionalProps, schema) => {
    additionalProps['hideTabs'] = schema.getIn(['date', 'tabs']) !== true;
    additionalProps['ampm'] = schema.getIn(['date', 'ampm']) !== false;
    additionalProps['minutesStep'] = schema.getIn(['date', 'minutesStep']);

    return additionalProps;
};

export {addAdditionalProps}
