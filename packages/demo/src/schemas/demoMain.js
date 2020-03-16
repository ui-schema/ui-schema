import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaDemoMain = {
    type: "object",
    title: "headline",
    /*view: {
        sizeMd: 6,
    },*/
    properties: {
        stepper: {
            type: "object",
            widget: "Stepper",
            properties: {
                'step-1': {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            widget: "StringIcon",
                            minLength: 2,
                            maxLength: 3,
                            view: {
                                sizeMd: 6,
                                icon: 'AccountBox',
                                //iconEnd: 'AccountBox'
                            },
                        },
                        email: {
                            type: "string",
                            format: "email",
                            t: 'browser',
                            view: {
                                sizeMd: 6
                            }
                        },
                        phone: {
                            type: "string",
                            format: "tel",
                            // tel must be validated with a pattern
                            // pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
                            view: {
                                sizeMd: 6
                            }
                        },
                        date: {
                            type: "string",
                            format: "date",
                            view: {
                                sizeMd: 6,
                                shrink: true
                            }
                        },
                    },
                    required: [
                        'name'
                    ]
                },
                'step-2': {
                    type: "object",
                    widget: "Step",
                    properties: {
                        topics: {
                            type: "array",
                            widget: "SelectMulti",
                            view: {
                                sizeMd: 3
                            },
                            enum: [
                                'theater',
                                'crime',
                                'sci-fi',
                                'horror',
                            ],
                        },
                    }
                },
                'step-3': {
                    type: "object",
                    widget: "Step",
                    properties: {
                        accepted: {
                            type: "boolean",
                        },
                    }
                },
            }
        },
        headline: {
            type: "string",
            minLength: 2,
            maxLength: 3,
            /*enum: [
                'test 1',
                'test2',
                'test3 ! #^@%$# ',
                111,// is false! (and that's how it should be)
            ],*/
            view: {
                sizeXs: 6,
                sizeSm: 6,
                sizeMd: 6,
                sizeLg: 6,
                sizeLx: 6,
            }
        },
        qty: {
            type: "number",
            minimum: 2,
            maximum: 10,
            tt: 'lower',
            view: {
                sizeMd: 3
            }
        },
        qty2: {
            type: "number",
            tt: 'upper',
            exclusiveMinimum: 2,
            exclusiveMaximum: 10,
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
        length: {
            type: "number",
            multipleOf: 2,
            view: {
                sizeMd: 3
            }
        },
        comment: {
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
        usaPhone: {
            type: "string",
            // only valid for: (888)555-1212 or 555-1212
            pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
            view: {
                sizeMd: 3
            }
        },
        stock: {
            type: "number",
            const: 50,
            view: {
                sizeMd: 3
            }
        },
        style: {
            type: "object",
            minProperties: 2,
            maxProperties: 3,
            view: {
                sizeMd: 3
            },
            properties: {
                center_items: {
                    type: "boolean",
                    default: true,
                    view: {
                        sizeMd: 12
                    }
                },
                center_item_content: {
                    type: "boolean",
                    view: {
                        sizeMd: 12
                    }
                }
            },
            required: [
                'center_item_content'
            ]
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
            t: {
                de: {
                    enum: {
                        sidebar_left: 'Linke Sidebar'
                    },
                },
                en: {
                    enum: {
                        sidebar_left: 'Left Sidebar'
                    }
                }
            }
        },
        size: {
            type: "string",
            widget: "OptionsRadio",
            view: {
                sizeMd: 3
            },
            enum: [
                'small',
                'middle',
                'big',
            ],
        },
        sizeDef: {
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
            //default: "adult",
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
            type: "array",
            minItems: 2,
            maxItems: 3,
            widget: "SelectMulti",
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
            enum: [
                'child',
                'teen',
                'adult',
                '50plus',
            ],
            t: {
                de: {
                    enum: {
                        child: 'Kind',
                        teen: 'Jugendlicher',
                        adult: 'Erwachsener',
                        '50plus': 'Senior',
                    }
                },
                en: {
                    enum: {
                        child: 'Child',
                        teen: 'Teenager',
                        adult: 'Adult',
                        '50plus': 'Senior',
                    }
                }
            },
        },
        desc: {
            type: "object",
            widget: "TextRich",
            view: {
                sizeMd: 3
            }
        }
    },
    required: [
        'layouts',
        'size',
        'age',
        'slider_h',
        'ages'
    ]
};

const dataDemoMain = {
    headline: "Some Demo Headline"
};

const schemaTestBts = createOrderedMap({
    type: "object",
    title: "headline",
    /*view: {
        sizeMd: 6,
    },*/
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
            default: true,
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
            enum: [
                'chocolate',
                'almonds',
                'cream',
                'apples',
                'cheese',
            ],
            default: [
                'chocolate'
            ],
            t: {
                de: {
                    title: 'Kuchen',
                    enum: {
                        chocolate: 'Schokolade',
                        almonds: 'Mandeln',
                        cream: 'Sahne',
                        apples: 'Äpfel',
                        cheese: 'Käse'
                    }
                },
                en: {
                    title: 'Cake',
                    enum: {
                        chocolate: 'chocolate',
                        almonds: 'almonds',
                        cream: 'cream',
                        apples: 'apples',
                        cheese: 'cheese'
                    }
                }
            },
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
            enum: [
                'child',
                'teen',
                'adult',
                '50plus',
            ],
            t: {
                de: {
                    title: 'Alter',
                    enum: {
                        child: 'Kind',
                        teen: 'Jugendlicher',
                        adult: 'Erwachsener',
                        '50plus': 'Senior',
                    }
                },
                en: {
                    title: 'Ages',
                    enum: {
                        child: 'Child',
                        teen: 'Teenager',
                        adult: 'Adult',
                        '50plus': 'Senior',
                    }
                }
            },
        }
    }
});

const schemaUser = createOrderedMap({
    type: "object",
    title: "headline",
    /*view: {
        sizeMd: 6,
    },*/
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 3,
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
})

export {schemaDemoMain, dataDemoMain, schemaUser, schemaTestBts}
