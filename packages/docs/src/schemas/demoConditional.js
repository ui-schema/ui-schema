import {createOrderedMap} from "@ui-schema/system/createMap";

const schemaConditional = createOrderedMap({
    title: "Person",
    type: "object",
    properties: {
        country: {
            type: "string",
            widget: 'Select',
            enum: [
                "usa",
                "canada",
                "eu"
            ],
            default: "eu"
        }
    },
    required: [
        "country"
    ],
    if: {
        properties: {
            "country": {
                type: 'string',
                const: "canada"
            }
        },
        required: ["country"],
    },
    then: {
        properties: {
            "maple_trees": {
                type: "number"
            }
        },
    },
    else: {
        properties: {
            "accept": {
                type: "boolean",
                const: true,
            }
        },
        required: [
            "accept"
        ],
    }
});

const dataConditional = createOrderedMap({});

const schemaConditionalAllOf = createOrderedMap({
    title: "Person",
    type: "object",
    properties: {
        country: {
            type: "string",
            widget: 'Select',
            enum: [
                "usa",
                "canada",
                "eu",
                "de",
            ],
            default: "eu"
        }
    },
    required: [
        "country"
    ],
    allOf: [
        {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "canada"
                    }
                },
                required: ["country"],
            },
            then: {
                properties: {
                    "maple_trees": {
                        type: "number"
                    }
                },
            }
        }, {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        enum: ["eu", "de"]
                    }
                },
                required: ["country"],
            },
            then: {
                properties: {
                    "privacy": {
                        type: "boolean"
                    }
                }
            }
        }, {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "de"
                    }
                },
                required: ["country"],
            },
            then: {
                required: ['privacy'],
                properties: {
                    "privacy": {
                        const: true,
                    }
                }
            }
        }, {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "usa"
                    }
                },
                required: ["country"],
            },
            then: {
                properties: {
                    "nickname": {
                        type: "string"
                    }
                },
            }
        }
    ]
});

const dataConditionalAllOf = createOrderedMap({});

export {
    schemaConditional, dataConditional,
    schemaConditionalAllOf, dataConditionalAllOf,
}
