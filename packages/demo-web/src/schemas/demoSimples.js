import {createOrderedMap} from '@ui-schema/ui-schema/createMap';

export const schemaNull = createOrderedMap({
    type: 'object',
    title: 'Type Null',
    view: {
        sizeXs: 12,
    },
    properties: {
        is_null: {
            type: 'null',
        },
        is_null_def: {
            type: 'null',
            default: null,
        },
        is_null_inv: {
            type: 'null',
            //default: 'noll',
        },
    },
});

export const schemaSimString = createOrderedMap({
    type: 'string',
    title: 'Simple Text',
    view: {
        sizeXs: 12,
    },
});

export const schemaSimNumber = createOrderedMap({
    type: 'number',
    title: 'titles.simple-number',
    view: {
        sizeXs: 12,
    },
});

export const schemaSimInteger = createOrderedMap({
    type: 'integer',
    title: 'titles.simple-integer',
    view: {
        sizeXs: 12,
    },
});

export const schemaSimBoolean = createOrderedMap({
    type: 'boolean',
    view: {
        sizeXs: 12,
    },
});

export const schemaSimRadio = createOrderedMap({
    type: 'string',
    widget: 'OptionsRadio',
    enum: ['left', 'center', 'right'],
    view: {
        sizeXs: 12,
    },
});

export const schemaSimCheck = createOrderedMap({
    type: 'array',
    widget: 'OptionsCheck',
    items: {
        oneOf: [
            {
                const: 'left',
            }, {
                const: 'center',
            }, {
                const: 'right',
            },
        ],
    },
    view: {
        sizeXs: 12,
    },
});

export const schemaSimSelect = createOrderedMap({
    type: 'array',
    widget: 'SelectMulti',
    items: {
        oneOf: [
            {
                const: 'left',
            }, {
                const: 'center',
            }, {
                const: 'right',
            },
        ],
    },
    view: {
        sizeXs: 12,
    },
});

export const schemaCode = createOrderedMap({
    type: 'object',
    properties: {
        code: {
            type: 'string',
            format: 'css',
            widget: 'Code',
        },
        code_bg: {
            type: 'string',
            format: 'css',
            widget: 'Code',
            view: {
                bg: true,
            },
        },
        code_selectable: {
            type: 'array',
            format: ['json', 'js', 'html'],
            widget: 'CodeSelectable',
        },
        code_no_title: {
            type: 'string',
            format: 'css',
            widget: 'Code',
            view: {
                hideTitle: true,
            },
        },
        code_selectable_no_title: {
            type: 'array',
            format: ['json', 'js', 'html'],
            widget: 'CodeSelectable',
            view: {
                hideTitle: true,
            },
        },
        normal_string: {
            type: 'string',
        },
    },
});
