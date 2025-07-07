import { DemoWidget } from '../../../../schemas/_list'

export const demoBooleanRead: DemoWidget[] = [
    [
        `
### Demo
`,
        {
            type: 'object',
            properties: {
                some_question: {
                    type: 'boolean',
                },
                another_question: {
                    type: 'boolean',
                },
            },
        },
        {some_question: true},
    ],
]
