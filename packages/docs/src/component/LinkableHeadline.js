import React from "react";
import {Button, Collapse, Typography} from "@material-ui/core";
import {AccessTooltipIcon} from "./Tooltip";
import {Link as LinkIcon} from "@material-ui/icons";
import {LinkList, ListItemLink} from "./Link";

const HeadlinesContext = React.createContext({});

const useHeadlines = () => React.useContext(HeadlinesContext);

const HeadlinesProvider = ({children} = {}) => {
    const contextState = React.useState({});

    return <HeadlinesContext.Provider value={contextState}>
        {children}
    </HeadlinesContext.Provider>
};

const copyToClipboard = str => {
    const el = document.createElement('textarea');
    el.value = str;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
};

const LinkableHeadline = ({level, children, ...p}) => {
    const [, setHeadlines] = useHeadlines();
    const [hovering, setHovering] = React.useState(false);
    const id = children && children[0] && children[0].props && children[0].props.value ?
        children[0].props.value
            .replace(/[,&\d.\\/\s|]/g, '-').replace(/--/g, '-').replace(/^--/, '')
            .toLowerCase().substr(0, 40)
        : undefined;

    React.useEffect(() => {
        if(id) {
            setHeadlines((headlines) => {
                const head = {...headlines};
                if(!head[id]) {
                    head[id] = {
                        level,
                        children: children[0]
                    };
                    return head;
                }
                return headlines;
            });
        }
        return () => {
            if(id) {
                setHeadlines((headlines) => {
                    const head = {...headlines};
                    if(head[id]) {
                        delete head[id];
                        return head;
                    }
                    return headlines;
                });
            }
        }
    }, [id, setHeadlines, children, level]);

    return <Typography
        {...p} component={'h' + (level + 1)} variant={'h' + (level)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        id={id} style={{
        marginTop: level === 1 ? 38 : 18 * (6 / level),
        marginBottom: level === 1 ? 44 :
            level < 5 ? 12 * (6 / level) :
                16 * (6 / level),
        marginLeft: -24, paddingLeft: 24, position: 'relative'
    }}
    >
        {id ? <Button
            component={'a'} color={'primary'} aria-hidden="true"
            onFocus={() => setHovering(true)}
            onBlur={() => setHovering(false)}
            onClick={() => copyToClipboard(window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + id)}
            href={window.location.protocol + '//' + window.location.host + window.location.pathname + '#' + id}
            style={{left: -6, top: '50%', minWidth: 'auto', transform: 'translateY(-50%)', position: 'absolute', border: 0, padding: 0, opacity: hovering ? 1 : 0.01}}
        ><AccessTooltipIcon title={'Copy Link to Clipboard'}>
            <LinkIcon fontSize={'small'} style={{boxSizing: 'content-box', padding: 6, display: 'block'}}/>
        </AccessTooltipIcon></Button> : null}
        {children}
    </Typography>
};

const HeadlineMenu = ({initial = false}) => {
    const [open, setOpen] = React.useState(initial);
    const [headlines] = useHeadlines();

    return <LinkList>
        <Button fullWidth onClick={() => setOpen(o => !o)}>{open ? 'Hide' : 'Show'} Content Menu</Button>

        <Collapse in={open} timeout="auto" unmountOnExit>
            {Object.keys(headlines).map(id => (
                <ListItemLink key={id} to={'#' + id} dense primary={headlines[id].children} style={{paddingLeft: 12 * headlines[id].level}}/>
            ))}
        </Collapse>
    </LinkList>
};

export {LinkableHeadline, HeadlinesProvider, useHeadlines, HeadlineMenu}
