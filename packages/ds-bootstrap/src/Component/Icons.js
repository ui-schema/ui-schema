import React from "react";
import {Trans, useEditor} from "@ui-schema/ui-schema";

const Icon = ({onClick, label, iconName, btnSize}) => {
    const {t} = useEditor();

    React.useEffect(() => {
        window.$('[data-toggle="tooltip"]').tooltip()
    }, []);

    let btnScale = 1;
    switch(btnSize) {
        case("small"):
            btnScale = 0.5;
            break;
        case("medium"):
            btnScale = 1;
            break;
        case("big"):
            btnScale = 2;
            break;
    }

    return <button type="button" className={["btn", "btn-transparent"].join(' ')} style={{transform: "scale(" + btnScale + ", " + btnScale + ")"}}
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