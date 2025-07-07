import { DemoWidget } from '../../../schemas/_list'

const demoSimpleList: DemoWidget[] = [
    [
        `
### Demo string List
`,
        {
            type: 'object',
            properties: {
                labels: {
                    type: 'array',
                    widget: 'SimpleList',
                    items: {
                        type: 'string',
                        tt: 'ol',
                    },
                    view: {
                        sizeXs: 12,
                        sizeMd: 12,
                        btnSize: 'small',
                    },
                },
            },
        },
    ],
    [
        `
### Demo string multiline List
`,
        {
            type: 'object',
            properties: {
                labels: {
                    type: 'array',
                    widget: 'SimpleList',
                    items: {
                        type: 'string',
                        widget: 'Text',
                        tt: 'ol',
                    },
                    view: {
                        sizeXs: 12,
                        sizeMd: 12,
                        rows: 3,
                        btnSize: 'small',
                    },
                },
            },
        },
    ],
    [
        `
### Demo number List
`,
        {
            type: 'object',
            properties: {
                labels: {
                    type: 'array',
                    widget: 'SimpleList',
                    items: {
                        type: 'number',
                        tt: 'ol',
                    },
                    view: {
                        sizeXs: 12,
                        sizeMd: 12,
                        rows: 3,
                        btnSize: 'small',
                    },
                },
            },
        },
    ],
]

export { demoSimpleList }
