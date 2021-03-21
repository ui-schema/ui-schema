export type convertStringToNumberType = (value: string | number | any, type: string) => any | string | number

export const convertStringToNumber: convertStringToNumberType = (value, type) => {
    if (type === 'number' || type === 'integer') {
        if (isNaN(value * 1)) {
            console.error('Invalid Type: input not a number in')
            return undefined
        }
        return value === '' ? '' : value * 1
    }
    return value
}
