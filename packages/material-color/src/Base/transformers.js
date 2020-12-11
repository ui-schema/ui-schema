/**
 * This file was copied from https://github.com/LoicMahieu/material-ui-color-picker/blob/master/src/transformers.js
 * As we don't rely on any other thing from that package, copied and not installed
 *
 * MIT License,
 * Copyright (c) 2017 Loic Mahieu
 * SeeL https://github.com/LoicMahieu/material-ui-color-picker/blob/master/LICENSE
 */

export const DEFAULT_CONVERTER = 'rgba_hex';
export const converters = {
    rgba: c => `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${c.rgb.a})`,
    rgb: c => `rgb(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b})`,
    hex: c => c.hex.toUpperCase(),

    rgba_rgb: c => c.rgb.a === 1 ? converters.rgb(c) : converters.rgba(c),
    rgba_hex: c => c.rgb.a === 1 ? converters.hex(c) : converters.rgba(c),
};

export default converters

export const convertColor = (color, format) =>
    format === 'hex' ?
        converters.hex(color) :
        format === 'rgb' ?
            converters.rgb(color) :
            format === 'rgb+a' ?
                converters.rgba_rgb(color) :
                format === 'rgba' ?
                    converters.rgba(color) :
                    converters.rgba_hex(color)
