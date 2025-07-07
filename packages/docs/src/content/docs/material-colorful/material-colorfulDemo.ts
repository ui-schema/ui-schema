import { DemoWidget } from '../../../schemas/_list'

const demoColorful: DemoWidget[] = [
    [
        `
### Demo
`,
        {
            type: 'object',
            properties: {
                color: {
                    type: 'string',
                    widget: 'Colorful',
                    default: '#05aeca',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                    },
                },
                color_2: {
                    type: 'string',
                    widget: 'Colorful',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                    },
                },
                color_hsla: {
                    type: 'object',
                    widget: 'ColorfulHsla',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                    },
                },
                color_hsla2: {
                    type: 'object',
                    widget: 'ColorfulHsla',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                        pickerHeight: 125,
                        showValueText: true,
                    },
                },
                color_rgba: {
                    type: 'object',
                    widget: 'ColorfulRgba',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                        pickerHeight: 125,
                        showValueText: true,
                    },
                },
                color_rgba_string: {
                    type: 'string',
                    widget: 'ColorfulRgba',
                    view: {
                        sizeXs: 12,
                        sizeMd: 6,
                        pickerHeight: 125,
                        showValueText: true,
                    },
                },
            },
            required: ['color_2'],
        },
    ],
]

export { demoColorful }
