import React from "react";
import clsx from "clsx";
import {Map} from "immutable";
import {beautifyKey, updateValue} from "@ui-schema/ui-schema";
import {useUID} from "react-uid";
import FormLabel from "@material-ui/core/FormLabel";
import makeStyles from "@material-ui/core/styles/makeStyles";
import useTheme from "@material-ui/core/styles/useTheme";
import {ValidityHelperText} from "@ui-schema/ds-material/es/Component/LocaleHelperText";
import {Controlled as CodeMirror} from "react-codemirror2";
import style from "codemirror/lib/codemirror.css";
/*import themeMaterial from 'codemirror/theme/material.css';
import themeMaterial from 'codemirror/theme/3024-day.css';
import themeMaterial from 'codemirror/theme/3024-night.css';
import themeMaterial from 'codemirror/theme/base16-dark.css';
import themeMaterial from 'codemirror/theme/base16-light.css';
import themeMaterial from 'codemirror/theme/darcula.css';*/
import themeDark from 'codemirror/theme/duotone-dark.css';
import themeLight from 'codemirror/theme/duotone-light.css';
/*import themeMaterial from 'codemirror/theme/gruvbox-dark.css';
import themeDark from 'codemirror/theme/xq-dark.css';
import themeLight from 'codemirror/theme/xq-light.css';*/

const useStyle = (styles) => {
    React.useEffect(() => {
        styles.use();
        return () => styles.unuse();
    }, [styles]);
};

const useStyles = makeStyles({
    root: {
        flex: '1 1 auto',
        marginTop: 0,
        height: '100%',
        position: 'relative',
        '& .CodeMirror': {
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            height: '100%',
        },
    },
});

const useStylesDynamic = makeStyles(({palette}) => ({
    rootBorder: ({theme}) => ({
        [`& .cm-s-${theme} .CodeMirror-gutters`]: {
            borderRight: '1px solid ' + palette.divider
        },
    }),
}));

const Code = ({
                  storeKeys, ownKey, schema, value, onChange,
                  onValidity, showValidity, valid, errors, required,
              }) => {
    const uid = useUID();
    const {palette} = useTheme();
    const [lines, setLines] = React.useState(1);
    const [editor, setEditor] = React.useState();
    const [focused, setFocused] = React.useState(false);

    useStyle(style);
    useStyle(palette.type === 'dark' ? themeDark : themeLight);
    const theme = palette.type === 'dark' ? 'duotone-dark' : 'duotone-light';
    const classes = useStyles();
    const classesDynamic = useStylesDynamic({theme,});

    const format = schema.get('format');
    // todo: multi format w/ selection
    if(typeof format !== 'string') return null;

    React.useEffect(() => {
        if(onValidity) {
            onValidity(updateValue(storeKeys, Map({'__valid': valid})));
        }
    }, [valid]);

    React.useEffect(() => {
        if(editor && editor.refresh) {
            editor.refresh();
        }
    }, [editor]);

    let height = 0;
    if(editor && editor.display && editor.display.lineDiv && editor.display.lineDiv.children && editor.display.lineDiv.children[0]
    ) {
        height = editor.display.lineDiv.children[0].clientHeight;
    }

    if(editor && editor.display && editor.display.gutters && editor.display.wrapper) {
        if(schema.getIn(['view', 'bg']) !== true) {
            editor.display.gutters.style.background = 'transparent';
            editor.display.wrapper.style.background = 'transparent';
        }
    }

    const handleOnChange = React.useCallback((editor,) => {
        if(editor.doc.size !== lines) {
            setLines(editor.doc.size);
        }
    }, [setLines, lines]);

    const handleBeforeChange = React.useCallback((editor, data, value) => {
        onChange(updateValue(storeKeys, value));
    }, [onChange, storeKeys]);

    const options = React.useMemo(() => ({
        mode: format,
        theme,
        lineNumbers: true
    }), [format]);

    return <React.Fragment>
        <FormLabel error={!valid && showValidity} style={{marginBottom: 12, display: 'block'}}>
            {beautifyKey(ownKey, schema.get('tt'))}{required ? ' *' : null}
        </FormLabel>
        <div style={{minHeight: '2rem', height: lines ? ((lines + 1) * height) + 6 : 'auto', position: 'relative'}}>
            <CodeMirror
                className={clsx(
                    classes.root, 'uis-' + uid,
                    classesDynamic.rootBg,
                    classesDynamic.rootBorder,
                    'MuiInput-underline',
                    focused ? 'Mui-focused' : null
                )}
                editorDidMount={setEditor}
                value={value}
                onBeforeChange={handleBeforeChange}
                onChange={handleOnChange}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                options={options}
            />
        </div>
        <ValidityHelperText errors={errors} showValidity={showValidity} schema={schema}/>
    </React.Fragment>
};

export {Code};
