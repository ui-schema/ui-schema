import React from 'react'
import { makeStyles, useTheme, Theme, createStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import FirstPageIcon from '@material-ui/icons/FirstPage'
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft'
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight'
import LastPageIcon from '@material-ui/icons/LastPage'
import { AccessTooltipIcon } from '@ui-schema/ds-material'
import { Trans } from '@ui-schema/ui-schema'
import { TablePaginationActionsProps } from '@ui-schema/ds-material/BaseComponents/Table/TableTypes'

const useStyles1 = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexShrink: 0,
            marginLeft: theme.spacing(2.5),
        },
    })
)

export const TablePaginationActions: React.ElementType<TablePaginationActionsProps> = (props) => {
    const classes = useStyles1()
    const theme = useTheme()
    const {count, page, rowsPerPage, onPageChange} = props

    const handleFirstPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, 0)
    }

    const handleBackButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page - 1)
    }

    const handleNextButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, page + 1)
    }

    const handleLastPageButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1))
    }

    return (
        <div className={classes.root}>
            <IconButton
                onClick={handleFirstPageButtonClick}
                disabled={page === 0}
            >
                {/* @ts-ignore */}
                <AccessTooltipIcon title={<Trans text={'pagination.first-page'}/>}>
                    {theme.direction === 'rtl' ? <LastPageIcon/> : <FirstPageIcon/>}
                </AccessTooltipIcon>
            </IconButton>
            <IconButton onClick={handleBackButtonClick} disabled={page === 0}>
                {/* @ts-ignore */}
                <AccessTooltipIcon title={<Trans text={'pagination.prev-page'}/>}>
                    {theme.direction === 'rtl' ? <KeyboardArrowRight/> : <KeyboardArrowLeft/>}
                </AccessTooltipIcon>
            </IconButton>
            <IconButton
                onClick={handleNextButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                {/* @ts-ignore */}
                <AccessTooltipIcon title={<Trans text={'pagination.next-page'}/>}>
                    {theme.direction === 'rtl' ? <KeyboardArrowLeft/> : <KeyboardArrowRight/>}
                </AccessTooltipIcon>
            </IconButton>
            <IconButton
                onClick={handleLastPageButtonClick}
                disabled={page >= Math.ceil(count / rowsPerPage) - 1}
            >
                {/* @ts-ignore */}
                <AccessTooltipIcon title={<Trans text={'pagination.last-page'}/>}>
                    {theme.direction === 'rtl' ? <FirstPageIcon/> : <LastPageIcon/>}
                </AccessTooltipIcon>
            </IconButton>
        </div>
    )
}
