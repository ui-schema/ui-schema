import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaNumberSlider = createOrderedMap({
    type: 'object',
    properties: {
        sliders_range1: {
            type: "array",
            widget: "NumberSlider",
            minItems: 2,
            maxItems: 2,
            items: {
                type: 'number',
                minimum: 5,
                maximum: 125
            },
            view: {
                tooltip: 'auto',
                sizeXs: 6,
                sizeMd: 3,
                mt: 2,
                mb: 2,
            },
        },
        sliders_range2: {
            type: "array",
            widget: "NumberSlider",
            minItems: 2,
            maxItems: 2,
            items: {
                type: 'number',
                minimum: 5,
                maximum: 125
            },
            view: {
                tooltip: 'auto',
                track: 'inverted',
                sizeXs: 6,
                sizeMd: 3,
                mt: 2,
                mb: 2,
            },
        },
        sliders_multi: {
            type: "array",
            widget: "NumberSlider",
            items: {
                type: 'number',
                minimum: 5,
                maximum: 125,
            },
            view: {
                tooltip: 'auto',
                track: false,
                sizeXs: 12,
                sizeMd: 6,
                mt: 2,
                mb: 2,
            },
        },
        sliders: {
            type: "number",
            widget: "NumberSlider",
            minimum: -8,
            maximum: 120,
            multipleOf: 4,
            view: {
                tooltip: 'auto',
                // track: false,
                sizeXs: 12,
                sizeMd: 6,
            },
        },
        slider_c: {
            type: "number",
            widget: "NumberSlider",
            minimum: 0,
            maximum: 30,
            view: {
                marks: [2, 10, 20],
                marksLabel: '°C',
                tooltip: 'on',
                sizeXs: 6,
                sizeMd: 3,
            },
        },
        slider_h: {
            type: "number",
            widget: "NumberSlider",
            exclusiveMinimum: 0,
            exclusiveMaximum: 10,
            enum: [2, 5],
            view: {
                marks: true,
                marksLabel: ' cm',
                tooltip: 'auto',
                sizeXs: 6,
                sizeMd: 3,
            },
        },
    }
});

export {schemaNumberSlider}
