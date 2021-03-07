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
}

export const demoDragnDropEditorSimple = [
    [
        `Multiple draggable roots with accordion as item container`,
        {
            type: 'object',
            widget: 'SimpleDroppableRootMultiple',
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
        `Single draggable root (one array only)`,
        {
            type: 'array',
            widget: 'SimpleDroppableRootSingle',
            $defs: blocks,
            title: 'Single Editor',
        },
    ],
];
