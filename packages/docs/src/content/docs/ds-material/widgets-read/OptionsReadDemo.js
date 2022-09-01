export const demoOptionsRead = [
    [
        `
### Demo
`,
        {
            type: 'object',
            properties: {
                layouts: {
                    type: 'array',
                    widget: 'OptionsCheck',
                    view: {
                        sizeMd: 3,
                    },
                    items: {
                        oneOf: [
                            {
                                const: 'notice',
                            }, {
                                const: 'content',
                            }, {
                                const: 'footer',
                            },
                        ],
                    },
                },
                sizeDef: {
                    type: 'string',
                    widget: 'OptionsRadio',
                    view: {
                        sizeMd: 3,
                    },
                    enum: [
                        'small',
                        'medium',
                        'big',
                    ],
                },
                topics: {
                    type: 'array',
                    widget: 'SelectMulti',
                    view: {
                        sizeMd: 3,
                    },
                    items: {
                        oneOf: [
                            {const: 'theater'},
                            {const: 'crime'},
                            {const: 'sci-fi'},
                            {const: 'horror'},
                        ],
                    },
                },
                align: {
                    type: 'string',
                    widget: 'Select',
                    view: {
                        sizeMd: 3,
                    },
                    oneOf: [
                        {const: 'top', title: '⇑'},
                        {const: 'right', title: '⇒'},
                        {const: 'bottom', title: '⇓'},
                        {const: 'left', title: '⇐'},
                    ],
                },
            },
        },
        {layouts: ['notice', 'content'], sizeDef: 'medium', align: 'top'},
    ],
]
