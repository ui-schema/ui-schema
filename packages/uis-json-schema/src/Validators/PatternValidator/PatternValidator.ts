export const ERROR_PATTERN = 'pattern-not-matching'

export const validatePattern = (value?: any, pattern?: string): boolean => {
    if (typeof value === 'string' && pattern) {
        return null !== value.match(pattern)
    }

    return true
}
