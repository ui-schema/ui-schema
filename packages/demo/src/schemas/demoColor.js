import {createOrderedMap} from "@ui-schema/ui-schema";

let schemaColor = {
    type: 'object',
    properties: {
        color: {
            type: 'string',
            widget: 'Color',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_2: {
            type: 'string',
            widget: 'Color',
            view: {
                sizeXs: 12,
                sizeMd: 6,
                alpha: true,
            }
        },
        color_3: {
            type: 'string',
            widget: 'Color',
            format: 'rgb',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_4: {
            type: 'string',
            widget: 'Color',
            format: 'rgb+a',
            view: {
                sizeXs: 12,
                sizeMd: 6,
                alpha: true,
            }
        },
        color_5: {
            type: 'string',
            widget: 'Color',
            format: 'hex',
            pattern: '^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_6: {
            type: 'string',
            widget: 'Color',
            format: 'hex',
            view: {
                sizeXs: 12,
                sizeMd: 6,
                alpha: true,// no effect here
            }
        },
        color_7: {
            type: 'string',
            widget: 'ColorDialog',
            format: 'hex',
            pattern: '^#+([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_8: {
            type: 'string',
            widget: 'ColorDialog',
            view: {
                sizeXs: 12,
                sizeMd: 6,
                alpha: true,
            }
        },
        color_swatch_1: {
            type: 'string',
            widget: 'ColorSwatches',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_mat: {
            type: 'string',
            widget: 'ColorMaterial',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_compact: {
            type: 'string',
            widget: 'ColorCompact',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_circle: {
            type: 'string',
            widget: 'ColorCircle',
            view: {
                sizeXs: 12,
                sizeMd: 6,
                iconOn: true,
            }
        },
        color_block: {
            type: 'string',
            widget: 'ColorBlock',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_twitter: {
            type: 'string',
            widget: 'ColorTwitter',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_slider: {
            type: 'string',
            widget: 'ColorSlider',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_sketch: {
            type: 'string',
            widget: 'ColorSketch',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_hue: {
            type: 'string',
            widget: 'ColorHue',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_alpha: {
            type: 'string',
            widget: 'ColorAlpha',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_block_res: {
            type: 'string',
            widget: 'ColorBlock',
            enum: ['#000000', '#000500', '#004000', '#021000',],
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_swatches_2: {
            type: 'string',
            widget: 'ColorSwatches',
            enum: ['#000000', '#000500', '#004000', '#021000',],
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_sketch_restricted: {
            type: 'string',
            widget: 'ColorSketch',
            view: {
                colors: ['#000000', '#000500', '#004000', '#021000',],
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_static_slider: {
            type: 'string',
            widget: 'ColorSliderStatic',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_static: {
            type: 'string',
            widget: 'ColorStatic',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_static_circle: {
            type: 'string',
            widget: 'ColorCircleStatic',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_static_twitter: {
            type: 'string',
            widget: 'ColorTwitterStatic',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_static_sketch: {
            type: 'string',
            widget: 'ColorSketchStatic',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
        color_dialog_sketch: {
            type: 'string',
            widget: 'ColorSketchDialog',
            view: {
                sizeXs: 12,
                sizeMd: 6,
            }
        },
    },
    required: ['color_2']
};

//seedSchema(schemaColor);
//seedSchema(schemaColor,{type: 'string',widget: 'Color',});
schemaColor = createOrderedMap(schemaColor);

export {schemaColor}
