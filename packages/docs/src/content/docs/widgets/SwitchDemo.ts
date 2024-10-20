import { DemoWidget } from '../../../schemas/_list'

const demoSwitch: DemoWidget[] = [
    [
        `
### Demo Switch
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'boolean',
                },
            },
        },
    ],
]

export { demoSwitch }
