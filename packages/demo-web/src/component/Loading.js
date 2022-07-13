import React from 'react';

const toEm = (v) => (v / 16) + 'em';

const DefaultDiv = (p) => <div {...p}/>;

class Loading extends React.PureComponent {
    render() {
        // error is e.g. given from `Loadable` and is considered fatal error
        // errorWarning is is considered simple error
        const {
            error, center,
            width, height,
        } = this.props;

        let style = {
            wrapper: this.props.styleWrapper || {},
            item: this.props.styleItem || {}
        };

        // values are in px, calculated against 16px em base to build responsive loader
        const config = {
            color: '#4aa8b3',
            items: 3,
            gap: 3,
            width: 12,
            widthActive: 12,
            height: 12,
            heightActive: 12,
            opacity: 0.2
        };

        const dur = 1.2 || 0.925;
        const item = {
            attributeType: "XML",
            dur: dur + 's',
            repeatCount: "indefinite"
        };

        const widthAll = (config.items * (config.widthActive + config.gap)) - config.gap;

        let heightDiff = (config.heightActive - config.height) / 2;

        let widthDiff = (config.widthActive - config.width) / 2;

        let Comp = this.props.comp ? this.props.comp : DefaultDiv;

        return (
            <React.Fragment>
                {this.props.children}

                <Comp className={'loading-wrapper' + (center ? ' center' : '') + (error ? ' error' : '')} style={style.wrapper}>
                    <svg
                        version="1.1" x="0px" y="0px"
                        width={toEm(width || widthAll)}
                        height={toEm(height || config.heightActive)}
                        viewBox={'0 0 ' + widthAll + ' ' + config.heightActive}
                        fill={config.color}
                        style={{display: 'block', margin: 'auto'}}>
                        <rect
                            x="0"
                            y={toEm(heightDiff)}
                            width={toEm(config.width)}
                            height={toEm(config.height)}
                            opacity={1}>
                            <animate attributeName="opacity" values={config.opacity + '; 1; ' + config.opacity} begin="0" {...item}/>
                            <animate
                                attributeName="height" values={config.height + '; ' + config.heightActive + '; ' + config.height}
                                begin={0} {...item}/>
                            <animate
                                attributeName="width" values={config.width + '; ' + config.widthActive + '; ' + config.width}
                                begin={0} {...item}/>
                            <animate attributeName="y" values={toEm(heightDiff) + '; 0; ' + toEm(heightDiff)} begin="0" {...item}/>
                            <animate attributeName="x" values={toEm(widthDiff) + '; 0; ' + toEm(widthDiff)} begin="0" {...item}/>
                        </rect>
                        <rect
                            x={(config.widthActive + config.gap + widthDiff)}
                            y={toEm(heightDiff)}
                            width={toEm(config.width)}
                            height={toEm(config.height)}
                            opacity={config.opacity}>
                            <animate
                                attributeName="opacity" values={config.opacity + '; 1; ' + config.opacity} begin={(dur / 4) + 's'} {...item}/>
                            <animate
                                attributeName="height" values={config.height + '; ' + config.heightActive + '; ' + config.height}
                                begin={(dur / 4) + 's'} {...item}/>
                            <animate
                                attributeName="width" values={config.width + '; ' + config.widthActive + '; ' + config.width}
                                begin={(dur / 4) + 's'} {...item}/>
                            <animate attributeName="y" values={toEm(heightDiff) + '; 0; ' + toEm(heightDiff)} begin={(dur / 4) + 's'} {...item}/>
                            <animate
                                attributeName="x"
                                values={
                                    toEm(config.widthActive + config.gap + widthDiff) + '; ' +
                                    toEm((config.widthActive + config.gap)) + '; ' +
                                    toEm(config.widthActive + config.gap + widthDiff)
                                }
                                begin={(dur / 4) + 's'} {...item}/>
                        </rect>
                        <rect
                            x={(2 * (config.widthActive + config.gap)) + widthDiff}
                            y={toEm(heightDiff)}
                            width={toEm(config.width)}
                            height={toEm(config.height)}
                            opacity={config.opacity}>
                            <animate
                                attributeName="opacity" values={config.opacity + '; 1; ' + config.opacity} begin={(dur / 4 * 2) + 's'} {...item}/>
                            <animate
                                attributeName="height" values={config.height + '; ' + config.heightActive + '; ' + config.height}
                                begin={(dur / 4 * 2) + 's'} {...item}/>
                            <animate
                                attributeName="width" values={config.width + '; ' + config.widthActive + '; ' + config.width}
                                begin={(dur / 4 * 2) + 's'} {...item}/>
                            <animate attributeName="y" values={toEm(heightDiff) + '; 0; ' + toEm(heightDiff)} begin={(dur / 4 * 2) + 's'} {...item}/>
                            <animate
                                attributeName="x"
                                values={
                                    ((2 * (config.widthActive + config.gap)) + widthDiff) + '; ' +
                                    toEm((2 * (config.widthActive + config.gap))) + '; ' +
                                    ((2 * (config.widthActive + config.gap)) + widthDiff)
                                }
                                begin={(dur / 4 * 2) + 's'} {...item}/>
                        </rect>
                    </svg>
                </Comp>
            </React.Fragment>
        )
    }
}

export {Loading};
