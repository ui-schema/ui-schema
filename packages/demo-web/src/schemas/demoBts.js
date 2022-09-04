import {createOrderedMap} from "@ui-schema/system/createMap";

const schemaTestBts = createOrderedMap({
    type: "object",
    title: "headline",
    /*view: {
        sizeMd: 6,
    },*/
    required: ['center_items'],
    properties: {
        headline: {
            type: "string",
            minLength: 5,
            maxLength: 30,
            view: {
                sizeMd: 6,
            },
            t: {
                en: {
                    title: 'Headline'
                },
                de: {
                    title: 'Überschrift'
                }
            }
        },
        center_items: {
            type: "boolean",
            view: {
                sizeMd: 12
            },
            t: {
                en: {
                    title: 'Center Items'
                },
                de: {
                    title: 'Elemente zentrieren'
                }
            }
        },
        birthday: {
            type: "string",
            format: "date",
            view: {
                sizeMd: 6
            },
            t: {
                en: {
                    title: 'Birthday'
                },
                de: {
                    title: 'Geburtstag'
                }
            }
        },
        counter: {
            type: "number",
            view: {
                sizeMd: 6
            },
            t: {
                en: {
                    title: 'Counter'
                },
                de: {
                    title: 'Counter'
                }
            }
        },
        coffee: {
            type: "string",
            widget: "OptionsRadio",
            default: "milk",
            view: {
                sizeMd: 3
            },
            enum: [
                'milk',
                'sugar',
                'black',
            ],
            t: {
                de: {
                    title: 'Kaffee',
                    enum: {
                        milk: 'Milch',
                        sugar: 'Zucker',
                        black: 'Schwarz'
                    }
                },
                en: {
                    title: 'Coffee',
                    enum: {
                        milk: 'milk',
                        sugar: 'sugar',
                        black: 'black'
                    }
                }
            },
        },
        cake: {
            type: "array",
            widget: "OptionsCheck",
            view: {
                sizeMd: 3
            },
            items: {
                oneOf: [
                    {
                        const: 'sidebar_left',
                        t: {
                            de: {
                                title: 'Linke Sidebar',
                            },
                            en: {
                                title: 'Left Sidebar',
                            },
                        },
                    }, {
                        const: 'sidebar_right',
                    }, {
                        const: 'notice',
                    }, {
                        const: 'content',
                    }, {
                        const: 'footer',
                    },
                ],
            },
            default: [
                'sidebar_left'
            ],
        },
        discount: {
            type: "string",
            widget: "Select",
            //default: "adult",
            view: {
                sizeMd: 12
            },
            enum: [
                '10%',
                '20%',
                '50%',
            ],
            default: '10%',
            t: {
                de: {
                    title: 'Rabatte',
                    enum: {
                        '10%': '10% Rabatt',
                        '20%': '20% Rabatt',
                        '50%': '50% Rabatt',
                    }
                },
                en: {
                    title: 'Discounts',
                    enum: {
                        '10%': '10% discount',
                        '20%': '20% discount',
                        '50%': '50% discount',
                    }
                }
            },
        },
        ages: {
            type: "array",
            minItems: 2,
            maxItems: 3,
            widget: "SelectMulti",
            // title: 'title.ages',
            view: {
                sizeMd: 3,
            },
            /*
             * input for variable contains must be provided with custom widget/store currently
            contains: {
                type: 'number',
                minimum: 2,
            },*/
            uniqueItems: true,
            items: {
                oneOf: [
                    {
                        const: 'child',
                        t: {
                            de: {
                                title: 'Kind',
                            },
                            en: {
                                title: 'Child',
                            },
                        },
                    }, {
                        const: 'teen',
                        t: {
                            de: {
                                title: 'Jugendlicher',
                            },
                            en: {
                                title: 'Teenager',
                            },
                        },
                    }, {
                        const: 'adult',
                        t: {
                            de: {
                                title: 'Erwachsener',
                            },
                            en: {
                                title: 'Adult',
                            },
                        },
                    }, {
                        const: '50plus',
                        t: {
                            de: {
                                title: 'Senior',
                            },
                            en: {
                                title: 'Senior',
                            },
                        },
                    },
                ],
            },
        },
        tags: {
            type: "array",
            widget: "SimpleList",
            view: {
                sizeXs: 12,
                sizeMd: 12,
                btnSize: 'medium'
            },
            minItems: 2,
            items: {
                type: 'string',
                tt: 'ol',
                minLength: 3,
                maxLength: 5,
                view: {
                    dense: true
                },
            },
        },
    }
});

const dataDemoMain = {
    headline: "Some Demo Headline"
};

export {schemaTestBts, dataDemoMain}
