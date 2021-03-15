import {createOrderedMap} from '@ui-schema/ui-schema';

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
            content: {
                type: 'array',
                widget: 'EditableContent',
                default: [{type: 'string', widget: 'EditableParagraph', text: 'Placeholder'}],
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
}

export const schemaDragDropEditableSingle = createOrderedMap({
    type: 'array',
    widget: 'DroppableRootSingle',
    $defs: blocks,
    title: 'Editable Editor',
    dragDrop: {
        //showOpenAll: true,
        //allowed: ['address', 'addresses'],
    },
});

export const schemaEditable = createOrderedMap({
    type: 'object',
    title: 'Editable',
    properties: {
        text: {
            type: 'array',
            widget: 'EditableContent',
            default: [{type: 'string', widget: 'EditableParagraph', text: 'Placeholder'}],
        },
    },
});
