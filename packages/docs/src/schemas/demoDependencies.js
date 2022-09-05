import {createOrderedMap} from "@ui-schema/system/createMap";

const schemaDependencies = createOrderedMap({
    "type": "object",

    "properties": {
        "name": {
            "type": "string"
        },
        "credit_card": {
            "type": "string",
            deleteOnEmpty: true,
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

const dataDependencies = createOrderedMap({});

const schemaDependenciesBooleans = createOrderedMap({
    type: "object",
    properties: {
        extra_text: {
            type: "boolean",
            deleteOnEmpty: true,
        },
        extra_number: {
            type: "boolean",
            deleteOnEmpty: true,
        },
        required_number: {
            type: "boolean",
            deleteOnEmpty: true,
        }
    },
    dependencies: {
        extra_text: {
            properties: {
                some_text: {
                    type: "string"
                }
            },
        },
        extra_number: {
            properties: {
                some_number: {
                    type: "number"
                }
            }
        },
        required_number: {
            required: [
                "some_number"
            ]
        }
    }
});

const dataDependenciesBooleans = createOrderedMap({});

export {
    schemaDependencies, dataDependencies,
    schemaDependenciesBooleans, dataDependenciesBooleans,
}
