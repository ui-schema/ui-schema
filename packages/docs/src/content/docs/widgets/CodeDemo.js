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
                    }
                },
                code_bg: {
                    type: 'string',
                    format: 'css',
                    widget: 'Code',
                    view: {
                        sizeXs: 12,
                        bg: true,
                    }
                },
                code_2: {
                    type: 'string',
                    format: ['json', 'js', 'html'],
                    widget: 'Code',
                },
                normal_string: {
                    type: 'string',
                },
            }
        }
    ],
];

export {demoCode}
