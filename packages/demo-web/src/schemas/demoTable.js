import {createOrderedMap} from '@ui-schema/system/createMap';

export const schemaDemoTable = createOrderedMap({
    type: 'array',
    widget: 'Table',
    view: {
        dense: true,
    },
    items: {
        type: 'array',
        items: [
            {
                type: 'string',
                title: 'Name',
            },
            {
                type: 'integer',
                title: 'ID',
                //hidden: true,
                info: [
                    'Only accepts integers',
                ],
                view: {
                    align: 'center',
                },
            },
            {
                type: 'string',
                format: 'date',
                title: 'Date',
                view: {
                    shrink: true,
                },
            },
            {
                type: 'number',
                title: 'Revenue',
                default: 0,
                multipleOf: 0.1,
            },
            {
                type: 'boolean',
                title: 'Finished',
                default: true,
            },
        ],
    },
});

export const schemaDemoTableMap = createOrderedMap({
    type: 'array',
    widget: 'Table',
    view: {
        dense: true,
    },
    items: {
        type: 'object',
        rowSortOrder: [
            'id',
            'date',
            'name',
            'revenue',
            'finished',
        ],
        properties: {
            name: {
                type: 'string',
                title: 'Name',
            },
            id: {
                type: 'integer',
                title: 'ID',
                //hidden: true,
            },
            date: {
                type: 'string',
                format: 'date',
                title: 'Date',
                view: {
                    shrink: true,
                },
            },
            revenue: {
                type: 'number',
                title: 'Revenue',
                multipleOf: 0.1,
            },
            finished: {
                type: 'boolean',
                title: 'Finished',
                default: true,
                //deleteOnEmpty: true,
            },
        },
    },
});

export const schemaDemoTableAdvanced = createOrderedMap({
    type: 'object',
    widget: 'TableAdvanced',
    properties: {
        name: {
            type: 'string',
        },
        options: {
            type: 'object',
            properties: {
                filter: {
                    limit: {
                        type: 'number',
                    },
                },
                summary: {
                    type: 'array',
                    items: {
                        type: 'number',
                    },
                },
                pagination: {
                    limit: {
                        type: 'number',
                    },
                },
            },
        },
        data: {
            type: 'array',
            widget: 'Table',
            default: [
                [
                    'Projekt No1',
                    2,
                    {
                        'from': '2021-03-11',
                        'till': '2021-03-27',
                    },
                    150.6,
                ],
            ],
            view: {
                dense: true,
                hideTitle: true,
                rowsShowAll: true,
                //hideItemsTitle: true,
            },
            items: {
                type: 'array',
                items: [
                    {
                        type: ['string', 'null'],
                        default: null,
                        title: 'Name',
                    },
                    {
                        type: ['integer', 'null'],
                        default: null,
                        title: 'ID',
                    },
                    {
                        type: ['object', 'null'],
                        default: null,
                        title: 'DateRange',
                        properties: {
                            from: {
                                type: 'string',
                                format: 'date',
                                title: 'Date From',
                                view: {
                                    shrink: true,
                                    sizeXs: 6,
                                },
                            },
                            till: {
                                type: 'string',
                                format: 'date',
                                title: 'Date Till',
                                view: {
                                    shrink: true,
                                    sizeXs: 6,
                                },
                            },
                        },
                    },
                    /*{
                        type: 'array',
                        widget: 'GenericList',
                        title: 'GenericList',
                        items: [
                            {
                                type: 'string',
                                format: 'date',
                                view: {
                                    shrink: true,
                                    sizeXs: 6,
                                },
                            },
                            {
                                type: 'string',
                                format: 'date',
                                view: {
                                    shrink: true,
                                    sizeXs: 6,
                                },
                            },
                        ],
                    },*/
                    /*{
                        type: 'array',
                        widget: 'SimpleList',
                        title: 'SimpleList',
                        items: {
                            type: 'string',
                            view: {
                                shrink: true,
                                hideTitle: true,
                            },
                        },
                    },*/
                    {
                        type: ['number', 'null'],
                        default: null,
                        title: 'Revenue',
                        multipleOf: 0.01,
                    },
                ],
            },
        },
    },
});

