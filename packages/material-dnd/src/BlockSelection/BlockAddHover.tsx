import React from 'react'
import IcAdd from '@material-ui/icons/AddCircle'
import IconButton from '@material-ui/core/IconButton'
import Fade from '@material-ui/core/Fade'
import { AccessTooltipIcon } from '@ui-schema/ds-material/Component/Tooltip/Tooltip'
import { BlockAddProps } from './BlockAddProps'

export interface BlockAddHoverProps {
    forceShow?: boolean
    asBlock?: boolean
}

export const BlockAddHover: React.ComponentType<BlockAddProps & BlockAddHoverProps> = (
    {
        setAddSelectionIndex, showAddSelection, index,
        forceShow, asBlock,
    }: BlockAddProps & { index: number, forceShow?: boolean, asBlock?: boolean }
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
        aria-label={showAddSelection ? 'Close Selection' : 'Add New Block'}
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
                    <AccessTooltipIcon title={showAddSelection ? 'Close Selection' : 'Add New Block'}>
                        <IcAdd fontSize={'inherit'}/>
                    </AccessTooltipIcon>}
            </IconButton>
        </Fade>
    </div>
}
