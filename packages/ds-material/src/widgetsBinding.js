import React from 'react';
import {NumberRenderer, StringRenderer, TextRenderer} from '@ui-schema/ds-material/Widgets/TextField';
import {Select, SelectMulti} from '@ui-schema/ds-material/Widgets/Select';
import {BoolRenderer} from '@ui-schema/ds-material/Widgets/OptionsBoolean';
import {OptionsCheck} from '@ui-schema/ds-material/Widgets/OptionsCheck';
import {OptionsRadio} from '@ui-schema/ds-material/Widgets/OptionsRadio';
import {Stepper, Step} from '@ui-schema/ds-material/Widgets/Stepper';
import {NumberIconRenderer, StringIconRenderer, TextIconRenderer} from '@ui-schema/ds-material/Widgets/TextFieldIcon';
import {SimpleList} from '@ui-schema/ds-material/Widgets/SimpleList';
import {GenericList} from '@ui-schema/ds-material/Widgets/GenericList';
import {NumberSlider} from '@ui-schema/ds-material/Widgets/NumberSlider';
import {AccordionsRenderer} from '@ui-schema/ds-material/Widgets/Accordions';
import {RootRenderer, GroupRenderer} from './Grid';
import {pluginStack} from './pluginStack';
import {validators} from '@ui-schema/ui-schema/Validators/validators';
import {CardRenderer, FormGroup, LabelBox} from '@ui-schema/ds-material/Widgets';

const MyFallbackComponent = ({type, widget}) => (
    <div>
        <p><strong>System Error in Widget!</strong></p>
        <p><strong>Type:</strong> {type}</p>
        <p><strong>Widget:</strong> {widget}</p>
    </div>
);

export const widgets = {
    ErrorFallback: MyFallbackComponent,
    RootRenderer,
    GroupRenderer,
    pluginStack,
    validators,
    types: {
        string: StringRenderer,
        boolean: BoolRenderer,
        number: NumberRenderer,
        integer: NumberRenderer,
    },
    custom: {
        Accordions: AccordionsRenderer,
        Text: TextRenderer,
        StringIcon: StringIconRenderer,
        TextIcon: TextIconRenderer,
        NumberIcon: NumberIconRenderer,
        NumberSlider,
        SimpleList,
        GenericList,
        OptionsCheck,
        OptionsRadio,
        Select,
        SelectMulti,
        Stepper,
        Step,
        Card: CardRenderer,
        LabelBox,
        FormGroup,
    },
}
