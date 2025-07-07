import { DemoWidget } from '../../../schemas/_list'

const demoTextField: DemoWidget[] = [
    [
        `
### Demo string
`,
        {type: 'object', properties: {demo_input: {type: 'string'}}},
    ],
    [
        `
### Demo string multiline
`,
        {type: 'object', properties: {demo_input: {type: 'string', widget: 'Text'}}},
    ],
    [
        `
### Demo string multiline w/ rows

This multi-line input shows minimum 3 rows and grows to max 6 rows.
`,
        {type: 'object', properties: {demo_input: {type: 'string', widget: 'Text', view: {rows: 3, rowsMax: 6}}}},
    ],
    [
        `
### Demo number
`,
        {type: 'object', properties: {demo_input: {type: 'number'}}},
    ],
]

export { demoTextField }
