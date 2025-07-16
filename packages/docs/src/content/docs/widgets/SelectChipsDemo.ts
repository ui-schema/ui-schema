import { DemoWidget } from '../../../schemas/_list'

export const demoSelectChips: DemoWidget[] = [
    [
        `
### Demo Select Chips
`,
        {
            type: 'array',
            widget: 'SelectChips',
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
    ],
]
