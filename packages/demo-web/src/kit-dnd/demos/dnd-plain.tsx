import React from 'react'
import { List } from 'immutable'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndIntents } from '@ui-schema/kit-dnd/KitDnd'
import { useOnIntent } from '@ui-schema/kit-dnd/useOnIntent'
import { DraggableBlock } from '../components/DraggableBlock'
import { KitDndProvider, KitDndProviderContextType } from '@ui-schema/kit-dnd/KitDndProvider'

export const KitDndPlain = () => {
    const [list, setList] = React.useState<List<string>>(List(['aaaa-1', 'abbb-2', 'accc-3']))
    const dataKeys = React.useMemo(() => List([]), [])
    const {onIntent} = useOnIntent<HTMLDivElement>()

    const onMove: KitDndProviderContextType<HTMLDivElement>['onMove'] = React.useCallback((
        details
    ) => {
        // example using `useCallback` for `onMove`, it is important to not use `details` directly but to pass it to `onIntent`,
        // use the data received by the `cb` instead -> or better use `useMemo`
        onIntent(({fromItem, toItem}, intent, _intentKeys, done) => {
            if (!intent) {
                return
            }
            const {index: toIndex} = toItem
            const {index: fromIndex, id: fromId} = fromItem
            // example: only supporting `y` axis directions within one list, using `colY` to provide some no-drag gutters
            switch (intent.y) {
                case DndIntents.up:
                    if (intent.colY >= 10) {
                        return
                    }
                    setList((list) =>
                        list.splice(fromIndex, 1)
                            .splice(toIndex, 0, fromId)
                    )
                    done()
                    return
                case DndIntents.down:
                    if (intent.colY <= 2 || intent.colY >= 10) {
                        return
                    }
                    setList((list) =>
                        list.splice(fromIndex, 1)
                            .splice(toIndex, 0, fromId)
                    )
                    done()
                    return
            }
            return
        })(details)
    }, [setList, onIntent])

    return <>
        <h2>Plain Draggable</h2>

        <div style={{display: 'flex', flexDirection: 'column'}}>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <KitDndProvider<HTMLDivElement> onMove={onMove} scope={'a1'}>
                    {list.map((i, j) =>
                        <DraggableBlock
                            key={i}
                            id={i}
                            index={j}
                            isLast={j >= (list?.size - 1)}
                            isFirst={j === 0}
                            dataKeys={dataKeys}
                            fullDrag
                        />
                    )?.valueSeq()}
                </KitDndProvider>
            </DndProvider>
        </div>
    </>
}
