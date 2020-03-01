const demoOptionsList = [
    [
        `
### Demo Checkboxes
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'array', widget: 'OptionsCheck', default: ['notice'],
                    enum: ['sidebar_left', 'sidebar_right', 'notice', 'content', 'footer',],
                }
            }
        }
    ], [
        `
### Demo Radio
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'string', widget: 'OptionsRadio',
                    enum: ['yes', 'no', 'maybe'],
                }
            }
        }
    ],
];

export {demoOptionsList}
