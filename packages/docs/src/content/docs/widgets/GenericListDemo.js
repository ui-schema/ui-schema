const demoGenericList = [
    [
        `
### Demo Generic List

This schema describes \`event\` (concert etc.) data, multiple events are possible, each is saved in an nested \`object\`
`,
        {
            type: "array",
            widget: "GenericList",
            view: {
                sizeXs: 12,
                sizeMd: 12,
                btnSize: 'small'
            },
            items: {
                type: 'object',
                properties: {
                    info: {
                        type: 'object',
                        properties: {
                            name: {
                                type: 'string',
                                view: {
                                    sizeXs: 6,
                                }
                            },
                            location: {
                                type: 'string',
                                view: {
                                    sizeXs: 6,
                                }
                            },
                            date: {
                                type: 'string',
                                view: {
                                    sizeXs: 12,
                                }
                            },
                        }
                    },
                    max_guests: {
                        type: 'number',
                        view: {
                            sizeXs: 4,
                        }
                    },
                    booked: {
                        type: 'number',
                        view: {
                            sizeXs: 4,
                        }
                    },
                    end_check: {
                        type: 'boolean',
                        view: {
                            sizeXs: 4,
                        }
                    }
                }
            }
        }
    ],
];

export {demoGenericList}
