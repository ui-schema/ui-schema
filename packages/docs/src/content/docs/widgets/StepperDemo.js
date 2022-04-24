const demoStepperSchema = {
    type: "object",
    widget: "Stepper",
    properties: {
        'step-1': {
            type: "object",
            properties: {
                name: {
                    type: "string",
                    minLength: 2,
                    maxLength: 3,
                    view: {
                        sizeMd: 6,
                    }
                },
                surname: {
                    type: "string",
                    view: {
                        sizeMd: 6
                    }
                },
            },
            required: [
                'surname'
            ]
        },
        'step-2': {
            type: "object",
            properties: {
                topics: {
                    type: "array",
                    widget: "SelectMulti",
                    view: {
                        sizeMd: 3
                    },
                    'items': {
                        'oneOf': [
                            {'const': 'theater'},
                            {'const': 'crime'},
                            {'const': 'sci-fi'},
                            {'const': 'horror'},
                        ],
                    },
                    enum: [
                        'theater',
                        'crime',
                        'sci-fi',
                        'horror',
                    ],
                },
            }
        },
        'step-3': {
            type: "object",
            properties: {
                accepted: {
                    type: "boolean",
                },
            }
        },
    }
};

const demoStepper = [
    [
        `
### Demo Stepper
`,
        demoStepperSchema,
    ],
];

export {demoStepper, demoStepperSchema}
