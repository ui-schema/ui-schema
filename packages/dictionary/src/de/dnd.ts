export const dnd = {
    'dnd-close-selection': 'Schließe Auswahl',
    // keine verben/adverben hier, da dies im Gegensatz zu English noch das Geschlecht des `name` benötigen würde
    // z.B. `Neuer + (name)` würde ergeben: `Neuer Adresse` (korrekt: Neue), `Neuer Event` (korrekt: Neues)
    'dnd-add-new': (context) => context.getIn(['name', 'de']) || 'Block',
    'dnd-add-a-block': (context) => context.getIn(['name', 'de']) || 'Block',
    'dnd-selection-title': 'Wähle Block',
    'dnd-show-block-info': 'Zeige Info',
    'dnd-close-all': 'Schließe Alle',
    'dnd-open-all': 'Öffne alle',
    'dnd-move-up-down': 'Verschiebe hoch oder runter',
}
