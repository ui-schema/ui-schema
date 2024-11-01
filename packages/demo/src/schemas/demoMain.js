import {createOrderedMap} from '@ui-schema/ui-schema';

const schemaDemoMain = {
    type: 'object',
    title: 'headline',
    /*view: {
        sizeMd: 6,
    },*/
    properties: {
        stepper: {
            type: 'object',
            widget: 'Stepper',
            properties: {
                'step-1': {
                    type: 'object',
                    properties: {
                        name: {
                            type: 'string',
                            widget: 'StringIcon',
                            minLength: 2,
                            maxLength: 3,
                            view: {
                                sizeMd: 6,
                                icon: 'AccountBox',
                                //iconEnd: 'AccountBox'
                            },
                        },
                        email: {
                            type: 'string',
                            format: 'email',
                            t: 'browser',
                            view: {
                                sizeMd: 6,
                            },
                        },
                        phone: {
                            type: 'string',
                            format: 'tel',
                            // tel must be validated with a pattern
                            // pattern: "[0-9]{3}-[0-9]{3}-[0-9]{4}",
                            view: {
                                sizeMd: 6,
                            },
                        },
                        date: {
                            type: 'string',
                            format: 'date',
                            view: {
                                sizeMd: 6,
                                shrink: true,
                            },
                        },
                    },
                    required: [
                        'name',
                    ],
                },
                'step-2': {
                    type: 'object',
                    widget: 'Step',
                    properties: {
                        topics: {
                            type: 'array',
                            widget: 'SelectMulti',
                            view: {
                                sizeMd: 3,
                            },
                            items: {
                                oneOf: [
                                    {const: 'theater'},
                                    {const: 'crime'},
                                    {const: 'sci-fi'},
                                    {const: 'horror'},
                                ],
                            },
                        },
                    },
                },
                'step-3': {
                    type: 'object',
                    widget: 'Step',
                    properties: {
                        accepted: {
                            type: 'boolean',
                        },
                    },
                },
            },
        },
        headline: {
            type: 'string',
            minLength: 2,
            maxLength: 3,
            info: [
                'Some Info!',
            ],
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
            },
        },
        qty: {
            type: 'number',
            minimum: 2,
            //default: '23dijk',
            maximum: 10,
            tt: 'lower',
            view: {
                sizeMd: 3,
            },
        },
        qty2: {
            type: 'number',
            tt: 'upper',
            exclusiveMinimum: 2,
            exclusiveMaximum: 10,
            view: {
                sizeMd: 3,
            },
        },
        info: {
            type: 'string',
            view: {
                sizeMd: 6,
            },
        },
        outro: {
            type: 'string',
            view: {
                sizeMd: 3,
            },
        },
        length: {
            type: 'number',
            multipleOf: 2,
            view: {
                sizeMd: 3,
            },
        },
        comment: {
            type: 'string',
            widget: 'Text',
            info: [
                'Some Info!',
            ],
            view: {
                sizeMd: 6,
                //variant: 'filled',
                //margin: 'none',
                //margin: 'dense',
                //margin: 'normal',
            },
        },
        usaPhone: {
            type: 'string',
            // only valid for: (888)555-1212 or 555-1212
            pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$',
            view: {
                sizeMd: 3,
            },
        },
        stock: {
            type: 'number',
            const: 50,
            view: {
                sizeMd: 3,
            },
        },
        style: {
            type: 'object',
            minProperties: 2,
            maxProperties: 3,
            view: {
                sizeMd: 3,
            },
            properties: {
                center_items: {
                    type: 'boolean',
                    default: true,
                    view: {
                        sizeMd: 12,
                    },
                },
                center_item_content: {
                    type: 'boolean',
                    view: {
                        sizeMd: 12,
                    },
                },
                view_dense: {
                    type: 'boolean',
                    default: true,
                    view: {
                        sizeMd: 12,
                        dense: true,
                    },
                },
                label_bottom: {
                    type: 'boolean',
                    default: true,
                    view: {
                        sizeMd: 12,
                        labelPlacement: 'bottom',
                        color: 'secondary',
                    },
                },
                label_start: {
                    type: 'boolean',
                    default: true,
                    view: {
                        sizeMd: 12,
                        labelPlacement: 'start',
                    },
                },
            },
            required: [
                'center_item_content',
            ],
        },
        yes_no: {
            type: 'boolean',
            widget: 'OptionsRadio',
            enum: [true, false],
            view: {
                sizeMd: 3,
            },
        },
        layouts: {
            type: 'array',
            widget: 'OptionsCheck',
            view: {
                sizeMd: 3,
            },
            info: [
                'Some Info!',
            ],
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
                        title: 'right sidebar',
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
                'sidebar_left',
            ],
        },
        size: {
            type: 'string',
            widget: 'OptionsRadio',
            view: {
                sizeMd: 3,
            },
            enum: [
                'small',
                'middle',
                'big',
            ],
        },
        sizeDef: {
            type: 'string',
            widget: 'OptionsRadio',
            default: 'middle',
            view: {
                sizeMd: 3,
            },
            oneOf: [
                {const: 'small'},
                {const: 'middle', title: 'md'},
                {const: 'big', tt: 'upper'},
            ],
        },
        services: {
            type: 'array',
            widget: 'SelectChips',
            //default: "adult",
            view: {
                sizeMd: 3,
            },
            items: {
                type: 'string',
                oneOf: [
                    {const: 'development'},
                    {const: 'design'},
                    {const: 'hosting'},
                    {const: 'consulting'},
                ],
            },
        },
        services_second: {
            type: 'array',
            widget: 'SelectChips',
            default: ['it-system'],
            view: {
                sizeMd: 3,
                color: 'secondary',
                size: 'medium',
            },
            items: {
                type: 'string',
                oneOf: [
                    {const: 'marketing'},
                    {const: 'it-admin'},
                    {const: 'it-system'},
                    {const: 'telecom'},
                ],
            },
        },
        age: {
            type: 'string',
            widget: 'Select',
            //default: "adult",
            view: {
                denseOptions: true,
                sizeMd: 3,
            },
            enum: [
                'child',
                'teen',
                'adult',
                '50plus',
            ],
        },
        age_oneof: {
            type: 'string',
            widget: 'Select',
            //default: "adult",
            view: {
                denseOptions: true,
                sizeMd: 3,
            },
            oneOf: [
                {
                    const: 'child',
                    readOnly: true,
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
        ages: {
            type: 'array',
            minItems: 2,
            maxItems: 3,
            widget: 'SelectMulti',
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
                        readOnly: true,
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
        select_numbers1: {
            view: {
                sizeMd: 3,
            },
            'type': 'string',
            'widget': 'Select',
            't': {
                de: {
                    'enum': {
                        '0': 'Null',
                        '1': 'Eins',
                        '-1': 'Negative Eins',
                    },
                },
                en: {
                    'enum': {
                        '0': 'Zero',
                        '1': 'One',
                        '-1': 'Negative One',
                    },
                },
            },
            'enum': ['-1', '-2', '0', '1', '2', '_abc', '__H', 'h'],
        },
        select_numbers2: {
            view: {
                sizeMd: 3,
            },
            'type': 'number',
            'widget': 'Select',
            'enum': [-1, -2, 0, 1, 2],
        },
        select_numbers3: {
            view: {
                sizeMd: 3,
            },
            ttEnum: false,
            'type': 'string',
            'widget': 'Select',
            'enum': ['-1', '-2', '0', '1', '2', '_abc', '__H', 'h'],
        },
        select_numbers4: {
            view: {
                sizeMd: 3,
            },
            ttEnum: false,
            'type': 'number',
            'widget': 'Select',
            'enum': [-1, -2, 0, 1, 2],
        },
        select_numbers5: {
            type: 'array',
            widget: 'SelectMulti',
            view: {
                sizeMd: 3,
            },
            items: {
                oneOf: [
                    {
                        title: 'one',
                        'const': 1,
                    },
                    {
                        title: 'two',
                        'const': 2,
                    },
                    {
                        title: 'tree',
                        'const': 3,
                    },
                ],
            },
        },
        desc: {
            type: 'object',
            widget: 'TextRich',
            view: {
                sizeMd: 3,
            },
        },
    },
    required: [
        'info',
        'layouts',
        'size',
        'age',
        'slider_h',
        'ages',
    ],
};

const dataDemoMain = {
    headline: 'Some Demo Headline',
    //qty2: 10000000000000000000111,
    qty2: 'e130f',
};


const schemaUser = createOrderedMap({
    type: 'object',
    title: 'headline',
    /*view: {
        sizeMd: 6,
    },*/
    properties: {
        name: {
            type: 'string',
            minLength: 2,
            maxLength: 3,
            view: {
                sizeMd: 6,
            },
        },
        surname: {
            type: 'string',
            view: {
                sizeMd: 6,
            },
        },
        address: {
            type: 'object',
            properties: {
                street: {
                    type: 'string',
                    view: {
                        sizeMd: 9,
                    },
                },
                street_no: {
                    type: 'string',
                    view: {
                        sizeMd: 3,
                    },
                },
                city: {
                    type: 'string',
                    view: {
                        sizeMd: 12,
                    },
                },
                country: {
                    type: 'string',
                    view: {
                        sizeMd: 12,
                    },
                },
            },
        },
        birthday: {
            type: 'string',
            format: 'date',
            view: {
                sizeMd: 6,
            },
        },
        quantity: {
            type: 'number',
            view: {
                sizeMd: 6,
            },
        },
    },
})

export {schemaDemoMain, dataDemoMain, schemaUser}
