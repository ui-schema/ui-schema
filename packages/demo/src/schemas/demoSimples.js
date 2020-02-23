import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaSimString = createOrderedMap({
    type: 'string',
    view: {
        sizeXs: 12,
    }
});

const schemaSimNumber = createOrderedMap({
    type: 'number',
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

export {schemaSimString, schemaSimBoolean, schemaSimCheck, schemaSimNumber, schemaSimRadio, schemaSimSelect}
