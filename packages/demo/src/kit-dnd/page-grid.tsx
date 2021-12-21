import React from 'react'
import { List } from 'immutable'
import { NavLink as Link } from 'react-router-dom'
import { DndProvider } from 'react-dnd'
import { MultiBackend } from 'react-dnd-multi-backend'
import { HTML5toTouch } from 'rdndmb-html5-to-touch'
import { DndValueList } from '@ui-schema/kit-dnd/KitDnd'
import { useOnIntent } from '@ui-schema/kit-dnd/useOnIntent'
import { KitDndProvider, KitDndProviderContextType } from '@ui-schema/kit-dnd/KitDndProvider'
import { moveDraggedValue } from '@ui-schema/kit-dnd/Utils/moveDraggedValue'
import { addNestKey } from '@ui-schema/kit-dnd/Utils/addNestKey'
import { genId } from '@ui-schema/kit-dnd/genId'
import { DraggableAny } from './components/DraggableAny'

const KitDndAreas = () => {
    const [areas, setAreas] = React.useState<DndValueList>(
        List([
            {
                id: 'a-4',
                list: List([
                    /*{id: 'ar-d-1'},
                    {id: 'ar-d-2'},*/
                ]),
            },
            {
                id: 'a-2',
                list: List([
                    {id: 'ar-b-1'},
                    {
                        id: 'a-1',
                        list: List([
                            {id: 'ar-a-1'},
                            {id: 'ar-a-2'},
                        ]),
                    },
                    {id: 'ar-b-2'},
                    {id: 'ar-b-3'},
                    {id: 'ar-b-4'},
                ]),
            },
            {
                id: 'a-3',
                list: List([
                    {id: 'ar-c-1'},
                    {id: 'ar-c-2'},
                    {id: 'ar-c-3'},
                ]),
            },
        ])
    )
    const dataKeys: List<number> = React.useMemo(() => List([]), [])
    const {onIntent} = useOnIntent<HTMLDivElement>({edgeSize: 12})
    const lastMergeTag = React.useRef<{
        time: number
        timer: number | undefined
        merge: undefined | string
        id: string | undefined
    }>({time: 0, timer: undefined, merge: undefined, id: undefined})

    const onMoved: KitDndProviderContextType<HTMLDivElement>['onMoved'] = React.useCallback((details) => {
        onIntent((
            {
                item,
                toDataKeys, toIndex,
                toType, targetId,
            },
            intent,
            intentKeys,
            done,
        ) => {
            if (!intent || !intentKeys) {
                return
            }
            if (lastMergeTag.current.timer) {
                window.clearTimeout(lastMergeTag.current.timer)
            }
            const fromType = item.type
            const fromKeys = item.dataKeys
            const fromIsDroppable = fromType === 'AREA'
            const toIsDroppable = toType === 'AREA'
            if (
                // an area can not be dragged deeper into itself:
                (fromIsDroppable && intentKeys.willBeParent && intentKeys.level === 'down')
            ) {
                //console.log(' IGNO from  ' + fromType + '  to  ' + toType, intent, intentKeys)
                return
            }
            console.log('  from  ' + fromType + '  to  ' + toType, intent, intentKeys)
            console.log('  from  ' + fromType + '  to  ' + toType, fromKeys?.toJS(), item.index, toDataKeys.toJS(), toIndex)

            if (!toIsDroppable) {
                // - BLOCK > BLOCK
                // - AREA  > BLOCK
                if (
                    intentKeys.level === 'up' ||
                    intentKeys.level === 'same' ||
                    intentKeys.level === 'switch'
                ) {
                    if (intent.edgeX || intent.edgeY) {
                        return
                    }
                    // - switching within one array or between different relative roots
                    setAreas((areas) => {
                        return moveDraggedValue(
                            areas,
                            addNestKey('list', fromKeys), item.index,
                            addNestKey('list', toDataKeys), toIndex,
                        )
                    })
                    done()
                    return
                }

                if (
                    intentKeys.level === 'down' &&
                    (toDataKeys.size - fromKeys.size) >= 1
                ) {
                    if (intentKeys.isParent || intentKeys.willBeParent) {
                        return
                    }
                    // ONLY when moving `down`, from outside the same list
                    let dk = toDataKeys
                    if (intentKeys.wasBeforeRelative) {
                        // was before this block in the relative store order
                        // thus the last relative key needs to be decreased
                        dk = dk.update(fromKeys.size, (toIndexRelativeFirst) => (toIndexRelativeFirst as number) - 1)
                    }
                    setAreas((areas) => {
                        areas = moveDraggedValue(
                            areas,
                            addNestKey('list', fromKeys), item.index,
                            addNestKey('list', dk), toIndex,
                        )
                        done(dk, toIndex)
                        return areas
                    })
                    return
                }
            }

            if (
                toIsDroppable && (
                    intentKeys.level === 'down' || intentKeys.level === 'up' ||
                    intentKeys.level === 'same' || intentKeys.level === 'switch'
                )
            ) {
                // - any > AREA
                if (
                    (
                        // ignoring dragging to own area, when it's not dragging up and on any edge
                        intentKeys.isParent && intentKeys.level !== 'up'// && !intent.edgeY && !intent.edgeX
                    ) || (
                        // ignoring on y-edges when not dragging up,
                        // to allow adding blocks at the end of an area from within another area in that area
                        intentKeys.level !== 'up' && intent.edgeY
                    ) || (
                        // ignoring x-edges for every action to make it possible to drag in-between nested blocks
                        !fromIsDroppable && intent.edgeX && intentKeys.level !== 'up'
                    )
                ) {
                    return
                }

                const setter = (doMerge: string | undefined) => {

                    setAreas((areas) => {
                        let dk = toDataKeys

                        const orgTks = addNestKey<string | number>('list', toDataKeys.push(toIndex))
                        let ti = intent.posQuarter === 'top-left' || intent.posQuarter === 'top-right' ? 0 :
                            ((areas.getIn(orgTks) as List<any>)?.size || 0)
                        // when level up, adjust the dataKeys parent according to the new nested index
                        // and either add to `0` or last index
                        if (intentKeys.level === 'same' && intentKeys.container === 'down' && intentKeys.wasBeforeRelative) {
                            dk = dk.push(toIndex - 1 || 0)
                        } else if (intentKeys.level === 'down' && intentKeys.wasBeforeRelative) {
                            // was before this block in the relative store order
                            // thus the last relative key needs to be decreased
                            dk = dk.update(fromKeys.size, (toIndexRelativeFirst) => (toIndexRelativeFirst as number) - 1)
                            dk = dk.push(toIndex)
                        } else if (doMerge) {
                            if (doMerge === 'next') {
                                //dk = dk.push(toIndex + 1)
                                ti = toIndex + 1
                            } else if (doMerge === 'prev') {
                                //dk = dk.push(toIndex)
                                ti = toIndex
                            } else {
                                throw new Error('merge not implemented: ' + JSON.stringify(doMerge))
                                //dk = dk.push(toIndex)
                            }
                        } else {
                            dk = dk.push(toIndex)
                        }
                        const tks = addNestKey<string | number>('list', dk)
                        areas = moveDraggedValue(
                            areas,
                            addNestKey('list', fromKeys), item.index,
                            tks, ti,
                        )
                        done(dk, ti)
                        return areas
                    })
                }

                let doMerge: string | undefined = undefined
                if (intentKeys.level === 'up' && intentKeys.isParent) {
                    // handling AREA > AREA that are not siblings to get siblings
                    if (!intent.edgeY && !intent.edgeX) {
                        // no edges active
                        return
                    }
                    // todo: only respects X-axis or Y-axis flow for areas, in XY-axis flow it would need to find the related area below it's own area
                    if (intent.edgeX) {
                        if (intent.edgeX === 'right') {
                            // move to right of parent
                            doMerge = 'next'
                        } else if (intent.edgeX === 'left') {
                            // move to left of parent
                            doMerge = 'prev'
                        }
                    } else if (intent.edgeY) {
                        if (intent.edgeY === 'bottom') {
                            // move to bottom of parent
                            doMerge = 'next'
                        } else if (intent.edgeY === 'top') {
                            // move to top of parent
                            doMerge = 'prev'
                        }
                    }
                    if (!doMerge) {
                        return
                    }

                    if (doMerge) {
                        const ts = new Date().getTime()
                        if (
                            lastMergeTag.current.merge !== doMerge ||
                            lastMergeTag.current.id !== targetId
                        ) {
                            window.clearTimeout(lastMergeTag.current.timer)
                            lastMergeTag.current.time = ts
                            lastMergeTag.current.merge = doMerge
                            lastMergeTag.current.id = targetId
                            return
                        }
                        const sinceLastMerge = (ts - lastMergeTag.current.time)
                        if (sinceLastMerge > 450) {
                            window.clearTimeout(lastMergeTag.current.timer)
                            lastMergeTag.current.time = 0
                            setter(doMerge)
                            return
                        } else if (!lastMergeTag.current.timer) {
                            lastMergeTag.current.timer = window.setTimeout(() => {
                                setter(doMerge)
                            }, 450)
                            return
                        } else {
                            return
                        }
                    } else {
                        return
                    }
                }

                setter(undefined)
                return
            }
        })(details)
    }, [setAreas, onIntent, lastMergeTag])

    const allowedTypes = React.useMemo(() => ['BLOCK', 'AREA'], [])

    return <>
        <div>
            <h2>Area Draggable</h2>
            <button onClick={() => setAreas(a => a.push({id: genId(), list: List([])}))}>Add Area</button>
            <button onClick={() => setAreas(a => a.push({id: genId(6)}))}>Add Block</button>
        </div>
        <div style={{display: 'flex', flexDirection: 'row'}}>
            <DndProvider backend={MultiBackend} options={HTML5toTouch}>
                <KitDndProvider onMoved={onMoved} scope={'a2'}>
                    {areas.map((area, j) =>
                        <DraggableAny
                            key={area.id}
                            dataKeys={dataKeys}
                            allowedTypes={allowedTypes}
                            index={j}
                            itemCount={areas.size}
                            {...area}
                        />
                    )}
                </KitDndProvider>
            </DndProvider>
        </div>
        <div>
            <pre><code>{JSON.stringify(areas?.toJS(), undefined, 4)}</code></pre>
        </div>
    </>
}

// eslint-disable-next-line react/display-name
export default (): React.ReactElement => {
    return <div style={{maxWidth: '95%', marginLeft: 'auto', marginRight: 'auto'}}>
        <h1>Kit DnD Area Grid</h1>
        <Link to={'/kit-dnd'}>Kit DnD Plain</Link>
        <KitDndAreas/>
    </div>
}
