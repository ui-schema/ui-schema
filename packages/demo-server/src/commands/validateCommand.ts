/**
 * @example npm run validate -- simple01
 * @param id
 */
export const validateCommand = async (id: string) => {
    console.log('validates ' + id)
    const schema = await import('../schemas/' + id + '.json').then(mod => mod.default)
    console.log(schema)
}
