import React, { MouseEventHandler } from 'react'
import { Translate } from '@ui-schema/react/Translate'
import { useUIMeta } from '@ui-schema/react/UIMeta'

export interface Icon {
    onClick: MouseEventHandler<HTMLButtonElement>
    label: string
    iconName: string
    btnSize: string
}

const BaseIcon = ({onClick, label, iconName, btnSize}: Icon) => {
    const {t} = useUIMeta()

    React.useEffect(() => {
        // @ts-ignore
        window.$('[data-toggle="tooltip"]').tooltip?.()
    }, [])

    let btnScale
    switch(btnSize) {
        case('small'):
            btnScale = 0.5
            break
        case('big'):
            btnScale = 2
            break
        case('medium'):
        default:
            btnScale = 1
            break
    }

    return <button
        type="button" className={['btn'].join(' ')} style={{transform: 'scale(' + btnScale + ', ' + btnScale + ')'}}
        data-toggle="tooltip" data-placement="right"
        title={t(label) as string}
        onClick={onClick}
    >
        <Translate text={iconName}/>
    </button>
}

const IconPlus = ({onClick, btnSize}: Pick<Icon, 'onClick' | 'btnSize'>) => {
    return <BaseIcon label="labels.add" iconName="icons.Plus" onClick={onClick} btnSize={btnSize}/>
}

const IconMinus = ({onClick, btnSize}: Pick<Icon, 'onClick' | 'btnSize'>) => {
    return <BaseIcon label="labels.remove" iconName="icons.Minus" onClick={onClick} btnSize={btnSize}/>
}

export { IconPlus, IconMinus }
