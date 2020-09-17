import React from 'react';
import {ObjectRenderer} from '@ui-schema/ui-schema/ObjectRenderer';

const NoWidget = ({scope, matching}) => <>missing-{scope}-{matching}</>;

export const WidgetRenderer = ({
                                        value,
                                        // as we want to extract `requiredList` from the props passed to the final widget
                                        // eslint-disable-next-line no-unused-vars
                                        requiredList,
                                        ...props
                                    }) => {
    const {schema, widgets} = props;
    const type = schema.get('type');
    const widget_name = schema.get('widget');

    // getting the to-render component based on if it finds a custom object-widget or a widget extending native-types
    let Widget = null;

    if(widget_name && widgets.custom) {
        if(widgets.custom[widget_name]) {
            Widget = widgets.custom[widget_name];
        } else {
            Widget = () => <NoWidget scope={'custom'} matching={widget_name}/>;
        }
    } else if(type && widgets.types) {
        if(type === 'object') {
            Widget = ObjectRenderer;
        } else if(widgets.types[type]) {
            Widget = widgets.types[type];
        } else {
            Widget = () => <NoWidget scope={'type'} matching={type}/>;
        }
    }

    return Widget ? <Widget {...props} value={type === 'array' || type === 'object' ? undefined : value}/> : null;
};
