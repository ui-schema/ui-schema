import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaSimString = createOrderedMap({
    type: 'string',
    title: 'Simple Text',
    view: {
        sizeXs: 12,
    }
});

const schemaSimNumber = createOrderedMap({
    type: 'number',
    title: 'titles.simple-number',
    view: {
        sizeXs: 12,
    }
});

const schemaSimBoolean = createOrderedMap({
    type: 'boolean',
    view: {
        sizeXs: 12,
    }
});

const schemaSimRadio = createOrderedMap({
    type: 'string',
    widget: 'OptionsRadio',
    enum: ['left', 'center', 'right'],
    view: {
        sizeXs: 12,
    }
});

const schemaSimCheck = createOrderedMap({
    type: 'array',
    widget: 'OptionsCheck',
    enum: ['left', 'center', 'right'],
    view: {
        sizeXs: 12,
    }
});

const schemaSimSelect = createOrderedMap({
    type: 'array',
    widget: 'SelectMulti',
    enum: ['left', 'center', 'right'],
    view: {
        sizeXs: 12,
    }
});

const schemaCode = createOrderedMap({
    type: 'object',
    properties: {
        code: {
            type: 'string',
            format: 'css',
            widget: 'Code',
            view: {
                sizeXs: 12,
            }
        },
        code_bg: {
            type: 'string',
            format: 'css',
            widget: 'Code',
            view: {
                sizeXs: 12,
                bg: true
            }
        },
        code_2: {
            type: 'string',
            format: ['json', 'js', 'html'],
            widget: 'Code',
        },
        normal_string: {
            type: 'string',
        },
    }
});

export {
    schemaSimString, schemaSimBoolean, schemaSimCheck, schemaSimNumber, schemaSimRadio, schemaSimSelect,
    schemaCode,
}
