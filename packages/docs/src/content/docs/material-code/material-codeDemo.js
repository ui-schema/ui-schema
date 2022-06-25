const demoCode = [
    [
        `
### Demo
`,
        {
            type: 'object',
            properties: {
                code: {
                    type: 'string',
                    format: 'css',
                    widget: 'Code',
                    view: {
                        sizeXs: 12,
                    },
                },
                code_bg: {
                    type: 'string',
                    format: 'css',
                    widget: 'Code',
                    view: {
                        sizeXs: 12,
                        bg: true,
                    },
                },
                code_selectable: {
                    type: 'array',
                    format: ['json', 'js', 'html'],
                    widget: 'CodeSelectable',
                    formatDefault: 'json',
                },
                code_no_title: {
                    type: 'string',
                    format: 'css',
                    widget: 'Code',
                    view: {
                        hideTitle: true,
                    },
                },
                code_selectable_no_title: {
                    type: 'array',
                    format: ['json', 'js', 'css', 'html'],
                    widget: 'CodeSelectable',
                    formatDefault: 'js',
                    view: {
                        hideTitle: true,
                    },
                },
                normal_string: {
                    type: 'string',
                },
            },
        },
    ],
];

export {demoCode}
