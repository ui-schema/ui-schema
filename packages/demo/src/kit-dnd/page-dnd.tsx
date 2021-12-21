import React from 'react'
import { KitDndPlain } from './demos/dnd-plain'
import { KitDndPlainGrid } from './demos/dnd-plain-grid'
import { NavLink as Link } from 'react-router-dom'

// eslint-disable-next-line react/display-name
export default (): React.ReactElement => {
    return <div style={{maxWidth: '95%', marginLeft: 'auto', marginRight: 'auto'}}>
        <h1>Kit DnD</h1>
        <Link to={'/kit-dnd-grid'}>Kit DnD Grid</Link>
        <KitDndPlain/>
        <KitDndPlainGrid/>
    </div>
}
