import { StoreSchemaType } from '@ui-schema/ui-schema/CommonTypings'

/**
 * Handles schema if else then and returns the new merged schema which contains the merged value of `if` and `then`
 */
export function handleIfElseThen(
    // the schema which contains the if / else / then part
    schema: StoreSchemaType,
    // the value against which the `distSchema` is validated
    value: any,
    // the schema which must be valid for having `then` applied
    distSchema: StoreSchemaType
): StoreSchemaType
