import React from 'react';
import {NumberRenderer, StringRenderer, TextRenderer} from './Widgets/TextField';
import {Select, SelectMulti} from './Widgets/Select';
import {BoolRenderer} from './Widgets/OptionsBoolean';
import {OptionsCheck} from './Widgets/OptionsCheck';
import {OptionsRadio} from './Widgets/OptionsRadio';
import {SimpleList} from './Widgets/SimpleList';
import {GroupRenderer} from './Grid';
import {widgetPlugins} from './widgetPlugins';
import {WidgetRenderer} from '@ui-schema/react/WidgetRenderer';
import {validators} from '@ui-schema/json-schema/Validators/validators';

const MyFallbackComponent = ({type, widget}) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

export const widgets = {
    ErrorFallback: MyFallbackComponent,
    GroupRenderer,
    WidgetRenderer,
    widgetPlugins,
    pluginSimpleStack: validators,
    types: {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
    },
    custom: {
        Text: TextRenderer,
        SimpleList,
        OptionsCheck,
        OptionsRadio,
        Select,
        SelectMulti,
    },
}
