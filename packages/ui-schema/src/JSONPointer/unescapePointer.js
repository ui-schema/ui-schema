export const unescapePointer = (pointer) => {
    return pointer.replace(/~1/g, '/').replace(/~0/g, '~')
}
