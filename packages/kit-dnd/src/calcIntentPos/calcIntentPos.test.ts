import { expect, describe, test } from '@jest/globals'
import { calcIntentPos, CalcDragIntentEvent } from '@ui-schema/kit-dnd/calcIntentPos'
import { DndIntents, DndDragIntentPos } from '@ui-schema/kit-dnd/KitDnd'

/**
 * npm run tdd -- --testPathPattern=src/calcIntentPos.test.ts
 */

describe('calcIntentPos', () => {
    test.each([
        [{
            initialClientX: 0, initialClientY: 0,
            clientX: 0, clientY: 0,
            targetHeight: 0, targetWidth: 0,
            targetX: 0, targetY: 0,
        }, {
            colX: NaN,
            colY: NaN,
            edgeX: 'left',
            edgeY: 'top',
            posQuarter: undefined,
            x: DndIntents.same,
            y: DndIntents.same,
        }],
        [{
            initialClientX: 0, initialClientY: 0,
            clientX: 5, clientY: 20,
            targetHeight: 50, targetWidth: 600,
            targetX: 0, targetY: 10,
        }, {
            colX: 0,
            colY: 2,
            edgeX: 'left',
            edgeY: undefined,
            posQuarter: 'top-left',
            x: DndIntents.right,
            y: DndIntents.down,
        }],
        [{
            initialClientX: 0, initialClientY: 0,
            clientX: 595, clientY: 55,
            targetHeight: 50, targetWidth: 600,
            targetX: 0, targetY: 10,
        }, {
            colX: 12,
            colY: 11,
            edgeX: 'right',
            edgeY: 'bottom',
            posQuarter: 'bottom-right',
            x: DndIntents.right,
            y: DndIntents.down,
        }],
    ] as [CalcDragIntentEvent, DndDragIntentPos | undefined][])(
        'calcIntentPos(%j, %s)',
        (value, expected) => {
            const intent = calcIntentPos(value)
            if (typeof expected === 'undefined') {
                expect(typeof intent).toBe('undefined')
            } else {
                expect(intent).toStrictEqual(expected)
            }
        }
    )
})
