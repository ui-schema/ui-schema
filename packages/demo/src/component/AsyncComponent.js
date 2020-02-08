import React from "react";
import Loadable from "react-loadable";
import {Loading} from "./Loading";

const asyncComponent = (loader, name, label, preload = undefined) => {
    const LoadableComp = Loadable({
        loader,
        loading: (load_props) => <Loading {...load_props} styleWrapper={{padding: '6px 0'}} name={name} label={label}/>,
    });

    if(preload) {
        LoadableComp.preload();
    }

    return LoadableComp;
};

const Async = ({loader, name, label, preload, ...props} = {}) => {
    const Comp = asyncComponent(loader, name, label, preload);

    return <Comp {...props}/>
};

export {Async, asyncComponent};
