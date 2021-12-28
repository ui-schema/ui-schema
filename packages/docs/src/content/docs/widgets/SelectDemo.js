const demoSelect = [
    [
        `
### Demo Select One
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'string', widget: 'Select',
                    enum: ['sidebar_left', 'sidebar_right', 'notice', 'content', 'footer'],
                },
            },
        },
    ], [
        `
### Demo Select Multiple
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'array', widget: 'SelectMulti', default: ['notice'],
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
                            }, {
                                const: 'sidebar_right',
                            }, {
                                const: 'notice',
                            }, {
                                const: 'content',
                            }, {
                                const: 'footer',
                            },
                        ],
                    },
                },
            },
        },
    ], [
        `
### Demo Select Multiple

This component uses the view keyword \`dense\`:
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'array', widget: 'SelectMulti', default: ['notice'],
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
                            }, {
                                const: 'sidebar_right',
                            }, {
                                const: 'notice',
                            }, {
                                const: 'content',
                            }, {
                                const: 'footer',
                            },
                        ],
                    },
                    view: {dense: true},
                },
            },
        },
    ],
];

export {demoSelect}
