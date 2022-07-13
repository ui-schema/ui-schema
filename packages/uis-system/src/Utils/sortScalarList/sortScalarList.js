export const sortScalarList = (list) =>
    list.sort(
        (a, b = '') =>
            typeof a === 'string' ? a.localeCompare(b) :
                typeof a === 'number' ? a > b : 1,
    )
