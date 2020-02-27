import React from "react";
import {Map} from "immutable";
import {
    EditorState,
    convertFromRaw,
    convertToRaw,
    EditorBlock
} from 'draft-js';
import {draftToMarkdown, markdownToDraft} from 'markdown-draft-js';

function getBlockStyle(block) {
    switch(block.getType()) {
        case 'blockquote':
            return 'RichEditor-blockquote';
        default:
            return null;
    }
}

// Custom overrides for "code" style.
const styleMap = {
    CODE: {
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        fontFamily: '"Inconsolata", "Menlo", "Consolas", monospace',
        fontSize: 16,
        padding: 3,
    },
};

const Line = props => {
    const {contentState, block} = props;
    const showLineNo = false;
    const blockMap = contentState.getBlockMap().toArray();
    const blockKey = block.key;
    const lineNumber = blockMap.findIndex(block => blockKey === block.key) + 1;
    return (
        showLineNo ?
            <div style={{display: 'flex'}}>
                <span style={{marginRight: '5px'}}>{lineNumber}</span>
                <div style={{flex: '1'}}><EditorBlock {...props} /></div>
            </div>
            :
            <EditorBlock {...props} />
    );
};

const blockRendererFn = function(contentBlock) {
    const type = contentBlock.getType();

    switch(type) {
        default:
            return {component: Line, editable: true}
    }
};

const editorStateFrom = {
    markdown: (markdown) => {
        return EditorState.createWithContent(
            convertFromRaw(markdownToDraft(markdown))
        )
    }
};

const editorStateTo = {
    raw: (editorState) => {
        const content = editorState.getCurrentContent();
        return content.hasText() ? convertToRaw(content) : '';
    },
    markdown: (editorState) => {
        const content = editorState.getCurrentContent();
        return content.hasText() ? draftToMarkdown(convertToRaw(content)) : '';
    }
};

const inlineMap = Map({
    'header-one': {
        element: 'div'
    },
    'header-two': {
        element: 'div'
    },
    'header-three': {
        element: 'div'
    },
    'header-four': {
        element: 'div'
    },
    'header-five': {
        element: 'div'
    },
    'header-six': {
        element: 'div'
    },
    'blockquote': {
        element: 'div'
    },
    'code-block': {
        element: 'div'
    },
    'atomic': {
        element: 'div'
    },
    'unordered-list': {
        element: 'div'
    },
    'ordered-list': {
        element: 'div'
    },
    'unordered-list-item': {
        element: 'div'
    },
    'ordered-list-item': {
        element: 'div'
    },
    'unstyled': {
        element: 'div'
    }
});

export {blockRendererFn, getBlockStyle, editorStateTo, editorStateFrom, styleMap, inlineMap,}
