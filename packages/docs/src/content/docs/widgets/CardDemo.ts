import { DemoWidget } from '../../../schemas/_list'

export const demoCard: DemoWidget[] = [
    [
        `
### Demo
`,
        {
            '$id': 'https://ui-schema.bemit.codes/schemas/demo-referencing-network.json',
            type: 'object',
            widget: 'Card',
            title: 'Address',
            view: {
                variant: 'outlined',
            },
            properties: {
                street: {
                    type: 'string',
                    view: {
                        sizeMd: 9,
                    },
                },
                street_no: {
                    type: 'string',
                    view: {
                        sizeMd: 3,
                    },
                },
                city: {
                    type: 'string',
                    view: {
                        sizeMd: 12,
                    },
                },
                country: {
                    type: 'string',
                    view: {
                        sizeMd: 12,
                    },
                },
            },
        },
    ],
]
