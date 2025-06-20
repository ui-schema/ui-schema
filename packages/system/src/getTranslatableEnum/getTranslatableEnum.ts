export const getTranslatableEnum = (value: string | number | boolean | null) => {
    return typeof value === 'boolean' ? value ? 'yes' : 'no' :
        value === null ? 'null' : value
}
