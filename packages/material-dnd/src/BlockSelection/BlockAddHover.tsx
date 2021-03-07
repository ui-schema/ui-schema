import React from 'react'
import IcAdd from '@material-ui/icons/AddCircle'
import IconButton from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip/Tooltip'
import { BlockAddProps } from './BlockAddProps'
import { Trans } from '@ui-schema/ui-schema'
import { Map } from 'immutable'

export interface BlockAddHoverProps {
    forceShow?: boolean
    asBlock?: boolean
    index: number
    nameOfBlock?: string[]
}

export const BlockAddHover: React.ComponentType<BlockAddProps & BlockAddHoverProps> = (
    {
        setAddSelectionIndex, showAddSelection, index,
        forceShow, asBlock, nameOfBlock,
    }
) => {
    const [showAdd, setShowAdd] = React.useState(false)
    return <div
        style={asBlock ? {
            position: 'relative',
            zIndex: 1,
            bottom: '-0.75em',
            textAlign: 'center',
        } : {
            position: 'absolute', zIndex: 1, height: 6,
            bottom: '0', left: '15%', right: '15%',
        }}
        onMouseEnter={() => setShowAdd(true)}
        onBlur={() => setShowAdd(false)}
        onMouseLeave={() => setShowAdd(false)}
        tabIndex={0}
        onFocus={e => {
            e.stopPropagation()
            setShowAdd(true)
        }}
        onClick={(e) => {
            e.stopPropagation()
            setAddSelectionIndex(index)
            setShowAdd(false)
        }}
        onKeyPress={e => {
            e.stopPropagation()
            if (e.key === 'Enter') {
                setAddSelectionIndex(index)
                setShowAdd(false)
            }
        }}
    >
        <Fade in={forceShow || showAdd}>
            <IconButton
                color={'inherit'}
                size={'medium'}
                tabIndex={-1}
                style={asBlock ? {
                    position: 'relative', zIndex: 1,
                    padding: 2, fontSize: '1.25rem',
                    opacity: showAdd ? 1 : 0.4,
                } : {
                    position: 'absolute', zIndex: 1,
                    bottom: '-0.5em',
                    left: '50%', transform: 'translateX(-50%)',
                    padding: 2, fontSize: '1.25rem',
                    opacity: showAdd ? 1 : 0.4,
                }}
            >
                {showAddSelection ? null :
                    // @ts-ignore
                    <AccessTooltipIcon title={
                        showAddSelection ?
                            <Trans text={'labels.dnd-close-selection'}/> :
                            <Trans text={'labels.dnd-add-new'} context={Map({name: nameOfBlock})}/>
                    }>
                        <IcAdd fontSize={'inherit'}/>
                    </AccessTooltipIcon>}
            </IconButton>
        </Fade>
    </div>
}
