export const escapePointer = (pointer) => {
    return pointer.replace(/~/g, '~0').replace(/\//g, '~1')
}
