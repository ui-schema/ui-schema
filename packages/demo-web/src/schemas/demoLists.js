import {createOrderedMap} from '@ui-schema/ui-schema/createMap';

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
            //notSortable: true,
            //notAddable: true,
            //notDeletable: true,
            default: [
                {
                    'info': {
                        'name': 'dsasfd',
                        'location': 'sfdfds',
                    },
                    'max_guests': 5,
                    'booked': 6,
                    'end_check': true,
                },
                {
                    'info': {
                        'date': 'dsasdafasd',
                        'location': 'dsadsa',
                    },
                },
                {
                    'info': {
                        'name': 'dadasds',
                    },
                    'end_check': true,
                },
            ],
            listActionLabels: {
                en: {
                    add: 'New event',
                    remove: 'Remove event',
                },
                de: {
                    add: 'Neue Veranstaltung',
                    remove: 'Lösche Veranstaltung',
                },
            },
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
            info: [
                'Store some cities and streets and stuff',
            ],
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
            info: [
                'Add some labels and enjoy your coffee!',
            ],
            default: [
                'adfn',
                'mnbvf',
                'ertyh1234',
            ],
            //notAddable: true,
            //notDeletable: true,
            minItems: 2,
            items: {
                type: 'string',
                tt: 'ol',
                minLength: 3,
                maxLength: 5,
                view: {
                    dense: true,
                },
                default: 'xy_',
            },
        },
    },
});

export {schemaLists}
