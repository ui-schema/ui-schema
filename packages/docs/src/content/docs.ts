import { demoAccordions } from './docs/widgets/AccordionsDemo'
import { demoCode } from './docs/material-code/material-codeDemo'
import { demoColorful } from './docs/material-colorful/material-colorfulDemo'
import { demoColor } from './docs/widgets/ColorDemo'
import { demoDateTimePickers } from './docs/widgets/DateTimePickersDemo'
import { demoGenericList } from './docs/widgets/GenericListDemo'
import { demoGridHandler } from './docs/widgets/GridHandlerDemo'
import { demoOptionsList } from './docs/widgets/OptionsListDemo'
import { demoRichText } from './docs/widgets/RichTextDemo'
import { demoNumberSlider } from './docs/widgets/NumberSliderDemo'
import { demoSelect } from './docs/widgets/SelectDemo'
import { demoSimpleList } from './docs/widgets/SimpleListDemo'
import { demoStepper } from './docs/widgets/StepperDemo'
import { demoSwitch } from './docs/widgets/SwitchDemo'
import { demoTable } from './docs/widgets/TableDemo'
import { demoTextField } from './docs/widgets/TextFieldDemo'
import { demoEditorJS } from './docs/widgets/EditorJSDemo'
import { demoDragnDropGenericDemo } from './docs/material-dnd/widgets-genericDemo'
import { demoSelectChips } from './docs/widgets/SelectChipsDemo'
import { demoCard } from './docs/widgets/CardDemo'
import { TsDocModule } from '@control-ui/docs-ts/TsDocModule'
import { DocRoute } from '@control-ui/docs'
import { demoOptionsRead } from './docs/ds-material/widgets-read/OptionsReadDemo'
import { demoBooleanRead } from './docs/ds-material/widgets-read/BooleanReadDemo'
import { demoChipsRead } from './docs/ds-material/widgets-read/ChipsReadDemo'
import { demoTextFieldRead } from './docs/ds-material/widgets-read/TextFieldReadDemo'

export interface DocRouteModule<C = any> extends DocRoute<C> {
    docModule?: TsDocModule
    demos?: { [k: string]: any }
}

const createDoc = (
    path: string,
    label: string,
    {prefix = '', module, hidden, ...extras}: {
        routes?: DocRouteModule[]
        demos?: DocRouteModule['demos']
        prefix?: string
        hidden?: boolean
        module?: DocRouteModule['docModule']
    } = {},
): DocRouteModule => ({
    doc: 'docs/' + path,
    path: prefix + '/docs/' + path,
    nav: hidden ? undefined : {
        to: '/docs/' + path,
        initialOpen: false,
        label,
    },
    docModule: module,
    /*config: {
        content: {},
    },*/
    ...extras,
})

const defineModule = (org: string, name: string, dir: string, from: string, customFiles?: string[]): TsDocModule => ({
    modulePath: `${dir}/src/${from}/`,
    relPath: `${dir}/src/${from}/`,
    package: `@${org}/${name}`,
    fromPath: from,
    files: customFiles ? customFiles : [from + '.tsx'],
})

const defineModuleFlat = (org: string, name: string, dir: string, rel: string, from: string, ext: string): TsDocModule => ({
    modulePath: `${dir}/src/${rel}/`,
    // modulePath: `${dir}/src/${rel}/${from}`,
    relPath: `${dir}/src/${rel}/`,
    package: `@${org}/${name}`,
    // todo: fromPath should be just `rel`,
    //       as e.g. `@ui-schema/ds-material/BaseComponents/Table/TableContext` is only correctly exported via `@ui-schema/ds-material/BaseComponents/Table`
    //       but is used by doc-gen to generate output dir atm.
    fromPath: rel,
    // fromPath: rel + '/' + from,
    // @ts-ignore
    moduleFilePath: rel + '/' + from, // todo: maybe reuse pagePath or similar?
    files: [from + ext],
})

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
    createDoc('widgets-composition', 'Composition Concepts'),
]

