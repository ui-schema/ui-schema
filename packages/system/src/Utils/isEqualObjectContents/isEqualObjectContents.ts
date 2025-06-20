/**
 * Compares the contents of two objects, without comparing the order of properties.
 */
export const isEqualObjectContents = (
    lastObject: object,
    currentObject: object,
    isEqual: (a: unknown, b: unknown) => boolean = (a, b) => a === b,
) => {
    // modified or new properties
    for (const key in currentObject) {
        if (!isEqual(currentObject[key], lastObject[key])) return false
    }

    // if lastObject has keys that are missing in currentObject
    for (const key in lastObject) {
        if (!Object.prototype.hasOwnProperty.call(currentObject, key)) return false
    }

    return true
}
