import React from 'react';
import {Translate} from '@ui-schema/react/Translate';
import {useUIMeta} from '@ui-schema/react/UIMeta';

const Icon = ({onClick, label, iconName, btnSize}) => {
    const {t} = useUIMeta();

    React.useEffect(() => {
        window.$('[data-toggle="tooltip"]').tooltip()
    }, []);

    let btnScale;
    switch(btnSize) {
        case('small'):
            btnScale = 0.5;
            break;
        case('big'):
            btnScale = 2;
            break;
        case('medium'):
        default:
            btnScale = 1;
            break;
    }

    return <button
        type="button" className={['btn', 'btn-transparent'].join(' ')} style={{transform: 'scale(' + btnScale + ', ' + btnScale + ')'}}
        data-toggle="tooltip" data-placement="right" title={t(label)} onClick={onClick}>
        <Translate text={iconName}/>
    </button>;
}

const IconPlus = ({onClick, btnSize}) => {
    return <Icon label="labels.add" iconName="icons.Plus" onClick={onClick} btnSize={btnSize}/>;
};

const IconMinus = ({onClick, btnSize}) => {
    return <Icon label="labels.remove" iconName="icons.Minus" onClick={onClick} btnSize={btnSize}/>;
};

export {IconPlus, IconMinus};