export const routesFurtherDesignSystem = [
    {
        nav: {
            label: 'Widgets List',
            toSection: /^\/docs\/widgets\//,
        },
        routes: [
            createDoc('widgets/Accordions', 'Accordions', {
                demos: {
                    schema: demoAccordions,
                },
            }),
            createDoc('widgets/Card', 'Card', {
                demos: {
                    schema: demoCard,
                },
            }),
            createDoc('widgets/Code', 'Code Editor', {
                hidden: true,
            }),
            createDoc('widgets/Color', 'Color Picker', {
                hidden: true,
            }),
            createDoc('widgets/DateTimePickers', 'Date + Time Pickers', {
                hidden: true,
                demos: {
                    schema: demoDateTimePickers,
                },
            }),
            createDoc('widgets/EditorJS', 'EditorJS', {
                demos: {
                    schema: demoEditorJS,
                },
            }),
            createDoc('widgets/GenericList', 'Generic List', {
                demos: {
                    schema: demoGenericList,
                },
            }),
            createDoc('widgets/GridHandler', 'Grid Handler', {
                demos: {
                    schema: demoGridHandler,
                },
            }),
            createDoc('widgets/OptionsList', 'Options List', {
                demos: {
                    schema: demoOptionsList,
                },
            }),
            createDoc('widgets/RichText', 'Rich-Text / Rich-Content', {
                demos: {
                    schema: demoRichText,
                },
            }),
            createDoc('widgets/NumberSlider', 'Number Slider', {
                demos: {
                    schema: demoNumberSlider,
                },
            }),
            createDoc('widgets/Select', 'Select', {
                demos: {
                    schema: demoSelect,
                },
            }),
            createDoc('widgets/SelectChips', 'Select Chips', {
                demos: {
                    schema: demoSelectChips,
                },
            }),
            createDoc('widgets/SimpleList', 'Simple List', {
                demos: {
                    schema: demoSimpleList,
                },
            }),
            createDoc('widgets/Stepper', 'Stepper', {
                demos: {
                    schema: demoStepper,
                },
            }),
            createDoc('widgets/Switch', 'Switch', {
                demos: {
                    schema: demoSwitch,
                },
            }),
            createDoc('widgets/Table', 'Table', {
                demos: {
                    schema: demoTable,
                },
            }),
            createDoc('widgets/TextField', 'TextField', {
                demos: {
                    schema: demoTextField,
                },
            }),
        ],
    }, {
        nav: {
            label: 'DS Material',
            initialOpen: false,
            to: '/docs/ds-material',
        },
        routes: [
            createDoc('ds-material/Grid', 'Grid', {
                module: defineModule('ui-schema', 'ds-material', 'ds-material', 'Grid'),
            }),
            {
                nav: {
                    label: 'Base Components',
                    initialOpen: false,
                    to: '/docs/ds-material/BaseComponents',
                    // toSection: /^(\/docs\/ds-material\/Table|\/docs\/ds-material\/GenericList|)/,
                },
                routes: [
                    {
                        // doc: 'ds-material/Table',
                        path: '/docs/ds-material/BaseComponents/Table',
                        nav: {
                            to: '/docs/ds-material/BaseComponents/Table',
                            label: 'Table',
                            initialOpen: false,
                            // toSection: /^(\/docs\/ds-material\/Table)/,
                        },
                        routes: [
                            createDoc('ds-material/BaseComponents/Table/Overview', 'Table Overview'),
                            createDoc('ds-material/BaseComponents/Table/TableContext', 'TableContext', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TableContext', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/Table/TableFooter', 'TableFooter', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TableFooter', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/Table/TableHeader', 'TableHeader', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TableHeader', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/Table/TablePaginationActions', 'TablePaginationActions', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TablePaginationActions', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/Table/TableRenderer', 'TableRenderer', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TableRenderer', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/Table/TableRowActionDelete', 'TableRowActionDelete', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TableRowActionDelete', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/Table/TableRowRenderer', 'TableRowRenderer', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TableRowRenderer', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/Table/TableTypes', 'TableTypes', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/Table', 'TableTypes', '.ts'),
                            }),
                        ],
                    },
                    {
                        // doc: 'ds-material/Table',
                        path: '/docs/ds-material/BaseComponents/GenericList',
                        nav: {
                            to: '/docs/ds-material/BaseComponents/GenericList',
                            label: 'GenericList',
                            initialOpen: false,
                            // toSection: /^(\/docs\/ds-material\/GenericList)/,
                        },
                        routes: [
                            createDoc('ds-material/BaseComponents/GenericList/Overview', 'GenericList Overview'),
                            createDoc('ds-material/BaseComponents/GenericList/GenericListContent', 'GenericListContent', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/GenericList', 'GenericListContent', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/GenericList/GenericListFooter', 'GenericListFooter', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/GenericList', 'GenericListFooter', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/GenericList/GenericListItem', 'GenericListItem', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/GenericList', 'GenericListItem', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/GenericList/GenericListItemMore', 'GenericListItemMore', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/GenericList', 'GenericListItemMore', '.tsx'),
                            }),
                            createDoc('ds-material/BaseComponents/GenericList/GenericListItemPos', 'GenericListItemPos', {
                                module: defineModuleFlat('ui-schema', 'ds-material', 'ds-material', 'BaseComponents/GenericList', 'GenericListItemPos', '.tsx'),
                            }),
                        ],
                    },
                ],
            },
            {
                nav: {
                    label: 'Components',
                    initialOpen: false,
                    to: '/docs/ds-material/Component',
                },
                routes: [
                    createDoc('ds-material/Component/InfoRenderer', 'InfoRenderer', {
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'Component/InfoRenderer', ['InfoRenderer.tsx']),
                    }),
                    createDoc('ds-material/Component/ListButton', 'ListButton', {
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'Component/ListButton', ['ListButton.tsx']),
                    }),
                    createDoc('ds-material/Component/LocaleHelperText', 'LocaleHelperText', {
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'Component/LocaleHelperText', ['LocaleHelperText.tsx']),
                    }),
                    createDoc('ds-material/Component/TitleBoxRead', 'TitleBoxRead', {
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'Component/TitleBoxRead', ['TitleBoxRead.tsx']),
                    }),
                    createDoc('ds-material/Component/Tooltip', 'Tooltip', {
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'Component/Tooltip', ['Tooltip.tsx']),
                    }),
                ],
            },
            {
                nav: {
                    label: 'Widgets: Read-Only',
                    initialOpen: false,
                    to: '/docs/ds-material/widgets-read',
                },
                routes: [
                    createDoc('ds-material/widgets-read/BooleanRead', 'BooleanRead', {
                        demos: {
                            readOnly: true,
                            schema: demoBooleanRead,
                        },
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'WidgetsRead/WidgetBooleanRead', ['WidgetBooleanRead.tsx']),
                    }),
                    createDoc('ds-material/widgets-read/ChipsRead', 'ChipsRead', {
                        demos: {
                            readOnly: true,
                            schema: demoChipsRead,
                        },
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'WidgetsRead/WidgetChipsRead', ['WidgetChipsRead.tsx']),
                    }),
                    // createDoc('ds-material/widgets-read/EnumRead', 'EnumRead', { // todo: add redirect
                    //     demos: {},
                    //     module: defineModule('ui-schema', 'ds-material', 'ds-material', 'WidgetsRead/WidgetEnumRead', ['WidgetEnumRead.tsx']),
                    // }),
                    // createDoc('ds-material/widgets-read/OneOfRead', 'OneOfRead', { // todo: add redirect
                    //     demos: {},
                    //     module: defineModule('ui-schema', 'ds-material', 'ds-material', 'WidgetsRead/WidgetOneOfRead', ['WidgetOneOfRead.tsx']),
                    // }),
                    createDoc('ds-material/widgets-read/OptionsRead', 'OptionsRead', {
                        demos: {
                            readOnly: true,
                            schema: demoOptionsRead,
                        },
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'WidgetsRead/WidgetOptionsRead', ['WidgetOptionsRead.tsx']),
                    }),
                    createDoc('ds-material/widgets-read/TextFieldRead', 'TextFieldRead', {
                        demos: {
                            readOnly: true,
                            schema: demoTextFieldRead,
                        },
                        module: defineModule('ui-schema', 'ds-material', 'ds-material', 'WidgetsRead/WidgetTextFieldRead', ['WidgetTextFieldRead.tsx']),
                    }),
                ],
            },
            createDoc('ds-material/GridContainer', 'GridContainer', {
                module: defineModule('ui-schema', 'ds-material', 'ds-material', 'GridContainer'),
            }),
            createDoc('ds-material/ErrorFallback', 'ErrorFallback', {
                module: defineModule('ui-schema', 'ds-material', 'ds-material', 'ErrorFallback'),
            }),
        ],
    }, {
        nav: {
            label: 'Material Pickers',
            initialOpen: false,
            to: '/docs/material-pickers',
        },
        routes: [
            createDoc('material-pickers/Overview', 'Overview'),
            createDoc('material-pickers/WidgetDatePicker', 'WidgetDatePicker', {
                demos: {},
                module: defineModule('ui-schema', 'material-pickers', 'material-pickers', 'WidgetDatePicker'),
            }),
            createDoc('material-pickers/WidgetDateTimePicker', 'WidgetDateTimePicker', {
                demos: {},
                module: defineModule('ui-schema', 'material-pickers', 'material-pickers', 'WidgetDateTimePicker'),
            }),
            createDoc('material-pickers/WidgetTimePicker', 'WidgetTimePicker', {
                demos: {},
                module: defineModule('ui-schema', 'material-pickers', 'material-pickers', 'WidgetTimePicker'),
            }),
        ],
    }, {
        nav: {
            label: 'Material Code',
            initialOpen: false,
            to: '/docs/material-code',
        },
        routes: [
            createDoc('material-code/material-code', 'Overview', {
                demos: {
                    schema: demoCode,
                },
            }),
        ],
    }, {
        nav: {
            label: 'Material Color',
            initialOpen: false,
            to: '/docs/material-color',
        },
        routes: [
            createDoc('material-color/material-color', 'Overview', {
                demos: {
                    schema: demoColor,
                },
            }),
        ],
    }, {
        nav: {
            label: 'Material Colorful',
            initialOpen: false,
            to: '/docs/material-colorful',
        },
        routes: [
            createDoc('material-colorful/material-colorful', 'Overview', {
                demos: {
                    schema: demoColorful,
                },
            }),
        ],
    }, {
        nav: {
            label: 'Material-DND',
            initialOpen: false,
            to: '/docs/material-dnd',
        },
        routes: [
            createDoc('material-dnd/overview', 'Overview'),
            createDoc('material-dnd/widgets-generic', 'Widgets Generic', {
                demos: {
                    schema: demoDragnDropGenericDemo,
                },
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
            createDoc('kit-dnd/kit-dnd', 'Overview'),
        ],
    }, {
        nav: {
            label: 'Kit: CodeMirror',
            initialOpen: false,
            to: '/docs/kit-codemirror',
        },
        routes: [
            createDoc('kit-codemirror/kit-codemirror', 'Overview'),
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
}
