import {createOrderedMap} from '@ui-schema/ui-schema';

export const schemaRichContent = createOrderedMap({
    type: 'object',
    properties: {
        text_1: {
            type: 'object',
            widget: 'EditorJS',
            view: {
                sizeXs: 10,
            },
        },
        pure: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
            },
        },
        text_2: {
            type: 'object',
            widget: 'EditorJS',
            default: {
                time: 0,
                blocks: [{
                    'type': 'paragraph',
                    'data': {
                        'text': 'Lorem ipsum dolor sit amet.',
                    },
                }],
                'version': '2.19.1',
            },
            view: {
                sizeXs: 10,
            },
        },
        pure_2: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
            },
        },
        text_dense: {
            type: 'object',
            widget: 'EditorJS',
            view: {
                sizeXs: 10,
                dense: true,
            },
        },
        pure_dense: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
                dense: true,
            },
        },
    },
});
