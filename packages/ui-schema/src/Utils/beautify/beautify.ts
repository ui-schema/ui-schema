export type tt = 'ol' | 'upper' | 'lower' | 'upper-beauty' | 'lower-beauty' | 'beauty-text' | 'beauty-igno-lead' | true | false | 0

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

const beauty = (
    name: any,
    beautified?: Map<string, string>,
): any | string => {
    if (typeof name !== 'string') return name

    const tmp = beautified?.get(name)
    if (typeof tmp !== 'undefined') return tmp

    const beauty =
        name.replace(/[_.\-\s]+/g, ' ')
            .split(' ')
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))// make first letter uppercase
            .join(' ')

    if (beautified) {
        beautified.set(name, beauty)
    }

    return beauty
}

export const beautifyKey = (name: string | number, tt: tt = true): string => {
    // falsy values disables optimistic-beautify
    if (!tt) return typeof name === 'number' ? String(name) : name

    if (typeof tt === 'string') return textTransform(name, tt)

    return beauty(name)
}
