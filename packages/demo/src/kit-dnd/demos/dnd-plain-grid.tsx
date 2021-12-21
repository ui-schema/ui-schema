import React from 'react'
import { List } from 'immutable'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { Draggable } from '@ui-schema/kit-dnd/Draggable'
import { useOnIntent } from '@ui-schema/kit-dnd/useOnIntent'
import { DraggableBlock } from '../components/DraggableBlock'
import { KitDndProvider, KitDndProviderContextType } from '@ui-schema/kit-dnd/KitDndProvider/KitDndProvider'

export const KitDndPlainGrid = () => {
    const [list, setList] = React.useState<List<string>>(List(['caaa-1', 'cbbb-2', 'cccc-3', 'cddd-4', 'ceee-5']))
    const dataKeys = React.useMemo(() => List([]), [])
    const {onIntent} = useOnIntent<HTMLDivElement>()

    const onMoved: KitDndProviderContextType<HTMLDivElement>['onMoved'] = React.useMemo(() => {
        // important, or more one way-to-do-it: using `useMemo` instead of `useCallback`, as the return on `onIntent` is compatible with `onMoved`
        // just a bit cleaner to write then when using `useCallback`, not even possible to accidentally using the wrong `details` var
        return onIntent(({item, targetId}, intent, _intentKeys, done) => {
            if (!intent) {
                return
            }
            if (
                intent.y && intent.x &&
                (intent.y !== 'same' || intent.x !== 'same') &&
                !intent.edgeX && !intent.edgeY
            ) {
                setList((list) => {
                    const toIndex = list.findIndex(i => i === targetId)
                    if (toIndex !== -1) {
                        list = list.splice(item.index, 1)
                            .splice(toIndex, 0, item.id)
                    }
                    return list
                })
                done()
                return
            }
            return
        })
    }, [setList, onIntent])

    const allowedTypes = React.useMemo(() => ['BLOCK'], [])

    return <>
        <h2>Plain Grid Draggable</h2>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <KitDndProvider onMoved={onMoved} scope={'a3'}>
                    {list.map((i, j) =>
                        <Draggable<HTMLDivElement>
                            Item={DraggableBlock}
                            key={i}
                            id={i}
                            index={j}
                            itemCount={list.size}
                            itemType={'BLOCK'}
                            dataKeys={dataKeys}
                            allowedTypes={allowedTypes}
                            cols={6}
                        />
                    )?.valueSeq()}
                </KitDndProvider>
            </DndProvider>
        </div>
    </>
}
