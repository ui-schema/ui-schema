const schema1 = {
    type: "object",
    title: "headline",
    /*view: {
        sizeMd: 6,
    },*/
    properties: {
        headline: {
            type: "string",
            view: {
                sizeXs: 6,
                sizeSm: 6,
                sizeMd: 6,
                sizeLg: 6,
                sizeLx: 6,
            }
        },
        subline: {
            type: "number",
            view: {
                sizeMd: 3
            }
        },
        info: {
            type: "string",
            view: {
                sizeMd: 6
            }
        },
        outro: {
            type: "string",
            view: {
                sizeMd: 3
            }
        },
        s1ubline: {
            type: "string",
            view: {
                sizeMd: 3
            }
        },
        teeeext: {
            type: "string",
            widget: "Text",
            view: {
                sizeMd: 6,
                //variant: 'filled',
                //margin: 'none',
                //margin: 'dense',
                //margin: 'normal',
            }
        },
        o2utro: {
            type: "string",
            view: {
                sizeMd: 3
            }
        },
        o22utro: {
            type: "string",
            view: {
                sizeMd: 3
            }
        },
        style: {
            type: "object",
            view: {
                sizeMd: 3
            },
            properties: {
                center_items: {
                    type: "bool",
                    default: true,
                    view: {
                        sizeMd: 12
                    }
                },
                center_item_content: {
                    type: "bool",
                    view: {
                        sizeMd: 12
                    }
                }
            }
        },
        layouts: {
            type: "array",
            widget: "OptionsCheck",
            view: {
                sizeMd: 3
            },
            enum: [
                'sidebar_left',
                'sidebar_right',
                'notice',
                'content',
                'footer',
            ],
            default: [
                'sidebar_left'
            ],
        },
        size: {
            type: "string",
            widget: "OptionsRadio",
            default: "middle",
            view: {
                sizeMd: 3
            },
            enum: [
                'small',
                'middle',
                'big',
            ],
        },
        age: {
            type: "string",
            widget: "Select",
            default: "adult",
            view: {
                sizeMd: 3
            },
            enum: [
                'child',
                'teen',
                'adult',
                '50plus',
            ],
        },
        ages: {
            type: "string",
            widget: "SelectMulti",
            view: {
                sizeMd: 3
            },
            enum: [
                'child',
                'teen',
                'adult',
                '50plus',
            ],
        },
        desc: {
            type: "object",
            widget: "TextRich",
            view: {
                sizeMd: 3
            }
        },
        items: {
            type: "object",
            widget: "GenericList",
            view: {
                axis: "x"
            },
            properties: {
                icon: {
                    type: "object",
                    widget: "File",
                    view: {
                        sizeMd: 3
                    }
                },
                headline: {
                    type: "string",
                    view: {
                        sizeMd: 3
                    }
                },
                desc: {
                    type: "object",
                    widget: "TextRich",
                    view: {
                        sizeMd: 3
                    }
                }
            }
        }
    },
    required: [
        'layouts'
    ]
};

const schemaUser = {
    type: "object",
    title: "headline",
    /*view: {
        sizeMd: 6,
    },*/
    properties: {
        name: {
            type: "string",
            view: {
                sizeMd: 6,
            }
        },
        surname: {
            type: "string",
            view: {
                sizeMd: 6
            }
        },
        address: {
            type: "object",
            properties: {
                street: {
                    type: "string",
                    view: {
                        sizeMd: 9
                    }
                },
                street_no: {
                    type: "string",
                    view: {
                        sizeMd: 3
                    }
                },
                city: {
                    type: "string",
                    view: {
                        sizeMd: 12
                    }
                },
                country: {
                    type: "string",
                    view: {
                        sizeMd: 12
                    }
                },
            }
        },
        birthday: {
            type: "string",
            format: "date",
            view: {
                sizeMd: 6
            }
        },
        quantity: {
            type: "number",
            view: {
                sizeMd: 6
            }
        },
    }
};

/**
 * Seed the Schema with additional widgets for performance tests
 *
 * @example seedSchema(schema1, { type: "string", view: { widthM: "1" }}, 150, 'perf_bool_'
 * @param schema
 * @param widget
 * @param qty
 * @param prefix
 */
function seedSchema(schema, widget = {
    type: "string",
}, qty = 100, prefix = 'perfcheck_') {

    for(let i = 1; i < qty; i += 1) {
        schema.properties[prefix + i] = widget;
    }

}

//seedSchema(schema1);

const data1 = {
    headline: "bdsakjbgfjkweqbkjbfgn"
};

export {schema1, data1, schemaUser, seedSchema}
