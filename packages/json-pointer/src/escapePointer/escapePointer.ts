export function escapePointer(pointer: string): string {
    return pointer.replace(/~/g, '~0').replace(/\//g, '~1')
}
