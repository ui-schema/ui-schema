import { DemoWidget } from '../../../schemas/_list'

const demoOptionsList: DemoWidget[] = [
    [
        `
### Demo Checkboxes
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'array', widget: 'OptionsCheck', default: ['notice'],
                    items: {
                        oneOf: [
                            {
                                const: 'sidebar_left',
                                t: {
                                    de: {
                                        title: 'Linke Sidebar',
                                    },
                                    en: {
                                        title: 'Left Sidebar',
                                    },
                                },
                            },
                            {
                                const: 'sidebar_right',
                            },
                            {
                                const: 'notice',
                            },
                            {
                                const: 'content',
                            },
                            {
                                const: 'footer',
                            },
                        ],
                    },
                },
            },
        },
    ],
    [
        `
### Demo Radio
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'string', widget: 'OptionsRadio',
                    enum: ['yes', 'no', 'maybe'],
                },
            },
        },
    ],
]

export { demoOptionsList }
