import React from "react";
import {Map} from "immutable";
import {createEmptyStore, isInvalid, SchemaEditor} from "@ui-schema/ui-schema";
import {browserT} from "../t";

const MainDummy = ({schema, Debugger, Button, widgets}) => {
    const [showValidity, setShowValidity] = React.useState(false);
    const [validity, setValidity] = React.useState(Map({}));
    const [data, setData] = React.useState(() => createEmptyStore(schema.get('type')));

    return <React.Fragment>
        <SchemaEditor
            schema={schema}
            store={data}
            onChange={setData}
            widgets={widgets}
            validity={validity}
            showValidity={showValidity}
            onValidity={setValidity}
            t={browserT}
        >
            <Debugger/>
        </SchemaEditor>

        <Button onClick={() => setShowValidity(!showValidity)}>validity</Button>
        {isInvalid(validity) ? 'invalid' : 'valid'}
    </React.Fragment>
};

const useDummy = () => {
    const [showDummy, setShowVDummy] = React.useState({});

    // todo: make real hook/using useCallback
    const toggleDummy = id => {
        let tmp = {...showDummy};
        tmp[id] = !tmp[id];
        setShowVDummy(tmp);
    };
    const getDummy = id => {
        return !!showDummy[id];
    };

    return {
        toggleDummy, getDummy
    }
};

export {MainDummy, useDummy}
