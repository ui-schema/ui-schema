const demoSelect = [
    [
        `
### Demo Select One
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'string', widget: 'Select',
                    enum: ['sidebar_left', 'sidebar_right', 'notice', 'content', 'footer',],
                }
            }
        }
    ], [
        `
### Demo Select Multiple
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'array', widget: 'SelectMulti', default: ['notice'],
                    enum: ['sidebar_left', 'sidebar_right', 'notice', 'content', 'footer',],
                }
            }
        }
    ], [
        `
### Demo Select Multiple

This component uses the view keyword \`dense\`:
`,
        {
            type: 'object', properties: {
                demo_input: {
                    type: 'array', widget: 'SelectMulti', default: ['notice'],
                    enum: ['sidebar_left', 'sidebar_right', 'notice', 'content', 'footer',],
                    view: {dense: true},
                }
            }
        }
    ],
];

export {demoSelect}
