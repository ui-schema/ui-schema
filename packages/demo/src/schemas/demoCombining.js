import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaWCombining = createOrderedMap({
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
        },
        address: {
            allOf: [
                {
                    type: "object",
                    properties: {
                        street_address: {type: "string"},
                        city: {type: "string"},
                        state: {type: "string", widget: "Select", enum: ["other"]}
                    },
                    required: ["street_address", "city", "state"],
                    allOf: [
                        {
                            if: {
                                properties: {
                                    "state": {
                                        type: 'string',
                                        const: "rlp"
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    "zip": {
                                        type: "number"
                                    }
                                },
                            },
                        }, {
                            properties: {
                                "accept": {
                                    type: 'boolean',
                                }
                            }
                        }, {
                            if: {
                                properties: {
                                    "state": {
                                        type: 'string',
                                        const: "ny"
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    "city": {
                                        const: "New-York"
                                    },
                                    "block": {
                                        type: "string",
                                        maximum: 15
                                    }
                                },
                            },
                        }, {
                            type: "object",
                            properties: {
                                profile: {
                                    type: "object",
                                    view: {
                                        sizeMd: 6
                                    },
                                    properties: {
                                        name: {type: "string"},
                                        type: {type: "string", widget: "Select", enum: ["business", "private", "other"]}
                                    },
                                    required: ["type"],
                                    allOf: [
                                        {
                                            if: {
                                                properties: {
                                                    "type": {
                                                        type: "string",
                                                        const: "business"
                                                    }
                                                }
                                            },
                                            then: {
                                                properties: {
                                                    "division": {
                                                        type: "string"
                                                    }
                                                },
                                            },
                                        }, {
                                            if: {
                                                properties: {
                                                    "type": {
                                                        type: "string",
                                                        const: "private"
                                                    }
                                                }
                                            },
                                            then: {
                                                required: ["accept_privacy"]
                                            },
                                        }, {
                                            properties: {
                                                "accept_privacy": {
                                                    type: 'boolean',
                                                }
                                            }
                                        }
                                    ],
                                }
                            }
                        }
                    ],
                }, {
                    type: "object",
                    properties: {
                        phone: {type: "string"},
                        email: {type: "string", format: "email"},
                    },
                    required: ["email"],
                    if: {
                        properties: {
                            "phone": {
                                type: 'string',
                                minLength: 6,
                            }
                        }
                    },
                    then: {
                        properties: {
                            "phone": {
                                // only valid for: (888)555-1212 or 555-1212
                                pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$",
                            }
                        },
                    },
                }
            ]
        },
    },
    // it is possible to change deeper schema partly by a higher if/else, keep in mind, arrays are added together and not overwritten
    // this should be used with caution, if possible don't use it
    // the merging of `properties` is handled fully by immutables `mergeDeep`, and not the included `mergeSchema`
    // the position may change when not added for all cases
    allOf: [
        {
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
                    address: {
                        properties: {
                            state: {enum: ["ny"]}
                        }
                    }
                },
            },
        }, {
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
                    address: {
                        properties: {
                            state: {enum: ["quebec"]}
                        }
                    }
                },
            },
        }, {
            if: {
                properties: {
                    "country": {
                        type: 'string',
                        const: "eu"
                    }
                }
            },
            then: {
                properties: {
                    address: {
                        properties: {
                            state: {enum: ["rlp"]}
                        }
                    }
                },
            },
        },
    ]
});

export {schemaWCombining}
