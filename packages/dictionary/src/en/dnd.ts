export const dnd = {
    'dnd-close-selection': 'Close Selection',
    'dnd-add-new': (context) => 'Add new ' + (context.getIn(['name', 'en']) || 'block'),
    'dnd-add-a-block': (context) => 'Add a ' + (context.getIn(['name', 'en']) || 'block') + '!',
    'dnd-selection-title': 'Select Block',
    'dnd-show-block-info': 'Show Info',
    'dnd-close-all': 'Close All',
    'dnd-open-all': 'Open All',
    'dnd-move-up-down': 'Move up or down',
}
