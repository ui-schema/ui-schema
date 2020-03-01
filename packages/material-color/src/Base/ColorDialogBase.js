import React from "react";
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import {ColorBase} from "./ColorBase";

const ColorDialogDialog = ({hasFocus, setFocus, children}) => <Dialog
    open={hasFocus} onClose={() => setFocus(false)}
>
    {children}
    <Button onClick={() => setFocus(false)}>Ok</Button>
</Dialog>;

const ColorDialogBase = ({ColorPicker, CustomDialog, ...props}) => (
    <ColorBase
        {...props}
        PickerContainer={CustomDialog || ColorDialogDialog}
        ColorPicker={ColorPicker}
        refocus={false}
    />
);

export {ColorDialogBase};
