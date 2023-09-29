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
import {getValidators} from '@ui-schema/system/getValidators';
import {ObjectRenderer} from '@ui-schema/react/ObjectRenderer';

const MyFallbackComponent = ({type, widget}) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
)

const validators = getValidators()
export const widgets = {
    ErrorFallback: MyFallbackComponent,
    GroupRenderer,
    WidgetRenderer,
    widgetPlugins,
    schemaPlugins: validators,
    types: {
        object: ObjectRenderer,
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
