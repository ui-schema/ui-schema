import {createOrderedMap} from "@ui-schema/ui-schema";

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

const dataDemoMain = {
    headline: "Some Demo Headline"
};

export {schemaTestBts, dataDemoMain}
