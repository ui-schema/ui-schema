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
import {demoTable} from './docs/widgets/TableDemo';
import {demoTextField} from './docs/widgets/TextFieldDemo';
import {demoEditorJS} from './docs/widgets/EditorJSDemo';
import {demoDragnDropEditorSimple} from './docs/widgets/Drag-n-Drop-Editor-Simple';
import {demoDragnDropEditor} from './docs/widgets/Drag-n-Drop-Editor';

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
        createDoc('core-renderer', 'Core Generator & Renderer'),
        createDoc('core-provider', 'Core Provider & Store'),
        createDoc('core-pluginstack', 'Core PluginStack'),
        createDoc('core-uiapi', 'Core UIApi'),
        createDoc('core-utils', 'Core Utils'),
        createDoc('widgets', 'Widgets'),
        createDoc('widgets-composition', 'Widgets Composition'),
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
        createDoc('widgets/Drag-n-Drop-Editor', 'Drag \'n Drop Advanced', '', {
            demoUIGenerator: demoDragnDropEditor,
        }),
        createDoc('widgets/Drag-n-Drop-Editor-Simple', 'Drag \'n Drop Simple', '', {
            demoUIGenerator: demoDragnDropEditorSimple,
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
        createDoc('widgets/RichText', 'Rich-Text / Rich-Content', '', {
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
        createDoc('widgets/Table', 'Table', '', {
            demoUIGenerator: demoTable,
        }),
        createDoc('widgets/TextField', 'TextField', '', {
            demoUIGenerator: demoTextField,
        }),
    ],
};

export const routesDSMaterial = {
    nav: {
        label: 'DS Material Components',
    },
    routes: [
        createDoc('ds-material/Table', 'Table', ''),
    ],
};