// this schema comes from mikepan-ovoenergy, no license supplied
// https://github.com/ui-schema/ui-schema/issues/115
export const schemaDemoTableMapBig = createOrderedMap({
    '$schema': 'http://json-schema.org/draft-06/schema#',
    '$ref': '#/definitions/Welcome7',
    'definitions': {
        'Welcome7': {
            'type': 'object',
            'widget': 'Accordions',
            'additionalProperties': false,
            'onClosedHidden': true,
            //'defaultExpanded': '',
            'properties': {
                'metadata': {
                    '$ref': '#/definitions/Welcome7Metadata',
                },
                'pages': {
                    'type': 'array',
                    'widget': 'Table',
                    'view': {
                        'dense': true,
                    },
                    'items': {
                        '$ref': '#/definitions/Page',
                    },
                },
                'questions': {
                    'type': 'array',
                    'widget': 'Table',
                    'items': {
                        '$ref': '#/definitions/Question',
                    },
                },
                'edges': {
                    'type': 'array',
                    'widget': 'Table',
                    'items': {
                        '$ref': '#/definitions/Edge',
                    },
                },
                'conditions': {
                    'type': 'array',
                    'widget': 'Table',
                    'items': {
                        '$ref': '#/definitions/Condition',
                    },
                },
                'fields': {
                    'type': 'array',
                    'widget': 'Table',
                    'items': {
                        '$ref': '#/definitions/Field',
                    },
                },
                'options': {
                    'type': 'array',
                    'widget': 'Table',
                    'maxItems': 4,
                    'items': {
                        '$ref': '#/definitions/Option',
                    },
                },
            },
            'required': [
                'conditions',
                'edges',
                'fields',
                'metadata',
                'options',
                'pages',
                'questions',
            ],
            'title': 'Welcome7',
        },
        'Condition': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'id': {
                    'type': 'string',
                },
                'linkedQuestion': {
                    'type': 'string',
                },
                'value': {
                    '$ref': '#/definitions/Value',
                },
                'metadata': {
                    '$ref': '#/definitions/ConditionMetadata',
                },
            },
            'required': ['id'],
            'title': 'Condition',
        },
        'ConditionMetadata': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'paymentType': {
                    'type': 'string',
                },
            },
            'required': ['paymentType'],
            'title': 'ConditionMetadata',
        },
        'Edge': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'id': {
                    'type': 'string',
                },
                'child': {
                    'type': 'string',
                },
                'condition': {
                    'type': 'array',
                    'widget': 'SimpleList',
                    'items': {
                        'type': 'string',
                    },
                    /*'anyOf': [
                        {
                            'type': 'array',
                            'widget': 'SimpleList',
                            'items': {
                                'type': 'string',
                            },
                        },
                        {
                            'type': 'null',
                        },
                    ],*/
                },
            },
            'required': ['child', 'condition', 'id'],
            'title': 'Edge',
        },
        'Field': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'id': {
                    'type': 'string',
                },
                'type': {
                    '$ref': '#/definitions/Type',
                },
                'options': {
                    'type': 'string',
                },
            },
            'required': ['id', 'type'],
            'title': 'Field',
        },
        'Welcome7Metadata': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'version': {
                    'type': 'string',
                },
                'paymentType': {
                    'type': 'string',
                },
            },
            'required': ['paymentType', 'version'],
            'title': 'Welcome7Metadata',
        },
        'Option': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'name': {
                    'type': 'string',
                },
                'choices': {
                    'type': 'array',
                    'widget': 'SimpleList',
                    'items': {
                        '$ref': '#/definitions/Choice',
                    },
                },
            },
            'required': ['choices', 'name'],
            'title': 'Option',
        },
        'Choice': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'name': {
                    'type': 'string',
                },
            },
            'required': ['name'],
            'title': 'Choice',
        },
        'Page': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'id': {
                    'type': 'string',
                },
                'questions': {
                    'type': 'array',
                    'items': {
                        'type': 'string',
                    },
                },
                'description': {
                    'type': 'string',
                },
                'dependsOn': {
                    'type': 'array',
                    'items': {
                        'type': 'string',
                    },
                },
                'abort': {
                    'type': 'string',
                },
            },
            'required': ['dependsOn', 'description', 'id', 'questions'],
            'title': 'Page',
        },
        'Question': {
            'type': 'object',
            'additionalProperties': false,
            'properties': {
                'id': {
                    'type': 'string',
                },
                'edges': {
                    'type': 'array',
                    'items': {
                        'type': 'string',
                    },
                },
                'description': {
                    'type': 'string',
                },
                'field': {
                    'type': 'string',
                },
            },
            'required': ['description', 'edges', 'field', 'id'],
            'title': 'Question',
        },
        'Value': {
            'anyOf': [
                {
                    'type': 'boolean',
                },
                {
                    'type': 'string',
                },
            ],
            'title': 'Value',
        },
        'Type': {
            'type': 'string',
            'enum': ['text', 'number', 'boolean', 'signature', 'photo', 'option'],
            'title': 'Type',
        },
    },
});
