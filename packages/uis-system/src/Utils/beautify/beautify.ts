import { Map } from 'immutable'

export type tt = 'ol' | 'upper' | 'lower' | 'upper-beauty' | 'lower-beauty' | 'beauty-text' | 'beauty-igno-lead' | true | false | 0

/**
 * @todo replace with other regex
 */
export const strReplaceAll = (str: string, search: string, replacement: string): string => {
    return str.split(search).join(replacement)
}

/**
 * Runtime Cache: strReplace, split, join etc. in that amount on every re-render could lead to performance problems
 * As each input results in the same output, an easy key-value cache is used
 *
 * @todo move this into a runtime context
 */
let beautified = Map()

const textTransform = (name: string | number, tt: tt) => {
    switch (tt) {
        case 'ol':
            if (typeof name === 'number') return (name + 1) + '.'
            break
        case 'upper':
            if (typeof name === 'string') return name.toUpperCase()
            break
        case 'lower':
            if (typeof name === 'string') return name.toLowerCase()
            break
        case 'upper-beauty':
            if (typeof name === 'string') return beauty(name).toUpperCase()
            break
        case 'lower-beauty':
            if (typeof name === 'string') return beauty(name).toLowerCase()
            break
        case 'beauty-text':
            if (typeof name === 'string' && isNaN(Number(name))) return beauty(name)
            break
        case 'beauty-igno-lead':
            if (typeof name === 'string') {
                let lastIndex = 0
                do {
                    if ((new RegExp(/[.\-_]/g)).exec(name[lastIndex]) === null) {
                        break
                    }
                    lastIndex++
                } while (lastIndex < name.length)
                return name.slice(0, lastIndex) + beauty(name.slice(lastIndex))
            }
            break
    }

    return name
}

const beauty = (name: any): any | string => {
    if (typeof name !== 'string') return name

    const tmp = beautified.get(name)
    if (tmp) return tmp

    const beauty =
        strReplaceAll(
            strReplaceAll(
                strReplaceAll(name, '_', ' '),
                '.', ' '),
            '-', ' ',
        )
            .replace(/  +/g, ' ')
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))// make first letter uppercase
            .join(' ')

    beautified = beautified.set(name, beauty)

    return beauty
}

export const beautifyKey = (name: string | number, tt: tt = true): string => {
    // falsy values disables optimistic-beautify
    if (!tt) return typeof name === 'number' ? String(name) : name

    if (typeof tt === 'string') return textTransform(name, tt)

    return beauty(name)
}
