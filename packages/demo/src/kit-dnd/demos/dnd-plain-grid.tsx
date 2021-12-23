import React from 'react'
import { List } from 'immutable'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { useOnIntent } from '@ui-schema/kit-dnd/useOnIntent'
import { DraggableBlock } from '../components/DraggableBlock'
import { KitDndProvider, KitDndProviderContextType } from '@ui-schema/kit-dnd/KitDndProvider/KitDndProvider'

export const KitDndPlainGrid = () => {
    const [list, setList] = React.useState<List<string>>(List(['caaa-1', 'cbbb-2', 'cccc-3', 'cddd-4', 'ceee-5']))
    const dataKeys = React.useMemo(() => List([]), [])
    const {onIntent} = useOnIntent<HTMLDivElement>()

    const onMove: KitDndProviderContextType<HTMLDivElement>['onMove'] = React.useMemo(() => {
        // important, or more one way-to-do-it: using `useMemo` instead of `useCallback`, as the return on `onIntent` is compatible with `onMove`
        // just a bit cleaner to write then when using `useCallback`, not even possible to accidentally using the wrong `details` var
        return onIntent(({fromItem, toItem}, intent, _intentKeys, done) => {
            if (!intent) {
                return
            }
            if (
                intent.y && intent.x &&
                (intent.y !== 'same' || intent.x !== 'same') &&
                !intent.edgeX && !intent.edgeY
            ) {
                const {index: fromIndex, id: fromId} = fromItem
                const {id: toId} = toItem
                setList((list) => {
                    const toIndex = list.findIndex(i => i === toId)
                    if (toIndex !== -1) {
                        list = list.splice(fromIndex, 1)
                            .splice(toIndex, 0, fromId)
                    }
                    return list
                })
                done()
                return
            }
            return
        })
    }, [setList, onIntent])

    return <>
        <h2>Plain Grid Draggable</h2>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <KitDndProvider<HTMLDivElement> onMove={onMove} scope={'a3'}>
                    {list.map((i, j) =>
                        <DraggableBlock
                            key={i}
                            id={i}
                            index={j}
                            isLast={j >= (list?.size - 1)}
                            isFirst={j === 0}
                            dataKeys={dataKeys}
                            cols={6}
                        />
                    )?.valueSeq()}
                </KitDndProvider>
            </DndProvider>
        </div>
    </>
}
