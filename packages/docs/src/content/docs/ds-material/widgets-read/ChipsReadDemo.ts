import { DemoWidget } from '../../../../schemas/_list'

export const demoChipsRead: DemoWidget[] = [
    [
        `
### Demo
`,
        {
            type: 'array',
            widget: 'SelectChips',
            title: 'Services',
            items: {
                type: 'string',
                oneOf: [
                    {const: 'development'},
                    {
                        const: 'dev_ops',
                        title: 'Dev-Ops',
                    },
                    {
                        const: 'design',
                        title: 'Creative',
                    },
                    {const: 'hosting'},
                    {const: 'consulting'},
                ],
            },
        },
        ['consulting', 'development'],
    ],
]
