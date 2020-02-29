import {demoTextField} from "./docs/widgets/TextFieldDemo";
import {demoOptionsList} from "./docs/widgets/OptionsListDemo";
import {demoSwitch} from "./docs/widgets/SwitchDemo";
import {demoSelect} from "./docs/widgets/SelectDemo";
import {demoStepper} from "./docs/widgets/StepperDemo";
import {demoSimpleList} from "./docs/widgets/SimpleListDemo";
import {demoGridHandler} from "./docs/widgets/GridHandlerDemo";
import {demoGenericList} from "./docs/widgets/GenericListDemo";
import {demoNumberSlider} from "./docs/widgets/NumberSliderDemo";
import {demoCode} from "./docs/widgets/CodeDemo";
import {demoRichText} from "./docs/widgets/RichTextDemo";
import {demoDateTimePickers} from "./docs/widgets/DateTimePickersDemo";
import {demoColor} from "./docs/widgets/ColorDemo";

const contentDocs = [
    ['overview', 'Overview'],
    ['schema', 'Schema'],
    ['design-systems', 'Design-Systems'],
    ['widgets', 'Widgets'],
    ['widget-plugins', 'Widget-Plugins'],
    ['performance', 'Performance'],
    ['localization', 'Localization'],
    ['core', 'Core'],
];

const contentDocsWidgets = [
    ['widgets/Code', 'Code Editor', {
        demoEditor: demoCode
    }],
    ['widgets/Color', 'Color Picker', {
        demoEditor: demoColor
    }],
    ['widgets/DateTimePickers', 'Date + Time Pickers', {
        demoEditor: demoDateTimePickers
    }],
    ['widgets/GenericList', 'Generic List', {
        demoEditor: demoGenericList
    }],
    ['widgets/GridHandler', 'Grid Handler', {
        demoEditor: demoGridHandler
    }],
    ['widgets/OptionsList', 'Options List', {
        demoEditor: demoOptionsList
    }],
    ['widgets/RichText', 'RichText / WYSIWYG', {
        demoEditor: demoRichText
    }],
    ['widgets/NumberSlider', 'Number Slider', {
        demoEditor: demoNumberSlider
    }],
    ['widgets/Select', 'Select', {
        demoEditor: demoSelect
    }],
    ['widgets/SimpleList', 'Simple List', {
        demoEditor: demoSimpleList
    }],
    ['widgets/Stepper', 'Stepper', {
        demoEditor: demoStepper
    }],
    ['widgets/Switch', 'Switch', {
        demoEditor: demoSwitch
    }],
    ['widgets/TextField', 'TextField', {
        demoEditor: demoTextField
    }],
];

export {contentDocs, contentDocsWidgets}
