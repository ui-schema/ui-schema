import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import React from 'react'
import Typography from '@mui/material/Typography'

export const SearchLink = styled(Link)`
    opacity: 0.85;
    transition: 0.325s ease-out opacity;
    text-decoration: none;
    color: inherit;
    text-decoration-color: inherit;
    &:hover {
        opacity: 1;
        text-decoration: underline;
    }
`

export const SearchHighlight: React.ComponentType<React.PropsWithChildren<{}>> = ({children}) => (
    <Typography variant={'inherit'} component={'span'} color={'primary'} style={{fontWeight: 'bold'}}>{children}</Typography>
)
