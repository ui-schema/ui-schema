import {demoCode} from "./docs/widgets/CodeDemo";
import {demoColor} from "./docs/widgets/ColorDemo";
import {demoDateTimePickers} from "./docs/widgets/DateTimePickersDemo";
import {demoGenericList} from "./docs/widgets/GenericListDemo";
import {demoGridHandler} from "./docs/widgets/GridHandlerDemo";
import {demoOptionsList} from "./docs/widgets/OptionsListDemo";
import {demoRichText} from "./docs/widgets/RichTextDemo";
import {demoNumberSlider} from "./docs/widgets/NumberSliderDemo";
import {demoSelect} from "./docs/widgets/SelectDemo";
import {demoSimpleList} from "./docs/widgets/SimpleListDemo";
import {demoStepper} from "./docs/widgets/StepperDemo";
import {demoSwitch} from "./docs/widgets/SwitchDemo";
import {demoTextField} from "./docs/widgets/TextFieldDemo";

const createDoc = (path, label, prefix, context) => ({
    doc: path,
    path: prefix + '/' + path,
    nav: {
        to: '/en/docs/' + path,
        label,
    },
    context,
});

export const routesDocs = {
    nav: {
        label: 'Documentation',
    },
    routes: [
        createDoc('overview', 'Overview',),
        createDoc('schema', 'Schema',),
        createDoc('design-systems', 'Design-Systems',),
        createDoc('widgets', 'Widgets',),
        createDoc('widget-plugins', 'Widget Plugins',),
        createDoc('performance', 'Performance',),
        createDoc('localization', 'Localization',),
        createDoc('core', 'Core',),
    ]
};

export const routesWidgets = {
    nav: {
        label: 'Widgets',
    },
    routes: [
        createDoc('widgets/Code', 'Code Editor', '', {
            demoEditor: demoCode
        }),
        createDoc('widgets/Color', 'Color Picker', '', {
            demoEditor: demoColor
        }),
        createDoc('widgets/DateTimePickers', 'Date + Time Pickers', '', {
            demoEditor: demoDateTimePickers
        }),
        createDoc('widgets/GenericList', 'Generic List', '', {
            demoEditor: demoGenericList
        }),
        createDoc('widgets/GridHandler', 'Grid Handler', '', {
            demoEditor: demoGridHandler
        }),
        createDoc('widgets/OptionsList', 'Options List', '', {
            demoEditor: demoOptionsList
        }),
        createDoc('widgets/RichText', 'RichText / WYSIWYG', '', {
            demoEditor: demoRichText
        }),
        createDoc('widgets/NumberSlider', 'Number Slider', '', {
            demoEditor: demoNumberSlider
        }),
        createDoc('widgets/Select', 'Select', '', {
            demoEditor: demoSelect
        }),
        createDoc('widgets/SimpleList', 'Simple List', '', {
            demoEditor: demoSimpleList
        }),
        createDoc('widgets/Stepper', 'Stepper', '', {
            demoEditor: demoStepper
        }),
        createDoc('widgets/Switch', 'Switch', '', {
            demoEditor: demoSwitch
        }),
        createDoc('widgets/TextField', 'TextField', '', {
            demoEditor: demoTextField
        }),
    ]
};
