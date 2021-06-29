import React from 'react';
import {NumberRenderer, StringRenderer, TextRenderer} from './Widgets/TextField';
import {Select, SelectMulti} from './Widgets/Select';
import {BoolRenderer} from './Widgets/OptionsBoolean';
import {OptionsCheck} from './Widgets/OptionsCheck';
import {OptionsRadio} from './Widgets/OptionsRadio';
import {SimpleList} from './Widgets/SimpleList';
import {RootRenderer, GroupRenderer} from './Grid';
import {pluginStack} from './pluginStack';
import {WidgetRenderer} from '@ui-schema/ui-schema/WidgetRenderer';
import {validators} from '@ui-schema/ui-schema/Validators/validators';

const MyFallbackComponent = ({type, widget}) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

export const widgets = {
    ErrorFallback: MyFallbackComponent,
    RootRenderer,
    GroupRenderer,
    WidgetRenderer,
    pluginStack,
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
