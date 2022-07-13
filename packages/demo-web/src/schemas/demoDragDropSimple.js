import {createOrderedMap} from '@ui-schema/react/Utils/createMap';

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
    address: {
        $ref: 'http://localhost:4200/api/address-schema.json',
    },
}

export const schemaDragDrop = createOrderedMap({
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
});

export const schemaDragDropSortableList1 = createOrderedMap({
    type: 'array',
    widget: 'SimpleDroppableRootSingle',
    $defs: blocks,
    title: 'Single Editor',
});
