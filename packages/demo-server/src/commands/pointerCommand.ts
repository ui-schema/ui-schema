import { resolvePointer } from '@ui-schema/json-pointer/resolvePointer'
import { List, Map } from 'immutable'

export const pointerCommand = async () => {
    const exampleData = Map({
        prop_a: Map({
            a1: 'a1-val',
            a2: 'a2-val',
        }),
        prop_b: Map({
            b1: Map({
                b1a: 'b1a-val',
                b1b: 'b1b-val',
            }),
        }),
        prop_c: List([
            'c1-item',
            Map({
                c2a: 'c2a-val',
                c2b: 'c2b-val',
            }),
        ]),
    })
    const pointers = [
        '/prop_a/a1',
        '/prop_b/b1/b1a',
        '/prop_b/b1/b1b',
        '/prop_c/0',
        '/prop_c/1/c2b',
    ]
    pointers.forEach(pointer => {
        console.log('Pointer: `' + pointer + '`, data: ', resolvePointer(pointer, exampleData))
    })
}
