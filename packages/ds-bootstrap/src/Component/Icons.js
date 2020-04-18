import React from "react";
import {Trans, useEditor} from "@ui-schema/ui-schema";

const Icon = ({onClick, label, iconName, btnSize}) => {
    const {t} = useEditor();

    React.useEffect(() => {
        window.$('[data-toggle="tooltip"]').tooltip()
    }, []);

    let style = document.createElement('style');
    style.innerHTML = '.cssClass {transform: scale(' + btnSize + ', ' + btnSize + ');}';
    document.getElementsByTagName('head')[0].appendChild(style);
    let classNameArray = ["btn", "btn-transparent", "cssClass"].join(' ');

    return <button type="button" className={classNameArray}
                   data-toggle="tooltip" data-placement="right" title={t(label)} onClick={onClick}>
        <Trans text={iconName}/>
    </button>;
}

const IconPlus = ({onClick, btnSize}) => {
    return <Icon label="labels.add" iconName="icons.Plus" onClick={onClick} btnSize={btnSize}/>;
};

const IconMinus = ({onClick, btnSize}) => {
    return <Icon label="labels.remove" iconName="icons.Minus" onClick={onClick} btnSize={btnSize}/>;
};

export {IconPlus, IconMinus};