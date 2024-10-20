export const labels = {
    'loading': 'Lade..',
    'ok': 'Ok',
    'add': 'Hinzufügen',
    'remove': 'Entfernen',
    'delete': 'Löschen',
    'delete-confirm': 'Wirklich löschen?',
    'add-number': 'Neue Nummer',
    'add-entry': 'Neuer Eintrag',
    'entry': 'Eintrag',
    'remove-entry': 'Entferne Eintrag',
    'add-item': (context, locale) =>
        context?.getIn(['actionLabels', locale, 'add']) ?
            context?.getIn(['actionLabels', locale, 'add']) :
            'Neues Element',
    'remove-item': (context, locale) =>
        context?.getIn(['actionLabels', locale, 'remove']) ?
            context?.getIn(['actionLabels', locale, 'remove']) :
            'Lösche Element',
    'add-row': 'Neue Zeile',
    'remove-row': 'Lösche Zeile',
    'remove-rows': 'Lösche Zeilen',
    'move-up': 'Nach oben',
    'move-down': 'Nach unten',
    'move-to-position': (context) => `Verschiebe zur ${context.get('nextIndex')}. Position`,
}
