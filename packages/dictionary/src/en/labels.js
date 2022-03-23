export const labels = {
    'loading': 'Loading',
    'ok': 'Ok',
    'add': 'Add',
    'remove': 'Remove',
    'delete': 'Delete',
    'delete-confirm': 'Confirm deletion',
    'add-number': 'Add number',
    'add-entry': 'Add entry',
    'entry': 'Entry',
    'remove-entry': 'Remove entry',
    'add-item': (context, locale) =>
        context?.getIn(['actionLabels', locale, 'add']) ?
            context?.getIn(['actionLabels', locale, 'add']) :
            'Add item',
    'remove-item': (context, locale) =>
        context?.getIn(['actionLabels', locale, 'remove']) ?
            context?.getIn(['actionLabels', locale, 'remove']) :
            'Remove item',
    'add-row': 'Add row',
    'remove-row': 'Remove row',
    'remove-rows': 'Remove rows',
    'move-up': 'Move up',
    'move-down': 'Move down',
    'move-to-position': (context) => `Move to ${context.get('nextIndex')}. position`,
}
