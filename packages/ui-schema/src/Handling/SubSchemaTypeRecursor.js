import {validateArray} from "./ArrayValidator";
import {validateObject} from "./ObjectValidator";
import {List} from "immutable";
import {Map} from "immutable";
import {validateSchema} from "../Schema/ValidateSchema";


const TypeRecursor = (schema) => {

    if(Map.isMap(schema)) {
        schema.map((value, key) => {
            if(Map.isMap(value) || List.isList(value)) {
                let errors = List();
                if(!validateSchema(schema, value)) {
                    errors = errors.push(validateSchema(schema, value));
                }

                if(!validateArray(schema, value, false)) {
                    errors = errors.push(validateArray(schema, value, false));
                }
                if(!validateObject(schema, value, false)) {
                    errors = errors.push(validateObject(schema, value, false));
                }
                TypeRecursor(value);
                return errors;
            }
        });
    } else if(List.isList(schema)) {
        for(let listElement of schema) {
            if(Map.isMap(listElement) || List.isList(listElement)) {
                let errors = List();
                if(!validateSchema(schema, listElement)) {
                    errors = errors.push(validateSchema(schema, listElement));
                }

                if(!validateArray(schema, listElement, false)) {
                    errors = errors.push(validateArray(schema, listElement, false));
                }
                if(!validateObject(schema, listElement, false)) {
                    errors = errors.push(validateObject(schema, listElement, false));
                }
                TypeRecursor(listElement);
                return errors;
            }
        }
    }
};

export default TypeRecursor;