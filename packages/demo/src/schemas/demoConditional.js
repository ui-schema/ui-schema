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

const schemaWConditional2 = createOrderedMap({
    "type": "object",
    "allOf": [
        {
            "type": "object",
            "properties": {
                "product_groups": {
                    "type": "array",
                    "widget": "SelectMulti",
                    "enum": [
                        "Apps",
                        "Homepages",
                        "Online-Shop",
                        "Print Design",
                        "Logo Design"
                    ]
                }
            }
        }, {
            "if": {
                "type": "object",
                "properties": {
                    "product_groups": {
                        "type": "array",
                        "contains": {
                            "type": "string",
                            "const": "Apps"
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "group_apps": {
                        "type": "string",
                        "widget": "Text"
                    }
                }
            }
        }, {
            "if": {
                "type": "object",
                "properties": {
                    "product_groups": {
                        "type": "array",
                        "contains": {
                            "type": "string",
                            "const": "Homepages"
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "group_homepages": {
                        "type": "string",
                        "widget": "Select",
                        "enum": [
                            "Landing-Page",
                            "Business-Page"
                        ]
                    }
                }
            }
        }, {
            "if": {
                "type": "object",
                "properties": {
                    "product_groups": {
                        "type": "array",
                        "contains": {
                            "type": "string",
                            "const": "Homepages"
                        }
                    },
                    "group_homepages": {
                        "type": "string",
                        "const": "Landing-Page"
                    }
                }
            },
            "then": {
                "properties": {
                    "type_of_landing_page": {
                        "type": "string",
                        "widget": "Select",
                        "enum": [
                            "Business Fair",
                            "Software Product",
                            "Service",
                            "Promotion"
                        ]
                    }
                }
            }
        }, {
            "if": {
                "type": "object",
                "properties": {
                    "product_groups": {
                        "type": "array",
                        "contains": {
                            "type": "string",
                            "const": "Online-Shop"
                        }
                    }
                }
            },
            "then": {
                "properties": {
                    "group_shop": {
                        "type": "string",
                        "widget": "Text"
                    }
                }
            }
        }
    ]
});

export {schemaWConditional, schemaWConditional1, schemaWConditional2}
