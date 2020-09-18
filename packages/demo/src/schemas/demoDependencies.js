import {createOrderedMap} from "@ui-schema/ui-schema";

const schemaWDep1 = createOrderedMap({
    "type": "object",

    "properties": {
        "name": {
            "type": "string"
        },
        "credit_card": {
            "type": "string"
        }
    },

    "required": ["name"],

    "dependentSchemas": {
        "credit_card": {
            "properties": {
                "billing_address": {"type": "string"}
            },
            "required": ["billing_address"]
        }
    }
});

const schemaWDep2 = createOrderedMap({
    type: "object",
    properties: {
        // here `country` is defined
        country_eu: {
            type: "boolean",
        },
        country_canada: {
            type: "boolean",
        }
    },
    dependencies: {
        country_eu: {
            properties: {
                privacy: {
                    type: "boolean"
                },
                maple_trees: {
                    minimum: 10,
                }
            },
            required: [
                "privacy"
            ]
        },
        country_canada: {
            properties: {
                maple_trees: {
                    type: "number"
                }
            }
        }
    }
});

export {schemaWDep1, schemaWDep2}
