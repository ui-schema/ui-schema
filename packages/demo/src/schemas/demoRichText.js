import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaRichText = createOrderedMap({
    type: 'object',
    properties: {
        text_1: {
            type: 'string',
            widget: 'RichText',
            view: {
                sizeXs: 10,
            }
        },
        pure: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
            }
        },
        text_2a: {
            type: 'string',
            widget: 'RichText',
            default: 'Something',
            view: {
                sizeXs: 10,
                sizeMd: 5,
                topControls: false,
                btnSize: 'small'
            }
        },
        text_2b: {
            type: 'string',
            widget: 'RichText',
            view: {
                sizeXs: 10,
                sizeMd: 5,
                topControls: false,
                btnSize: 'medium'
            }
        },
        pure2: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
            }
        },
        text_dense: {
            type: 'string',
            widget: 'RichText',
            view: {
                sizeXs: 10,
                topControls: false,
                dense: true,
                hideMd: true,
            }
        },
        pure_dense: {
            type: 'string',
            widget: 'Text',
            view: {
                dense: true,
                sizeXs: 2,
            }
        },
        pure3: {
            type: 'string',
            widget: 'Text',
            view: {
                sizeXs: 2,
            }
        },
        text_inline: {
            type: 'string',
            widget: 'RichTextInline',
            view: {
                sizeXs: 8,
                sizeMd: 5,
            }
        },
        text_inline_dense: {
            type: 'string',
            widget: 'RichTextInline',
            view: {
                sizeXs: 8,
                sizeMd: 5,
                dense: true,
            }
        }
    }
});

export {schemaRichText}
