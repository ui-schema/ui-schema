import {createOrderedMap} from '@ui-schema/ui-schema';

export const schemaDemoReferencing = createOrderedMap({
    '$id': 'http://localhost:4200/api/demo-referencing.json',
    type: 'object',
    widget: 'Accordions',
    title: 'headline',
    view: {
        spacing: 0,
        noGrid: true,
    },
    /*view: {
        sizeMd: 6,
    },*/
    // $defs: {
    definitions: {
        country_0: {
            type: 'string',
            '$id': '#country_id',
            widget: 'Select',
            enum: ['germany', 'austria', 'swiss', 'france', 'denmark'],
        },
        country_1: {
            type: 'string',
            '$anchor': 'country_anchor',
            widget: 'Select',
            enum: ['germany', 'austria', 'swiss', 'france', 'denmark'],
        },
        germany: {
            type: 'string',
            '$anchor': 'germany',
            const: 'germany',
        },
        address: {
            type: 'object',
            properties: {
                street_address: {type: 'string'},
                city: {type: 'string'},
                state: {type: 'string'},
                country: {$ref: '#country_anchor'},
            },
            required: ['street_address', 'city', 'state'],
        },
        address_id: {
            '$id': '#address_id',
            type: 'object',
            properties: {
                street_address: {type: 'string'},
                city: {type: 'string'},
                state: {type: 'string'},
                country: {$ref: '#country_id'},
            },
            required: ['street_address', 'city', 'state'],
        },
        address_germany: {
            '$id': '#address_germany',
            type: 'object',
            allOf: [
                {
                    if: {properties: {country: {$ref: '#germany'}}},
                    then: {properties: {privacy: {type: 'boolean'}}},
                    else: {properties: {}},
                },
                {$ref: '#address_id'},
            ],
        },
        person: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                children: {
                    type: 'array',
                    widget: 'GenericList',
                    items: {$ref: '#/definitions/person'},
                    'default': [],
                },
            },
        },
    },
    properties: {
        address: {$ref: '#/definitions/address'},
        address_id: {$ref: '#address_id'},
        address_germany: {$ref: '#address_germany'},
        shipping_address: {
            allOf: [
                {$ref: '#/definitions/address'},
                {
                    type: 'object',
                    properties: {
                        type: {
                            type: 'string',
                            widget: 'Select',
                            'enum': ['residential', 'business'],
                        },
                    },
                    required: ['type'],
                },
            ],
        },
        support_request: {'$ref': 'definitions.json#/support_request'},
        person: {$ref: '#/definitions/person'},
    },
});

export const schemaDemoReferencingNetwork = createOrderedMap({
    '$id': 'http://localhost:4200/api/demo-referencing-network.json',
    type: 'object',
    properties: {
        address: {$ref: 'http://localhost:4200/api/address-schema.json'},
        shipping_address: {$ref: 'address-schema.json'},
        business_country: {$ref: 'address-schema.json/#properties/country'},
    },
});

export const schemaDemoReferencingNetworkB = createOrderedMap({
    '$id': 'http://localhost:4200/api/demo-referencing-network-b.json',
    type: 'object',
    properties: {
        address: {
            type: 'object',
            allOf: [
                {$ref: 'http://localhost:4200/api/address-schema.json'},
                {
                    properties: {
                        country: {
                            'enum': [
                                'United-Kingdom',
                                'Scotland',
                                'Ireland',
                                'Wales',
                            ],
                        },
                    },
                },
                {$ref: 'http://localhost:4200/api/user-schema.json'},
            ],
        },
    },
});
