export const ERROR_MULTIPLE_OF = 'multiple-of'

const getScale = (n: number): number => {
    const s = n.toString().split('.')[1]
    return s ? 10 ** s.length : 1
}

export const validateMultipleOf = (multipleOf: number | undefined, value: any): boolean => {
    if (typeof value === 'number' && typeof multipleOf === 'number') {
        if (
            !Number.isFinite(value)
            || !Number.isFinite(multipleOf)
            || multipleOf === 0
        ) return false

        // Using BigInt to support comparing small floating point multipleOf.
        const scale = Math.max(getScale(value), getScale(multipleOf))

        const scaledValue = BigInt(Math.round(value * scale))
        const scaledMultipleOf = BigInt(Math.round(multipleOf * scale))

        return scaledValue % scaledMultipleOf === 0n
    }

    return true
}
