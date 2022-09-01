export const demoTextFieldRead = [
    [
        `
### Demo
`,
        {
            type: 'object',
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
                comment: {
                    type: 'string',
                    widget: 'Text',
                    view: {
                        sizeMd: 12,
                    },
                },
                persons: {
                    type: 'number',
                    view: {
                        sizeMd: 12,
                    },
                },
            },
        },
        {
            street: 'Irgendeine Str.', street_no: '193a', city: 'Berlin', country: 'Germany',
            comment: 'Lorem ipsum dolor sit amet.\nQui dolorem ipsum, quia dolor sit, amet, consectetur, adipisci velit.',
            persons: 3,
        },
    ],
]
