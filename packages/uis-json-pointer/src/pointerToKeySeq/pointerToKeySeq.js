import {List} from 'immutable'
import {unescapePointer} from '@ui-schema/json-pointer/unescapePointer';

function isInt(value) {
    let x;
    if(isNaN(value)) {
        return false;
    }
    x = parseFloat(value);
    return (x | 0) === x;
}

export const pointerToKeySeq = (pointer) => {
    // todo: take # fragment pointers into account for correct descaping (URI decode)
    // if(pointer.indexOf('#/') === 0) {}
    let pointerPoints = pointer.split('/')
    pointerPoints.splice(0, 1)
    pointerPoints = pointerPoints.map(point => {
        let key = unescapePointer(point)
        const nKey = key.trim() !== '' && Number(key)
        if(!isNaN(nKey) && isInt(nKey) && key.indexOf('.') === -1) {
            key = parseInt(key)
        }
        return key
    })
    if(pointerPoints.length === 1 && pointerPoints[0] === '') {
        pointerPoints.splice(0, 1)
    }
    //console.log(pointerPoints, pointer)
    return List(pointerPoints)
}
