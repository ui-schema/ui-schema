import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaLists = createOrderedMap({
    type: "object",
    properties: {
        events: {
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
            },
        },
        labels: {
            type: "array",
            widget: "SimpleList",
            view: {
                sizeXs: 12,
                sizeMd: 12,
                btnSize: 'small'
            },
            minItems: 2,
            items: {
                type: 'string',
                tt: 'ol',
                minLength: 3,
                maxLength: 5,
                view: {
                    dense: true
                },
            },
        },
    },
});

export {schemaLists}
