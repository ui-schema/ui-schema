import {demoAccordions} from './docs/widgets/AccordionsDemo';
import {demoCode} from './docs/widgets/CodeDemo';
import {demoColor} from './docs/widgets/ColorDemo';
import {demoDateTimePickers} from './docs/widgets/DateTimePickersDemo';
import {demoGenericList} from './docs/widgets/GenericListDemo';
import {demoGridHandler} from './docs/widgets/GridHandlerDemo';
import {demoOptionsList} from './docs/widgets/OptionsListDemo';
import {demoRichText} from './docs/widgets/RichTextDemo';
import {demoNumberSlider} from './docs/widgets/NumberSliderDemo';
import {demoSelect} from './docs/widgets/SelectDemo';
import {demoSimpleList} from './docs/widgets/SimpleListDemo';
import {demoStepper} from './docs/widgets/StepperDemo';
import {demoSwitch} from './docs/widgets/SwitchDemo';
import {demoTextField} from './docs/widgets/TextFieldDemo';
import {demoEditorJS} from './docs/widgets/EditorJSDemo';

const createDoc = (path, label, prefix, context) => ({
    doc: path,
    path: prefix + '/' + path,
    nav: {
        to: '/docs/' + path,
        label,
    },
    context,
});

export const routesDocs = {
    nav: {
        label: 'Documentation',
    },
    routes: [
        createDoc('overview', 'Overview'),
        createDoc('schema', 'Schema'),
        createDoc('design-systems', 'Design-Systems'),
        createDoc('core', 'Core'),
        createDoc('widgets', 'Widgets'),
        createDoc('plugins', 'Plugins'),
        createDoc('pro', 'Pro Extensions'),
        createDoc('localization', 'Localization'),
        createDoc('performance', 'Performance'),
    ],
};

export const routesWidgets = {
    nav: {
        label: 'Widgets',
    },
    routes: [
        createDoc('widgets/Accordions', 'Accordions', '', {
            demoUIGenerator: demoAccordions,
        }),
        createDoc('widgets/Code', 'Code Editor', '', {
            demoUIGenerator: demoCode,
        }),
        createDoc('widgets/Color', 'Color Picker', '', {
            demoUIGenerator: demoColor,
        }),
        createDoc('widgets/DateTimePickers', 'Date + Time Pickers', '', {
            demoUIGenerator: demoDateTimePickers,
        }),
        createDoc('widgets/EditorJS', 'EditorJS', '', {
            demoUIGenerator: demoEditorJS,
        }),
        createDoc('widgets/GenericList', 'Generic List', '', {
            demoUIGenerator: demoGenericList,
        }),
        createDoc('widgets/GridHandler', 'Grid Handler', '', {
            demoUIGenerator: demoGridHandler,
        }),
        createDoc('widgets/OptionsList', 'Options List', '', {
            demoUIGenerator: demoOptionsList,
        }),
        createDoc('widgets/RichText', 'RichText / WYSIWYG', '', {
            demoUIGenerator: demoRichText,
        }),
        createDoc('widgets/NumberSlider', 'Number Slider', '', {
            demoUIGenerator: demoNumberSlider,
        }),
        createDoc('widgets/Select', 'Select', '', {
            demoUIGenerator: demoSelect,
        }),
        createDoc('widgets/SimpleList', 'Simple List', '', {
            demoUIGenerator: demoSimpleList,
        }),
        createDoc('widgets/Stepper', 'Stepper', '', {
            demoUIGenerator: demoStepper,
        }),
        createDoc('widgets/Switch', 'Switch', '', {
            demoUIGenerator: demoSwitch,
        }),
        createDoc('widgets/TextField', 'TextField', '', {
            demoUIGenerator: demoTextField,
        }),
    ],
};
