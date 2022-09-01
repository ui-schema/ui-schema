import React from 'react';
import {useUID} from 'react-uid';
import useTheme from '@mui/material/styles/useTheme';
import Button from '@mui/material/Button';
import AceEditor from 'react-ace';
// todo: update react-ace to v8, using ace-builds instead of brace, creates strange `this.session = null` exceptions then and now
import 'brace/ext/language_tools';
import 'brace/ext/error_marker';
import 'brace/ext/static_highlight';
import 'brace/ext/searchbox';
import 'brace/ext/statusbar';
import 'brace/mode/json';
import 'brace/mode/css';
import 'brace/mode/dockerfile';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/typescript';
import 'brace/mode/jsx';
import 'brace/mode/mysql';
import 'brace/mode/php';
import 'brace/mode/powershell';
import 'brace/mode/scss';
import 'brace/mode/yaml';
import 'brace/theme/github';
import 'brace/theme/chrome';
import 'brace/theme/clouds_midnight';
import 'brace/theme/cobalt';
import 'brace/theme/gruvbox';
import 'brace/theme/monokai';
import {AccessTooltipIcon} from '@control-ui/kit/Tooltip';
import UnfoldLess from '@mui/icons-material/UnfoldLess';
import UnfoldMore from '@mui/icons-material/UnfoldMore';

/*import ace from 'ace-builds/src-noconflict/ace';
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-error_marker";
import "ace-builds/src-noconflict/ext-static_highlight";
import "ace-builds/src-noconflict/ext-searchbox";
import "ace-builds/src-noconflict/ext-statusbar";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/mode-dockerfile";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-jsx";
import "ace-builds/src-noconflict/mode-mysql";
import "ace-builds/src-noconflict/mode-php";
import "ace-builds/src-noconflict/mode-powershell";
import "ace-builds/src-noconflict/mode-scss";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/theme-clouds_midnight";
import "ace-builds/src-noconflict/theme-cobalt";
import "ace-builds/src-noconflict/theme-gruvbox";
import "ace-builds/src-noconflict/theme-monokai";

ace.config.set("basePath", "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/");
ace.config.setModuleUrl('ace/mode/javascript_worker', "https://cdn.jsdelivr.net/npm/ace-builds@1.4.8/src-noconflict/worker-javascript.js");*/

const supportedModes = ['json', 'css', 'dockerfile', 'html', 'javascript', 'jsx', 'typescript', 'typescript jsx', 'mysql', 'php', 'powershell', 'scss', 'yaml'];
const themes = ['clouds_midnight', 'cobalt', 'gruvbox', 'monokai'];

const themesLight = ['chrome', 'github'];

const RelativeDiv = ({children}) => <div style={{position: 'relative'}}>
    {children}
</div>;

const RichCodeEditor = ({
                            value, onChange, readOnly, style = {},
                            tabSize = 2, fontSize = 13, theme = 'gruvbox', mode = 'json', raw = false, renderChange = 0,
                            minLines = 10, maxLines = undefined, getEditor, enableShowAll = false,
                        }) => {
    const uid = useUID();
    // triple state/dual-type needed, 0 as default, true when open, false when closed,
    // is used to detect "it will have lines when closed again" - as otherwise, once opened, the "has-scrollbars" check is `false` and the show-less button will be hidden
    const [showAll, setShowAll] = React.useState(0);
    const [editor, setEditor] = React.useState({});
    const scrollBar = editor && editor.container ? editor.container.querySelector('.ace_scrollbar-v') : undefined;
    const {palette} = useTheme();

    React.useEffect(() => {
        if(editor && editor.resize && editor.renderer) {
            editor.resize();
            editor.renderer.updateFull(true);
        }
    }, [editor, renderChange]);

    if(raw) {
        return <textarea
            onChange={e => onChange(e.target.value)} value={value}
            style={{
                fontSize, fontFamily: 'Consolas, "Lucida Console", Courier, monospace', lineHeight: '1.27em',
                width: '100%', height: 'auto', flexGrow: 2,
                display: 'block', margin: 0, padding: 3, boxSizing: 'border-box',
                background: palette.background.paper, color: palette.text.primary,
                border: '1px solid ' + palette.divider,
            }}
        />;
    }

    const Wrapper = enableShowAll ? RelativeDiv : React.Fragment;

    return <Wrapper>
        <AceEditor
            mode={mode}
            theme={palette.type === 'light' ? themesLight[0] : theme}
            value={typeof value !== 'string' && value ? value.toString() : value || ''}
            onChange={onChange}
            name={'uis-' + uid}
            editorProps={{$blockScrolling: true}}
            showGutter
            showPrintMargin={false}
            highlightActiveLine
            orientation={'below'}
            style={{width: '100%', height: 'auto', flexGrow: 2, lineHeight: '1.27em', transition: 'height 0.4s linear 0s', ...style}}
            width={'100%'}
            minLines={minLines}
            maxLines={showAll ? 3000 : maxLines}
            //enableSnippets
            enableBasicAutocompletion
            enableLiveAutocompletion
            wrapEnabled
            readOnly={readOnly}
            onLoad={editor => {
                setEditor(editor);
                if(getEditor) {
                    getEditor(editor)
                }
            }}
            tabSize={tabSize}
            setOptions={{
                wrap: true,
                autoScrollEditorIntoView: true,
                enableMultiselect: true,
                useWorker: false,// currently shows errors for valid JSON, to turn syntax checking on change to `true` and check imports/workers at top of page
                mergeUndoDeltas: true,
                showLineNumbers: true,
                scrollPastEnd: 0.3,
                fontSize: fontSize,
            }}
        />
        {enableShowAll && (typeof showAll === 'boolean' || (editor && editor.container && scrollBar && scrollBar.clientHeight && scrollBar.clientWidth)) ?
            <Button style={{position: 'absolute', bottom: 27, right: 20, minWidth: 'auto', zIndex: 1}} onClick={() => setShowAll(p => !p)}>
                <AccessTooltipIcon title={showAll ? 'Show less lines' : 'Show all lines'}>
                    {showAll ? <UnfoldLess fontSize={'small'}/> : <UnfoldMore fontSize={'small'}/>}
                </AccessTooltipIcon>
            </Button> : null}
    </Wrapper>
};

export {RichCodeEditor, themes, supportedModes}
