import React from "react";
import {Head} from "@control-ui/kit/Head";
import LiveEditor from '../component/Schema/LiveEditor'

function PageLiveEdit() {
    return <>
        <Head
            title={'Examples and Live-Editor · UI-Schema'}
            description={'JSON-Schema examples and the rendered UI for it, from simple to conditional combining schemas.'}
        />
        <LiveEditor/>
    </>;
}

export default PageLiveEdit
