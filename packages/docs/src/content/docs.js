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
import {demoDragnDropGenericDemo} from './docs/material-dnd/widgets-genericDemo';
import {demoSelectChips} from './docs/widgets/SelectChipsDemo';
import {demoCard} from './docs/widgets/CardDemo';

const createDoc = (path, label, prefix, context) => ({
    doc: path,
    path: prefix + '/' + path,
    nav: {
        to: '/docs/' + path,
        label,
    },
    context,
});

export const routesCore = [
    createDoc('overview', 'Overview'),
    createDoc('schema', 'Schema'), {
        nav: {
            label: 'Core',
            //initialOpen: false,
            toSection: /^(\/docs\/core$|\/docs\/core-)/,
        },
        routes: [
            createDoc('core', 'Core Overview'),
            createDoc('core-renderer', 'Core: Generator & Renderer'),
            createDoc('core-meta', 'Core: Meta'),
            createDoc('core-store', 'Core: Store'),
            createDoc('core-pluginstack', 'Core: PluginStack'),
            createDoc('core-uiapi', 'Core: UIApi'),
            createDoc('core-utils', 'Core: Utils'),
        ],
    }, {
        nav: {
            label: 'Design-System & Widgets',
            initialOpen: false,
            //toSection: /^(\/docs\/design-systems|\/docs\/widgets$|\/docs\/widgets-composition$)/,
            toSection: /^(\/docs\/design-systems|\/docs\/widgets$)/,
        },
        routes: [
            createDoc('design-systems', 'Design-System'),
            createDoc('widgets', 'Widget Binding'),
        ],
    },
    createDoc('plugins', 'Plugins'),
    createDoc('localization', 'Localization'),
    createDoc('performance', 'Performance'),
    createDoc('widgets-composition', 'Composition Concepts'), {
        nav: {
            label: 'Updates / Migration',
            initialOpen: false,
            toSection: /^(\/docs\/updates)/,
        },
        routes: [
            createDoc('updates/overview', 'Overview'),
            createDoc('updates/v0.2.0-v0.3.0', 'v0.2.0 to v0.3.0'),
        ],
    },
]

export const routesFurtherDesignSystem = [
    {
        nav: {
            label: 'Widgets List',
            toSection: /^\/docs\/widgets\//,
        },
        routes: [
            createDoc('widgets/Accordions', 'Accordions', '', {
                demoUIGenerator: demoAccordions,
            }),
            createDoc('widgets/Card', 'Card', '', {
                demoUIGenerator: demoCard,
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
            createDoc('widgets/RichText', 'Rich-Text / Rich-Content', '', {
                demoUIGenerator: demoRichText,
            }),
            createDoc('widgets/NumberSlider', 'Number Slider', '', {
                demoUIGenerator: demoNumberSlider,
            }),
            createDoc('widgets/Select', 'Select', '', {
                demoUIGenerator: demoSelect,
            }),
            createDoc('widgets/SelectChips', 'Select Chips', '', {
                demoUIGenerator: demoSelectChips,
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
    }, {
        nav: {
            label: 'DS Material',
            initialOpen: false,
            to: '/docs/ds-material',
        },
        routes: [
            createDoc('ds-material/InfoRenderer', 'Info Renderer', ''),
            {
                nav: {
                    label: 'Base Components',
                    initialOpen: false,
                    to: '/docs/ds-material/components',
                },
                routes: [
                    createDoc('ds-material/Table', 'Table', ''),
                    createDoc('ds-material/GenericList', 'GenericList', ''),
                ],
            },
            {
                nav: {
                    label: 'Widgets: Read-Only',
                    initialOpen: false,
                    to: '/docs/ds-material/widgets-read',
                },
                routes: [
                    createDoc('ds-material/widgets-read/BooleanRead', 'BooleanRead', '', {}),
                    createDoc('ds-material/widgets-read/ChipsRead', 'ChipsRead', '', {}),
                    createDoc('ds-material/widgets-read/EnumRead', 'EnumRead', '', {}),
                    createDoc('ds-material/widgets-read/OneOfRead', 'OneOfRead', '', {}),
                    createDoc('ds-material/widgets-read/TextFieldRead', 'TextFieldRead', '', {}),
                ],
            },
        ],
    }, {
        nav: {
            label: 'Material-DND',
            initialOpen: false,
            to: '/docs/material-dnd',
        },
        routes: [
            createDoc('material-dnd/overview', 'Overview', ''),
            createDoc('material-dnd/widgets-generic', 'Widgets Generic', '', {
                demoUIGenerator: demoDragnDropGenericDemo,
            }),
        ],
    },
]

export const routesFurtherAddOns = [
    {
        nav: {
            label: 'Kit: DnD',
            initialOpen: false,
            to: '/docs/kit-dnd',
        },
        routes: [
            createDoc('kit-dnd/kit-dnd', 'Overview', ''),
        ],
    }, {
        nav: {
            label: 'Pro Extensions',
            initialOpen: false,
            to: '/pro',
        },
        routes: [
            createDoc('pro', 'UIStorePro'),
        ],
    },
]

export const routesDocs = {
    nav: {
        label: 'Documentation',
    },
    routes: [
        ...routesCore,
        ...routesFurtherDesignSystem,
        ...routesFurtherAddOns,
    ],
};
