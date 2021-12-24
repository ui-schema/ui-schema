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
        person: {
            $ref: '#/definitions/person',
            info: ['List of persons and their related children, begin with the oldest known person.'],
        },
        simple_string: {type: 'string'},
        simple_boolean: {type: 'boolean'},
    },
});

export const schemaDemoReferencingRecursive = createOrderedMap({
    '$id': 'http://localhost:4200/api/demo-referencing.json',
    type: 'object',
    view: {
        spacing: 0,
        noGrid: true,
    },
    /*view: {
        sizeMd: 6,
    },*/
    // $defs: {
    definitions: {
        person: {
            type: 'object',
            properties: {
                name: {type: 'string'},
                children: {
                    type: 'array',
                    widget: 'GenericList',
                    items: {$ref: '#/definitions/person'},
                    //'default': [],
                },
            },
        },
    },
    properties: {
        person: {$ref: '#/definitions/person'},
    },
});

export const schemaDemoReferencingNetwork = createOrderedMap({
    '$id': 'http://localhost:4200/api/demo-referencing-network.json',
    type: 'object',
    properties: {
        address: {$ref: 'http://localhost:4200/api/address-schema.json'},
        shipping_address: {
            $ref: 'address-schema.json',
            version: '0.0.6',
        },
        business_country: {
            $ref: 'address-schema.json/#properties/country',
            //version: '0.0.1',
        },
    },
});

export const schemaDemoReferencingNetworkB = createOrderedMap({
    '$id': 'http://localhost:4200/api/demo-referencing-network-b.json',
    type: 'object',
    $defs: {
        country: {
            type: 'string',
            '$anchor': 'country',
            widget: 'Select',
            enum: ['Germany', 'Austria', 'Ireland'],
        },
    },
    properties: {
        address: {
            $id: 'http://localhost:4200/non-existing-schema.json',
            type: 'object',
            allOf: [
                {
                    properties: {
                        manager: {
                            $id: 'http://localhost:4200/api/non-existing-schema.json',
                            type: 'object',
                            widget: 'FormGroup',
                            $defs: {
                                country: {
                                    type: 'string',
                                    '$anchor': 'country',
                                    widget: 'Select',
                                    enum: ['ES', 'AT', 'CH', 'UK'],
                                },
                            },
                            properties: {
                                person: {$ref: 'user-schema.json'},
                                country: {$ref: '#country'},
                            },
                        },
                    },
                },
                {
                    $ref: 'api/address-schema.json',
                },
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
                        business_country: {$ref: '#country'},
                    },
                },
                {$ref: 'http://localhost:4200/api/user-schema.json'},
            ],
        },
    },
});
