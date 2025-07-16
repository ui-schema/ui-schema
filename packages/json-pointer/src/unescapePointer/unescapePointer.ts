export const unescapePointer = (pointer: string): string => {
    return pointer.replace(/~1/g, '/').replace(/~0/g, '~')
}
