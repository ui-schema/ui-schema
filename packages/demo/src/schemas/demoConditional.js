import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaWConditional = createOrderedMap({
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
        }
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
                type: "boolean"
            }
        },
        required: [
            "accept"
        ],
    }
});

const schemaWConditional1 = createOrderedMap({
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
                }
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
                }
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
                }
            },
            then: {
                required: ['privacy']
            }
        }, {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "usa"
                    }
                }
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

export {schemaWConditional, schemaWConditional1}
