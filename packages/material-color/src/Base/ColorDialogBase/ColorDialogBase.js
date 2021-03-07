import React from 'react';
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import {ColorBase} from '../ColorBase/ColorBase';
import {Trans} from '@ui-schema/ui-schema/Translate/Trans';

const ColorDialogDialog = ({hasFocus, setFocus, children}) => <Dialog
    open={hasFocus} onClose={() => setFocus(false)}
>
    {children}
    <Button onClick={() => setFocus(false)}><Trans text={'labels.ok'}/></Button>
</Dialog>;

export const ColorDialogBase = ({ColorPicker, CustomDialog, ...props}) => (
    <ColorBase
        {...props}
        PickerContainer={CustomDialog || ColorDialogDialog}
        ColorPicker={ColorPicker}
        refocus={false}
    />
);
