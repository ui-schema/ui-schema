const blocks = {
    text: {
        type: 'object',
        properties: {
            $bid: {
                hidden: true,
                type: 'string',
            },
            $block: {
                hidden: true,
                type: 'string',
            },
            text: {
                type: 'string',
                widget: 'Text',
                view: {
                    hideTitle: true,
                },
            },
        },
        required: ['$bid', '$block'],
    },
    teasers: {
        type: 'object',
        properties: {
            $bid: {
                hidden: true,
                type: 'string',
            },
            $block: {
                hidden: true,
                type: 'string',
            },
            list: {
                type: 'array',
                widget: 'GenericList',
                view: {
                    hideTitle: true,
                },
                items: {
                    type: 'object',
                    properties: {
                        headline: {
                            type: 'string',
                        },
                        content: {
                            type: 'string',
                            widget: 'Text',
                        },
                    },
                },
            },
        },
        required: ['$bid', '$block'],
    },
    'block_group': {
        type: 'object',
        view: {
            noGrid: true,
        },
        properties: {
            $bid: {
                hidden: true,
                type: 'string',
            },
            $block: {
                hidden: true,
                type: 'string',
            },
            list: {
                type: 'array',
                widget: 'DroppablePanel',
            },
        },
        required: ['$bid', '$block'],
    },
    address: {
        type: 'object',
        widget: 'FormGroup',
        properties: {
            $bid: {
                hidden: true,
                type: 'string',
            },
            $block: {
                hidden: true,
                type: 'string',
            },
            street_address: {
                type: 'string',
            },
            city: {
                type: 'string',
            },
            state: {
                type: 'string',
            },
            country: {
                type: 'string',
                widget: 'Select',
                'enum': [
                    'Germany',
                    'France',
                    'Spain',
                    'Ireland',
                    'Italy',
                ],
            },
        },
        required: [
            'city',
            'country',
        ],
    },
    'addresses': {
        type: 'object',
        view: {
            noGrid: true,
        },
        properties: {
            $bid: {
                hidden: true,
                type: 'string',
            },
            $block: {
                hidden: true,
                type: 'string',
            },
            list: {
                type: 'array',
                widget: 'DroppablePanel',
                dragDrop: {
                    allowed: ['address'],
                },
            },
        },
        required: ['$bid', '$block'],
    },
}

export const demoDragnDropEditor = [
    [
        `Multiple draggable roots with panels as item container`,
        {
            type: 'object',
            widget: 'DroppableRootMultiple',
            $defs: blocks,
            properties: {
                main: {
                    type: 'array',
                    //widget: 'EditorJS',
                },
                suggestions: {
                    type: 'array',
                    //widget: 'Text',
                },
            },
        },
    ],
    [
        `Single draggable root`,
        {
            type: 'array',
            widget: 'DroppableRootSingle',
            $defs: blocks,
            title: 'Single Editor',
        },
    ],
];
