import {createOrderedMap} from '@ui-schema/system/createMap';

const schemaLists = createOrderedMap({
    type: 'object',
    //hidden: true,
    required: [
        'events',
    ],
    properties: {
        id: {
            type: 'string',
            //default: 'demo',
            hidden: true,
        },
        events: {
            type: 'array',
            widget: 'GenericList',
            /*hidden: true,
            default: [{
                'info': {
                    'name': 'Michael',
                    'location': 'Mainz',
                },
                'max_guests': 4,
                'end_check': true,
            }],*/
            view: {
                sizeXs: 12,
                sizeMd: 12,
                btnSize: 'small',
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
                                },
                            },
                            location: {
                                type: 'string',
                                view: {
                                    sizeXs: 6,
                                },
                            },
                            date: {
                                type: 'string',
                                view: {
                                    sizeXs: 12,
                                },
                            },
                        },
                    },
                    max_guests: {
                        type: 'number',
                        view: {
                            sizeXs: 4,
                        },
                    },
                    booked: {
                        type: 'number',
                        view: {
                            sizeXs: 4,
                        },
                    },
                    end_check: {
                        type: 'boolean',
                        view: {
                            sizeXs: 4,
                        },
                    },
                },
            },
        },
        addresses: {
            type: 'array',
            widget: 'GenericList',
            view: {
                sizeXs: 12,
                sizeMd: 12,
                btnSize: 'small',
            },
            items: {
                type: 'array',
                items: [
                    {
                        type: 'number',
                        title: 'Street No.',
                        view: {
                            sizeMd: 6,
                        },
                    },
                    {
                        type: 'string',
                        title: 'Street',
                        view: {
                            sizeMd: 6,
                        },
                    },
                    {
                        type: 'string',
                        widget: 'Select',
                        title: 'Street Type',
                        enum: ['Street', 'Avenue', 'Boulevard'],
                        view: {
                            sizeMd: 6,
                        },
                    },
                    {
                        type: 'string',
                        widget: 'Select',
                        title: 'Direction',
                        enum: ['NW', 'NE', 'SW', 'SE'],
                        view: {
                            sizeMd: 6,
                        },
                    },
                ],
                additionalItems: false,
            },
        },
        labels: {
            type: 'array',
            widget: 'SimpleList',
            deleteOnEmpty: true,
            view: {
                sizeXs: 12,
                sizeMd: 12,
                btnSize: 'small',
            },
            minItems: 2,
            items: {
                type: 'string',
                tt: 'ol',
                minLength: 3,
                maxLength: 5,
                view: {
                    dense: true,
                },
            },
        },
    },
});

export {schemaLists}
