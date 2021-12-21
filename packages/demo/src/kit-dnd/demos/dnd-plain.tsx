import React from 'react'
import { List } from 'immutable'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { Draggable } from '@ui-schema/kit-dnd/Draggable'
import { DndIntents } from '@ui-schema/kit-dnd/KitDnd'
import { useOnIntent } from '@ui-schema/kit-dnd/useOnIntent'
import { DraggableBlock, DraggableBlockProps } from '../components/DraggableBlock'
import { KitDndProvider, KitDndProviderContextType } from '@ui-schema/kit-dnd/KitDndProvider/KitDndProvider'

export const KitDndPlain = () => {
    const [list, setList] = React.useState<List<string>>(List(['aaaa-1', 'abbb-2', 'accc-3']))
    const dataKeys = React.useMemo(() => List([]), [])
    const {onIntent} = useOnIntent<HTMLDivElement>()

    const onMoved: KitDndProviderContextType<HTMLDivElement>['onMoved'] = React.useCallback((
        details
    ) => {
        // example using `useCallback` for `onMoved`, it is important to not use `details` directly but to pass it to `onIntent`,
        // use the data received by the `cb` instead -> or better use `useMemo`
        onIntent(({item, toIndex}, intent, _intentKeys, done) => {
            if (!intent) {
                return
            }
            // example: only supporting `y` axis directions within one list, using `colY` to provide some no-drag gutters
            switch (intent.y) {
                case DndIntents.up:
                    if (intent.colY >= 10) {
                        return
                    }
                    setList((list) =>
                        list.splice(item.index, 1)
                            .splice(toIndex, 0, item.id)
                    )
                    done()
                    return
                case DndIntents.down:
                    if (intent.colY <= 2 || intent.colY >= 10) {
                        return
                    }
                    setList((list) =>
                        list.splice(item.index, 1)
                            .splice(toIndex, 0, item.id)
                    )
                    done()
                    return
            }
            return
        })(details)
    }, [setList, onIntent])

    const allowedTypes = React.useMemo(() => ['BLOCK'], [])

    return <>
        <h2>Plain Draggable</h2>

        <div style={{display: 'flex', flexDirection: 'column'}}>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <KitDndProvider onMoved={onMoved} scope={'a1'}>
                    {list.map((i, j) =>
                        <Draggable<HTMLDivElement, DraggableBlockProps>
                            Item={DraggableBlock}
                            key={i}
                            id={i}
                            index={j}
                            itemCount={list.size}
                            itemType={'BLOCK'}
                            dataKeys={dataKeys}
                            allowedTypes={allowedTypes}
                            fullDrag
                        />
                    )?.valueSeq()}
                </KitDndProvider>
            </DndProvider>
        </div>
    </>
}
